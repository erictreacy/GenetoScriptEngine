import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';
import JSZip from 'jszip';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface PhenotypeData {
  gene: string;
  phenotype: string;
  activity: string;
  implications: string;
  pharmgkbId?: string;
  guidelineLinks?: Array<{
    title: string;
    url: string;
    source: string;
  }>;
}

interface DrugRecommendation {
  drug: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  evidenceLevel?: string;
  guidelineLinks?: Array<{
    title: string;
    url: string;
    source: string;
  }>;
  clinicalAnnotations?: Array<{
    title: string;
    url: string;
    level: string;
  }>;
}

interface ReportData {
  patientId: string;
  reportDate: string;
  phenotypes: PhenotypeData[];
  recommendations: DrugRecommendation[];
}

// Function to process VCF line by line
function processLine(line: string): string {
  if (!line.trim()) return line;
  
  // Handle header lines (starting with #)
  if (line.startsWith('#')) {
    return line.trim();
  }
  
  // Handle data lines
  const fields = line.split('\t');
  
  // Ensure we have the minimum required fields
  while (fields.length < 8) {
    fields.push('.');
  }
  
  // Normalize each field
  return fields.map((field, index) => {
    field = field.trim();
    if (!field) return '.';
    
    switch (index) {
      case 0: // CHROM
        return field.startsWith('chr') ? field : `chr${field}`;
      case 1: // POS
        return /^\d+$/.test(field) ? field : '.';
      case 2: // ID
        return field === '.' || field ? field : '.';
      case 3: // REF
      case 4: // ALT
        return field.toUpperCase();
      case 5: // QUAL
        return /^[\d.]+$/.test(field) ? field : '.';
      case 6: // FILTER
        return field === '.' || field === 'PASS' ? field : 'FAIL';
      default:
        return field;
    }
  }).join('\t');
}

async function runPharmCatPreprocessor(vcfPath: string, outputDir: string): Promise<string> {
  const preprocessorPath = join(process.cwd(), '..', 'preprocessor', 'pharmcat_vcf_preprocessor.py');
  const refGenomePath = join(process.cwd(), '..', 'GRCh38_full_analysis_set_plus_decoy_hla.fa');
  const refVcfPath = join(process.cwd(), '..', 'pharmcat_positions.vcf.bgz');

  const command = `python3 ${preprocessorPath} \
    -vcf ${vcfPath} \
    -refFna ${refGenomePath} \
    -refVcf ${refVcfPath} \
    -o ${outputDir}`;

  const { stdout, stderr } = await execAsync(command);
  if (stderr) {
    console.error('PharmCAT Preprocessor Error:', stderr);
    throw new Error('PharmCAT preprocessor failed');
  }
  return stdout;
}

async function runPharmCatAnalysis(vcfPath: string, outputDir: string): Promise<string> {
  const pharmcatPath = join(process.cwd(), '..', 'bin', 'pharmcat');
  const command = `${pharmcatPath} \
    -vcf ${vcfPath} \
    -o ${outputDir} \
    -reporterJson`;

  const { stdout, stderr } = await execAsync(command);
  if (stderr) {
    console.error('PharmCAT Analysis Error:', stderr);
    throw new Error('PharmCAT analysis failed');
  }
  return stdout;
}

async function setupPharmCAT(): Promise<void> {
  // Create necessary directories
  const pharmcatRoot = join(process.cwd(), '..', '.pharmcat');
  const dataDir = join(pharmcatRoot, 'data');
  const refDir = join(dataDir, 'reference');
  
  await fs.mkdir(refDir, { recursive: true });

  // Copy reference files if they don't exist
  const refGenomePath = join(refDir, 'GRCh38_mini.fa');
  const positionsPath = join(refDir, 'pharmcat_positions.vcf.bgz');

  if (!await fs.stat(refGenomePath).catch(() => false)) {
    await fs.copyFile(
      join(process.cwd(), '..', 'GRCh38_mini.fa'),
      refGenomePath
    );
  }

  if (!await fs.stat(positionsPath).catch(() => false)) {
    await fs.copyFile(
      join(process.cwd(), '..', 'pharmcat_positions.vcf.bgz'),
      positionsPath
    );
  }
}

async function preprocessVcf(inputPath: string, outputDir: string): Promise<string> {
  const command = `python3 ${join(process.cwd(), '..', 'preprocessor', 'pharmcat_vcf_preprocessor_local.py')} \
    -vcf ${inputPath} \
    -refFna ${join(process.cwd(), '..', 'GRCh38_mini.fa')} \
    -refVcf ${join(process.cwd(), '..', 'data', 'reference', 'pharmcat_positions.vcf.bgz')} \
    -o ${outputDir}`;

  console.log('Running command:', command);
  const { stdout, stderr } = await execAsync(command);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  
  if (stderr && !stderr.includes('WARNING')) {
    console.error('PharmCAT Preprocessor Error:', stderr);
    throw new Error('PharmCAT preprocessor failed');
  }
  return stdout;
}

async function parsePreprocessedVcf(vcfPath: string): Promise<{ phenotypes: PhenotypeData[], recommendations: DrugRecommendation[] }> {
  const { stdout } = await execAsync(`bcftools view ${vcfPath}`);
  const variants = stdout.split('\n')
    .filter(line => !line.startsWith('#') && line.trim())
    .map(line => {
      const [_chrom, _pos, _id, _ref, _alt, _qual, _filter, info, _format, genotype] = line.split('\t');
      const geneMatch = info.match(/GENE=([^;]+)/);
      const functionMatch = info.match(/FUNCTION=([^;]+)/);
      
      return {
        gene: geneMatch?.[1] || '',
        function: functionMatch?.[1] || '',
        genotype
      };
    });

  // Convert variants to phenotypes and recommendations
  const phenotypes = variants.map(v => ({
    gene: v.gene,
    phenotype: v.function,
    activity: v.genotype === '0/0' ? 'Normal' : v.genotype === '0/1' ? 'Reduced' : 'Poor',
    implications: `${v.gene} ${v.function} carrier`,
    pharmgkbId: `PA${Math.floor(Math.random() * 100000)}`, // Example ID
    guidelineLinks: [{
      title: 'CPIC Guideline',
      url: `https://cpicpgx.org/guidelines/${v.gene.toLowerCase()}/`,
      source: 'CPIC'
    }]
  }));

  const recommendations = variants
    .filter(v => v.genotype !== '0/0')
    .map(v => ({
      drug: `Example Drug for ${v.gene}`,
      recommendation: `Consider dose adjustment based on ${v.gene} ${v.function} status`,
      severity: 'medium' as const,
      evidenceLevel: '1A',
      guidelineLinks: [{
        title: 'CPIC Guideline',
        url: `https://cpicpgx.org/guidelines/${v.gene.toLowerCase()}/`,
        source: 'CPIC'
      }],
      clinicalAnnotations: [{
        title: `${v.gene} Clinical Annotation`,
        url: `https://www.pharmgkb.org/gene/${v.gene}`,
        level: '1A'
      }]
    }));

  return { phenotypes, recommendations };
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 415 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const generateReport = formData.get('generateReport') === 'true' || false;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create temporary files for processing
    const tempDir = os.tmpdir();
    const inputPath = join(tempDir, `upload-${Date.now()}.vcf`);

    // Ensure PharmCAT is set up
    await setupPharmCAT();

    // Write uploaded file to temp directory
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(inputPath, Buffer.from(fileBuffer));

    // Run PharmCAT preprocessor
    console.log('Running PharmCAT preprocessor...');
    await preprocessVcf(inputPath, tempDir);

    // Find the preprocessed VCF file
    const preprocessedFiles = await fs.readdir(tempDir);
    const preprocessedVcf = preprocessedFiles.find(f => f.endsWith('.preprocessed.vcf.bgz'));
    if (!preprocessedVcf) {
      throw new Error('PharmCAT preprocessor did not generate output file');
    }

    const preprocessedVcfPath = join(tempDir, preprocessedVcf);

    // Parse the preprocessed VCF
    console.log('Analyzing preprocessed VCF...');
    const { phenotypes, recommendations } = await parsePreprocessedVcf(preprocessedVcfPath);

    // Clean up input file
    await fs.unlink(inputPath);

    if (generateReport) {
      // Generate report data
      const reportData: ReportData = {
        patientId: file.name.replace('.vcf', ''),
        reportDate: new Date().toLocaleDateString(),
        phenotypes,
        recommendations
      };

      // Create a zip file containing the VCF and report
      const zipPath = join(tempDir, `results-${Date.now()}.zip`);
      const zip = new JSZip();
      
      // Add preprocessed VCF
      const vcfContent = await fs.readFile(preprocessedVcfPath);
      zip.file(`preprocessed-${file.name}.bgz`, vcfContent);
      
      // Add report data
      zip.file('report.json', JSON.stringify(reportData, null, 2));
      
      // Generate zip file
      const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
      await fs.writeFile(zipPath, zipContent);

      // Read the zip file into memory
      const zipBuffer = await fs.readFile(zipPath);
      
      // Clean up the zip file
      await fs.unlink(zipPath);

      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="pharmcat-results.zip"`,
        },
      });
    } else {
      // Return the preprocessed VCF file
      const vcfBuffer = await fs.readFile(preprocessedVcfPath);

      return new NextResponse(vcfBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="preprocessed-${file.name}.bgz"`,
        },
      });
    }

  } catch (error) {
    console.error('Error processing VCF file:', error);
    return NextResponse.json(
      { error: 'Error processing VCF file' },
      { status: 500 }
    );
  }
}

function extractPhenotypeData(line: string) {
  const fields = line.split('\t');
  if (fields.length < 8) return null;

  // Extract relevant genetic information
  // This is a simplified example - you would need to implement the actual PharmCAT
  // analysis logic here based on your requirements
  const gene = fields[0];
  const _position = fields[1];
  const ref = fields[3];
  const alt = fields[4];
  
  // Perform PharmCAT analysis here
  // This is where you would implement the actual pharmacogenomic analysis
  // For now, we'll return a placeholder result
  return {
    gene,
    phenotype: `${ref}>${alt}`,
    activity: 'Normal',
    implications: 'Standard dosing'
  };
}

interface PhenotypeData {
  gene: string;
  phenotype: string;
  activity: string;
  implications: string;
}

interface DrugRecommendation {
  drug: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

function generateDrugRecommendations(phenotypes: PhenotypeData[]): DrugRecommendation[] {
  // This is where you would implement the actual drug recommendation logic
  // based on the PharmCAT guidelines and the patient's phenotypes
  // For now, we'll return placeholder recommendations
  return phenotypes.map(phenotype => ({
    drug: 'Example Drug',
    recommendation: 'Standard dosing recommended based on genetic profile',
    severity: 'low' as const
  }));
}

import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, createWriteStream } from 'fs';
import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import JSZip from 'jszip';

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
    const outputPath = join(tempDir, `formatted-${Date.now()}.vcf`);

    // Write uploaded file to temp directory
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

    // Create read and write streams
    const readStream = createReadStream(inputPath, { encoding: 'utf8', highWaterMark: 64 * 1024 }); // 64KB chunks
    const writeStream = createWriteStream(outputPath);

    // Process the file line by line
    let headerProcessed = false;
    let currentLine = '';
    const phenotypeData: Array<PhenotypeData> = [];

    await pipeline(
      readStream,
      async function* (source: Readable) {
        for await (const chunk of source) {
          const lines = (currentLine + chunk).split('\n');
          currentLine = lines.pop() || ''; // Keep the last partial line

          for (const line of lines) {
            if (!headerProcessed && line.startsWith('#')) {
              yield line.trim() + '\n';
              continue;
            }
            headerProcessed = true;
            const processedLine = processLine(line);
            if (generateReport) {
              // Extract phenotype data from the processed line
              const phenotype = extractPhenotypeData(processedLine);
              if (phenotype) {
                phenotypeData.push(phenotype);
              }
            }
            yield processedLine + '\n';
          }
        }
        // Process the last line if any
        if (currentLine) {
          const processedLine = processLine(currentLine);
          if (generateReport) {
            const phenotype = extractPhenotypeData(processedLine);
            if (phenotype) {
              phenotypeData.push(phenotype);
            }
          }
          yield processedLine + '\n';
        }
      },
      writeStream
    );

    // Clean up input file
    await fs.unlink(inputPath);

    if (generateReport) {
      // Generate report data
      const _reportData = {
        patientId: file.name.replace('.vcf', ''),
        reportDate: new Date().toLocaleDateString(),
        phenotypes: phenotypeData,
        recommendations: generateDrugRecommendations(phenotypeData)
      };

      // Create a zip file containing the VCF
      const zipPath = join(tempDir, `results-${Date.now()}.zip`);
      const zip = new JSZip();
      
      // Add formatted VCF
      const vcfContent = await fs.readFile(outputPath);
      zip.file(`formatted-${file.name}`, vcfContent);
      
      // Generate zip file
      const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
      await fs.writeFile(zipPath, zipContent);

      // Clean up output file
      await fs.unlink(outputPath);

      // Read the zip file into memory
      const zipBuffer = await fs.readFile(zipPath);
      
      // Clean up the zip file
      await fs.unlink(zipPath);

      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="rxblueprint-results.zip"`,
        },
      });
    } else {
      // Read the formatted VCF file into memory
      const vcfBuffer = await fs.readFile(outputPath);
      
      // Clean up the output file
      await fs.unlink(outputPath);

      return new NextResponse(vcfBuffer, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="formatted-${file.name}"`,
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

import * as duckdb from '@duckdb/duckdb-wasm';
import { AsyncDuckDB, DuckDBConfig } from '@duckdb/duckdb-wasm';

let db: AsyncDuckDB | null = null;

export async function initDuckDB(): Promise<AsyncDuckDB> {
  if (db) return db;

  // Load the DuckDB WASM bundle
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
  // Instantiate the database
  db = new AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule);
  return db;
}

export async function processVCFFile(file: File): Promise<any[]> {
  const db = await initDuckDB();
  const conn = await db.connect();

  try {
    // Create a temporary table for the VCF data
    await conn.query(`
      CREATE TABLE vcf_data (
        CHROM VARCHAR,
        POS INTEGER,
        ID VARCHAR,
        REF VARCHAR,
        ALT VARCHAR,
        QUAL DOUBLE,
        FILTER VARCHAR,
        INFO VARCHAR,
        FORMAT VARCHAR,
        SAMPLE VARCHAR
      )
    `);

    // Read the file content
    const reader = new FileReader();
    const fileContent = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsText(file);
    });

    // Filter out header lines and process data lines
    const dataLines = fileContent
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .join('\n');

    // Import the data using a temporary view
    await conn.query(`
      CREATE TEMP VIEW vcf_input AS 
      SELECT * FROM read_csv_auto('${dataLines}', delim='\t', header=false)
    `);

    // Query and return the processed data
    const result = await conn.query(`
      SELECT 
        CHROM,
        POS,
        ID,
        REF,
        ALT,
        QUAL,
        FILTER,
        INFO,
        FORMAT,
        SAMPLE
      FROM vcf_data
      ORDER BY CHROM, POS
    `);

    return result.toArray();
  } finally {
    await conn.close();
  }
}

export async function cleanupDuckDB() {
  if (db) {
    await db.terminate();
    db = null;
  }
}

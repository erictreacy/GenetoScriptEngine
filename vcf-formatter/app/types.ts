export interface VariantSummary {
  chromosome: string;
  variant_count: number;
}

export interface VCFData {
  '#CHROM': string;
  POS: number;
  ID: string;
  REF: string;
  ALT: string;
  QUAL: string;
  FILTER: string;
  INFO: string;
  FORMAT?: string;
  SAMPLE?: string;
}

export interface GuidelineLink {
  url: string;
  title: string;
  evidenceLevel?: string;
}

export interface Phenotype {
  gene: string;
  phenotype: string;
  activity?: string;
  implications?: string;
  pharmgkbId?: string;
  guidelineLinks?: GuidelineLink[];
}

export interface Recommendation {
  drug: string;
  phenotype: string;
  recommendation: string;
  evidenceLevel: string;
  guidelineLinks?: string[];
}

export interface Reference {
  id?: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  url?: string;
}

export interface ReportData {
  patientId: string;
  reportDate: string;
  variants?: VariantSummary[];
  phenotypes: Phenotype[];
  recommendations: Recommendation[];
  references: Reference[];
}

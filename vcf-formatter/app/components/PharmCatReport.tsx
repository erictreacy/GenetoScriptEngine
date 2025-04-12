'use client';

import dynamic from 'next/dynamic';
import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';

const PDFDocument = dynamic(() => Promise.resolve(Document), { ssr: false });
const PDFPage = dynamic(() => Promise.resolve(Page), { ssr: false });
const PDFText = dynamic(() => Promise.resolve(Text), { ssr: false });
const PDFView = dynamic(() => Promise.resolve(View), { ssr: false });
const PDFLink = dynamic(() => Promise.resolve(Link), { ssr: false });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  link: {
    color: '#2563EB',
    textDecoration: 'underline',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#2563EB',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#2563EB',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E40AF',
  },
  table: {
    width: 'auto',
    marginBottom: 10,
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
  } as const,
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 1,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
  },
});

interface PharmCatReportProps {
  data: {
    patientId?: string;
    reportDate: string;
    phenotypes: Array<{
      gene: string;
      phenotype: string;
      activity: string;
      implications: string;
      pharmgkbId?: string; // PharmGKB gene ID
      guidelineLinks?: Array<{
        title: string;
        url: string;
        source: string;
      }>;
    }>;
    recommendations: Array<{
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
    }>;
  };
}

export default function PharmCatReport({ data }: PharmCatReportProps) {
  return (
    <PDFDocument>
      <PDFPage size="A4" style={styles.page}>
        {/* Header */}
        <PDFView style={styles.header}>
          <PDFText style={styles.title}>GenetoScript Pharmacogenomic Report</PDFText>
          <PDFText style={styles.subtitle}>Patient ID: {data.patientId || 'Not provided'}</PDFText>
          <PDFText style={styles.subtitle}>Report Date: {data.reportDate}</PDFText>
        </PDFView>

        {/* Phenotypes Section */}
        <PDFView style={styles.section}>
          <PDFText style={styles.sectionTitle}>Genetic Phenotypes</PDFText>
          <PDFView style={styles.table}>
            <PDFView style={[styles.tableRow, styles.tableHeader]}>
              <PDFText style={{ flex: 1 }}>Gene</PDFText>
              <PDFText style={{ flex: 2 }}>Phenotype</PDFText>
              <PDFText style={{ flex: 1 }}>Activity</PDFText>
            </PDFView>
            {data.phenotypes.map((item, index) => (
              <PDFView key={index} style={styles.tableRow}>
                <PDFView style={[styles.tableCell, { flex: 1 }]}>
                  {item.pharmgkbId ? (
                    <PDFLink src={`https://www.pharmgkb.org/gene/${item.pharmgkbId}`} style={styles.link}>
                      <PDFText>{item.gene}</PDFText>
                    </PDFLink>
                  ) : (
                    <PDFText>{item.gene}</PDFText>
                  )}
                </PDFView>
                <PDFText style={[styles.tableCell, { flex: 2 }]}>{item.phenotype}</PDFText>
                <PDFText style={[styles.tableCell, { flex: 1 }]}>{item.activity}</PDFText>
              </PDFView>
            ))}
          </PDFView>
        </PDFView>

        {/* Recommendations Section */}
        <PDFView style={styles.section}>
          <PDFText style={styles.sectionTitle}>Drug Recommendations</PDFText>
          <PDFView style={styles.table}>
            <PDFView style={[styles.tableRow, styles.tableHeader]}>
              <PDFText style={{ flex: 1 }}>Drug</PDFText>
              <PDFText style={{ flex: 2 }}>Recommendation</PDFText>
              <PDFText style={{ flex: 1 }}>Severity</PDFText>
            </PDFView>
            {data.recommendations.map((item, index) => (
              <PDFView key={index} style={styles.tableRow}>
                <PDFView style={[styles.tableCell, { flex: 1 }]}>
                  {item.clinicalAnnotations?.[0] ? (
                    <PDFLink src={item.clinicalAnnotations[0].url} style={styles.link}>
                      <PDFText>{item.drug}</PDFText>
                    </PDFLink>
                  ) : (
                    <PDFText>{item.drug}</PDFText>
                  )}
                </PDFView>
                <PDFView style={[styles.tableCell, { flex: 2 }]}>
                  <PDFText>{item.recommendation}</PDFText>
                  {item.evidenceLevel && (
                    <PDFText style={{ fontSize: 10, color: '#666666', marginTop: 2 }}>
                      Evidence Level: {item.evidenceLevel}
                    </PDFText>
                  )}
                </PDFView>
                <PDFText style={[styles.tableCell, { flex: 1 }]}>{item.severity}</PDFText>
              </PDFView>
            ))}
          </PDFView>
        </PDFView>

        {/* Clinical References Section */}
        <PDFView style={styles.section}>
          <PDFText style={styles.sectionTitle}>Clinical References & Guidelines</PDFText>
          <PDFView style={styles.table}>
            <PDFView style={[styles.tableRow, styles.tableHeader]}>
              <PDFText style={{ flex: 2 }}>Drug/Gene</PDFText>
              <PDFText style={{ flex: 3 }}>Reference</PDFText>
              <PDFText style={{ flex: 1 }}>Source</PDFText>
            </PDFView>
            {data.recommendations.map((item, index) => (
              item.guidelineLinks?.map((link, linkIndex) => (
                <PDFView key={`${index}-${linkIndex}`} style={styles.tableRow}>
                  <PDFText style={[styles.tableCell, { flex: 2 }]}>{item.drug}</PDFText>
                  <PDFView style={[styles.tableCell, { flex: 3 }]}>
                    <PDFLink src={link.url} style={styles.link}>
                      <PDFText>{link.title}</PDFText>
                    </PDFLink>
                  </PDFView>
                  <PDFText style={[styles.tableCell, { flex: 1 }]}>{link.source}</PDFText>
                </PDFView>
              ))
            ))}
            {data.phenotypes.map((item, index) => (
              item.guidelineLinks?.map((link, linkIndex) => (
                <PDFView key={`gene-${index}-${linkIndex}`} style={styles.tableRow}>
                  <PDFText style={[styles.tableCell, { flex: 2 }]}>{item.gene}</PDFText>
                  <PDFView style={[styles.tableCell, { flex: 3 }]}>
                    <PDFLink src={link.url} style={styles.link}>
                      <PDFText>{link.title}</PDFText>
                    </PDFLink>
                  </PDFView>
                  <PDFText style={[styles.tableCell, { flex: 1 }]}>{link.source}</PDFText>
                </PDFView>
              ))
            ))}
          </PDFView>
        </PDFView>

        {/* Footer */}
        <PDFView style={styles.footer}>
          <PDFText>Generated by GenetoScript • {new Date().toLocaleDateString()}</PDFText>
          <PDFText>This report should be reviewed by a healthcare professional</PDFText>
          <PDFText style={{ marginTop: 5 }}>References from PharmGKB (www.pharmgkb.org)</PDFText>
        </PDFView>
      </PDFPage>
    </PDFDocument>
  );
}

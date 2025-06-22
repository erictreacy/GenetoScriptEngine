'use client';

import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Inter',
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
    fontWeight: 600,
    marginBottom: 10,
    fontFamily: 'Inter',
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
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GenetoScript Pharmacogenomic Report</Text>
          <Text style={styles.subtitle}>Patient ID: {data.patientId || 'Not provided'}</Text>
          <Text style={styles.subtitle}>Report Date: {data.reportDate}</Text>
        </View>

        {/* Phenotypes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genetic Phenotypes</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ flex: 1 }}>Gene</Text>
              <Text style={{ flex: 2 }}>Phenotype</Text>
              <Text style={{ flex: 1 }}>Activity</Text>
            </View>
            {data.phenotypes.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  {item.pharmgkbId ? (
                    <Link src={`https://www.pharmgkb.org/gene/${item.pharmgkbId}`} style={styles.link}>
                      <Text>{item.gene}</Text>
                    </Link>
                  ) : (
                    <Text>{item.gene}</Text>
                  )}
                </View>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.phenotype}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.activity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drug Recommendations</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ flex: 1 }}>Drug</Text>
              <Text style={{ flex: 2 }}>Recommendation</Text>
              <Text style={{ flex: 1 }}>Severity</Text>
            </View>
            {data.recommendations.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  {item.clinicalAnnotations && item.clinicalAnnotations.length > 0 && item.clinicalAnnotations[0].url ? (
                    <Link 
                      src={item.clinicalAnnotations[0].url} 
                      style={styles.link}
                    >
                      <Text>{item.drug}</Text>
                    </Link>
                  ) : (
                    <Text>{item.drug}</Text>
                  )}
                </View>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text>{item.recommendation}</Text>
                  {item.evidenceLevel && (
                    <Text style={{ fontSize: 10, color: '#666666', marginTop: 2 }}>
                      Evidence Level: {item.evidenceLevel}
                    </Text>
                  )}
                </View>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.severity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Clinical References Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinical References & Guidelines</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ flex: 2 }}>Drug/Gene</Text>
              <Text style={{ flex: 3 }}>Reference</Text>
              <Text style={{ flex: 1 }}>Source</Text>
            </View>
            {data.recommendations.map((item, index) => (
              item.guidelineLinks?.map((link, linkIndex) => (
                <View key={`${index}-${linkIndex}`} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.drug}</Text>
                  <View style={[styles.tableCell, { flex: 3 }]}>
                    <Link 
                      src={link.url.startsWith('http') ? link.url : `https://www.pharmgkb.org/guideline/${link.url}`} 
                      style={styles.link}
                    >
                      <Text>{link.title}</Text>
                    </Link>
                  </View>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{link.source}</Text>
                </View>
              ))
            ))}
            {data.phenotypes.map((item, index) => (
              item.guidelineLinks?.map((link, linkIndex) => (
                <View key={`gene-${index}-${linkIndex}`} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.gene}</Text>
                  <View style={[styles.tableCell, { flex: 3 }]}>
                    <Link 
                      src={link.url.startsWith('http') ? link.url : `https://www.pharmgkb.org/guideline/${link.url}`} 
                      style={styles.link}
                    >
                      <Text>{link.title}</Text>
                    </Link>
                  </View>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{link.source}</Text>
                </View>
              ))
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by GenetoScript • {new Date().toLocaleDateString()}</Text>
          <Text>This report should be reviewed by a healthcare professional</Text>
          <Text style={{ marginTop: 5 }}>References from PharmGKB (www.pharmgkb.org)</Text>
        </View>
      </Page>
    </Document>
  );
}

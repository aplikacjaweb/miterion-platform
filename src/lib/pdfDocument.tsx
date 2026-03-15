import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface NormalizedStudy {
  nctId: string;
  leadSponsorName?: string;
  phases: string[];
  overallStatus: string;
  countries: string[];
}

interface PdfDocumentData {
  error: false;
  country_name: string;
  country_code?: string;
  indication: string;
  phase: string;
  preview: {
    totalTrials: number;
    recruitingTrials: number;
    recruitingPct: number;
    countryDistribution: Array<{ country: string; count: number }>;
    topSponsors: Array<{ sponsor: string; count: number }>;
  };
  studies: NormalizedStudy[];
  key_insight?: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
  },
  h1: {
    fontSize: 24,
    color: '#0F2044',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 18,
    color: '#0D9488',
    marginTop: 40,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 14,
    color: '#0D9488',
    marginTop: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 8,
  },
  metrics: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  metricCard: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 10,
  },
  metricTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
  },
  table: {
    width: 'auto',
    marginTop: 20,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '20%',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  list: {
    marginVertical: 10,
  },
  listItem: {
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    fontSize: 10,
    color: '#64748b',
  },
});

interface PdfDocumentProps {
  data: PdfDocumentData;
}

export function PdfDocument(props: PdfDocumentProps) {
  const { data } = props;
  const studiesToDisplay = data.studies?.slice(0, 10) || [];
  const countryDistributionToDisplay = data.preview?.countryDistribution?.slice(0, 10) || [];
  const topSponsorsToDisplay = data.preview?.topSponsors?.slice(0, 10) || [];

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.h1}>Clinical Landscape Report</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: 'bold' }}>Indication:</Text> {data.indication}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: 'bold' }}>Phase:</Text> {data.phase}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: 'bold' }}>Geography:</Text> {data.country_name}
        </Text>

        {data.preview && (
          <View style={styles.metrics}>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Total Trials</Text>
              <Text style={styles.metricValue}>{data.preview.totalTrials}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Recruiting Trials</Text>
              <Text style={styles.metricValue}>
                {data.preview.recruitingTrials}
                <Text style={{ fontSize: 10, color: '#64748b' }}>
                  ({data.preview.recruitingPct}% recruiting)
                </Text>
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Recruitment Competition</Text>
              <Text style={styles.metricValue}>
                {data.preview.totalTrials <= 3 ? 'LOW' : data.preview.totalTrials <= 10 ? 'MEDIUM' : 'HIGH'}
              </Text>
            </View>
          </View>
        )}

        <Text style={{ ...styles.h2, marginTop: 20 }}>2. Landscape</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>NCT ID</Text>
            <Text style={styles.tableColHeader}>Sponsor</Text>
            <Text style={styles.tableColHeader}>Phase</Text>
            <Text style={styles.tableColHeader}>Status</Text>
            <Text style={styles.tableColHeader}>Countries</Text>
          </View>
          {studiesToDisplay.map((study: NormalizedStudy, index: number) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{study.nctId}</Text>
              <Text style={styles.tableCol}>{study.leadSponsorName || 'N/A'}</Text>
              <Text style={styles.tableCol}>{(study.phases?.length ? study.phases.join(', ') : 'N/A')}</Text>
              <Text style={styles.tableCol}>{study.overallStatus}</Text>
              <Text style={styles.tableCol}>{(study.countries?.length ? study.countries.join(', ') : 'N/A')}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.h2}>3. Distribution</Text>
        <Text style={styles.h3}>Trials by Country</Text>
        <View style={styles.list}>
          {countryDistributionToDisplay.map((c, index) => (
            <Text style={styles.listItem} key={index}>
              {c.country}: {c.count} trials
            </Text>
          ))}
        </View>

        <Text style={styles.h3}>Trials by Sponsor</Text>
        <View style={styles.list}>
          {topSponsorsToDisplay.map((s, index) => (
            <Text style={styles.listItem} key={index}>
              {s.sponsor}: {s.count} trials
            </Text>
          ))}
        </View>

        <Text style={styles.h2}>4. Key Insight</Text>
        <Text style={styles.paragraph}>
          {data.key_insight || 'No key insight available for this snapshot.'}
        </Text>

        <View style={styles.footer} fixed>
          <Text style={styles.paragraph}>
            Generated by Miterion on {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.paragraph}>Data source: ClinicalTrials.gov</Text>
        </View>
      </Page>
    </Document>
  );
}

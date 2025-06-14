// TicketPDF.jsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// Optional: custom font import (optional if you're styling bold etc. manually)
// Font.register({ family: 'Helvetica-Bold', src: '...' });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    lineHeight: 1.6,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#A97F6E',
    padding: 10,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    backgroundColor: '#004E7C',
    color: 'white',
    padding: 5,
    fontSize: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    margin: '10px 0 5px 0',
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCellKey: {
    width: '35%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#D9EDF7',
    fontWeight: 'bold'
  },
  tableCellValue: {
    width: '65%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  paragraph: {
    marginTop: 5,
    marginBottom: 10,
    padding: 5,
    border: '1px solid #ddd',
    fontSize: 10
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 3
  },
  footerNote: {
    fontSize: 8,
    marginTop: 20,
    textAlign: 'center',
    color: 'grey',
  }
});

const TicketPDF = ({ ticket }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>AUSDIAS CYBERSECURITY INCIDENCE REPORT</Text>

      {/* Sub Header */}
      <View style={styles.subHeader}>
        <Text>Employee Name: <Text style={styles.value}>
              {ticket.created_by?.username || "N/A"} (
              {ticket.created_by?.email || "N/A"})
            </Text>
        </Text>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Description of Incident</Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Current Status</Text>
          <Text style={styles.tableCellValue}>{ticket.status || 'Solved'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Priority</Text>
          <Text style={styles.tableCellValue}>{ticket.severity || 'Critical'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Incident Category</Text>
          <Text style={styles.tableCellValue}>{ticket.category || 'DoS Attack (CVE-2020-16898)'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Deadline Date</Text>
          <Text style={styles.tableCellValue}>{ticket.end_date || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Further Description</Text>
          <Text style={styles.tableCellValue}>
            {ticket.description || `The system experienced a Denial of Service (DoS) attack exploiting the CVE-2020-16898 (Bad Neighbour) vulnerability, which impacts the Windows TCP/IP stack. The attack involved the transmission of malicious ICMPv6 Router Advertisement packets, designed to cause a buffer overflow and either crash the system or allow remote code execution.`}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Attachment names</Text>
          <Text style={styles.tableCellValue}>{ticket.attachments || 'xx.jpg, xx.mp4, xx.docx'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Response Team Involved</Text>
          <Text style={styles.tableCellValue}>{ticket.response_team || 'IT Team A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Action Taken to resolve incident</Text>
          <Text style={styles.tableCellValue}>
            {'• NA\n• NA\n• NA\n• NA'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Additional Notes</Text>
          <Text style={styles.tableCellValue}>
            {ticket.notes || 'All team members have been informed of the incident and appropriate response steps. Continuous monitoring of network traffic has been set up, with additional security measures enforced.'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Brief Summary</Text>
          <Text style={styles.tableCellValue}>
            {ticket.description || `A Denial of Service (DoS) attack leveraging CVE-2020-16898 was detected, resulting in network disruptions. The system has since been patched, and enhanced monitoring measures are now in place to prevent future incidents.`}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Time incident occurred</Text>
          <Text style={styles.tableCellValue}>{ticket.start_date || '09:00am 05/05/2024'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellKey}>Time incident was Resolved</Text>
          <Text style={styles.tableCellValue}>{ticket.end_date || '05/09/2024'}</Text>
        </View>
      </View>

      {/* Footer Note */}
      <Text style={styles.footerNote}>
        This is a generative report created by the AUSDIAS Incidence Response Planning Tool
      </Text>
    </Page>
  </Document>
);

export default TicketPDF;

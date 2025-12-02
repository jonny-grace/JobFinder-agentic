import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer'; // Import Link

// --- HELPERS ---
const formatSkills = (skills: any) => {
  if (!skills) return "";
  if (typeof skills === "string") return skills;
  if (typeof skills === "object") {
     return Object.entries(skills).map(([cat, list]) => `${cat}: ${list}`).join(" | ");
  }
  return String(skills);
};

// Remove https for display text, but keep it for href
const cleanLinkText = (url: string) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};

// Ensure URL has protocol for href
const ensureProtocol = (url: string) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `https://${url}`;
}

// --- CLASSIC STYLES ---
const classicStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#000000', lineHeight: 1.5 },
  header: { 
    marginBottom: 20, 
    borderBottom: '1px solid #e5e7eb', 
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 6 
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    letterSpacing: 1,
    color: '#111827'
  },
  contactRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12, 
    marginTop: 4,
    fontSize: 9, 
    color: '#4b5563' 
  },
  section: { marginBottom: 18 },
  sectionTitle: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    borderBottom: '1px solid #e5e7eb', 
    paddingBottom: 4 
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, alignItems: 'flex-end' },
  jobTitle: { fontWeight: 'bold', fontSize: 10.5, color: '#000000' },
  company: { fontStyle: 'italic', fontSize: 10, color: '#374151' },
  date: { fontSize: 9, color: '#6b7280', minWidth: 80, textAlign: 'right' },
  description: { fontSize: 9.5, color: '#1f2937', textAlign: 'justify' },
  link: { color: '#2563eb', textDecoration: 'none' } // Link style
});

export const ClassicTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={classicStyles.page}>
      
      {/* HEADER */}
      <View style={classicStyles.header}>
        <Text style={classicStyles.name}>{data.contact.fullName || "Your Name"}</Text>
        <View style={classicStyles.contactRow}>
          <Text>{data.contact.email}</Text>
          {data.contact.phone && <Text>• {data.contact.phone}</Text>}
          {data.contact.location && <Text>• {data.contact.location}</Text>}
          
          {/* Portfolio Link */}
          {data.contact.portfolio && (
             <View style={{flexDirection: 'row'}}>
                <Text>• </Text>
                <Link src={ensureProtocol(data.contact.portfolio)} style={classicStyles.link}>
                    {cleanLinkText(data.contact.portfolio)}
                </Link>
             </View>
          )}
          
          {/* LinkedIn Link */}
          {data.contact.linkedin && (
             <View style={{flexDirection: 'row'}}>
                <Text>• </Text>
                <Link src={ensureProtocol(data.contact.linkedin)} style={classicStyles.link}>
                    LinkedIn
                </Link>
             </View>
          )}
        </View>
      </View>

      {/* SUMMARY */}
      {data.summary && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Professional Summary</Text>
          <Text style={classicStyles.description}>{data.summary}</Text>
        </View>
      )}

      {/* SKILLS */}
      {data.skills && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Skills</Text>
          <Text style={classicStyles.description}>{formatSkills(data.skills)}</Text>
        </View>
      )}

      {/* EXPERIENCE */}
      {data.workExperience && data.workExperience.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Experience</Text>
          {data.workExperience.map((job: any, i: number) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <View style={classicStyles.jobHeader}>
                <Text style={classicStyles.jobTitle}>{job.role}</Text>
                <Text style={classicStyles.date}>{job.startDate} - {job.current ? 'Present' : job.endDate}</Text>
              </View>
              <Text style={[classicStyles.company, { marginBottom: 2 }]}>{job.company}</Text>
              <Text style={classicStyles.description}>{job.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* PROJECTS (With Clickable Links) */}
      {data.projects && data.projects.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Projects</Text>
          {data.projects.map((proj: any, i: number) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 10, marginRight: 6 }}>{proj.name}</Text>
                {proj.link && (
                   <Link src={ensureProtocol(proj.link)} style={classicStyles.link}>
                      [{cleanLinkText(proj.link)}]
                   </Link>
                )}
              </View>
              <Text style={classicStyles.description}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Education</Text>
          {data.education.map((edu: any, i: number) => (
            <View key={i} style={{ marginBottom: 4 }}>
              <View style={classicStyles.jobHeader}>
                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{edu.school}</Text>
                <Text style={classicStyles.date}>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <Text style={classicStyles.description}>{edu.degree}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

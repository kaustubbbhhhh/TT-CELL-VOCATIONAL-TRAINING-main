import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { SectionEyebrow } from '../../components/UIComponents';

// ── ABOUT PAGE ────────────────────────────────────────────────
export function AboutPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Box sx={{ background: '#1A2332', py: { xs: 6, md: 8 }, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, background: 'rgba(184,150,12,0.14)', border: '1px solid rgba(184,150,12,0.3)', borderRadius: '20px', px: 1.75, py: 0.625, mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#D4AF37' }}>Our Story</Typography>
          </Box>
          <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 30, md: 42 } }}>About Army Base Workshop<br /><span style={{ color: '#D4AF37' }}>Technical Training Cell</span></Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2, fontSize: '1rem' }}>Forging technical excellence in service of national defence since 2012.</Typography>
        </Container>
      </Box>

      <Box sx={{ py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="start">
            <Grid item xs={12} md={8}>
              <SectionEyebrow>Who We Are</SectionEyebrow>
              <Typography variant="h4" sx={{ mb: 2.5 }}>Established 2012 Under Army Base Workshop Command</Typography>
              <Typography sx={{ color: '#445566', lineHeight: 1.8, mb: 2, fontSize: '0.9375rem' }}>The TT Cell was established under the Army Base Workshop to address the growing need for technically skilled personnel in defence manufacturing and technology operations. Over twelve years, we have developed a rigorous training ecosystem that combines military discipline with modern technical education.</Typography>
              <Typography sx={{ color: '#445566', lineHeight: 1.8, fontSize: '0.9375rem' }}>Our instructors are senior NCOs and JCOs with hands-on experience in defence equipment maintenance, software systems, and technology integration — ensuring every student receives instruction grounded in operational reality.</Typography>
              <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Card sx={{ borderLeft: '3px solid #4A6331' }}><CardContent><SectionEyebrow>Mission</SectionEyebrow><Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.65 }}>To develop world-class technical talent for the Indian Defence ecosystem through structured, project-based vocational training programmes aligned with national security objectives.</Typography></CardContent></Card>
                <Card sx={{ borderLeft: '3px solid #B8960C' }}><CardContent><SectionEyebrow>Vision</SectionEyebrow><Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.65 }}>To be the most respected defence technology training institution in South Asia, producing professionals who design, build, and secure India's critical national infrastructure.</Typography></CardContent></Card>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'grid', gap: 1.75 }}>
                {[
                  { num: '12+', label: 'Years of Excellence', sub: 'Established 2012', bg: '#1A2332', c: '#D4AF37', tc: '#fff' },
                  { num: '38', label: 'Expert Instructors', sub: 'Senior military technologists', bg: '#fff', c: '#3D5A80', tc: '#1A2332' },
                ].map(s => (
                  <Card key={s.label} sx={{ background: s.bg, border: s.bg === '#fff' ? '1px solid #D0D9E5' : 'none' }}>
                    <CardContent sx={{ py: '16px !important' }}>
                      <Typography sx={{ fontSize: 32, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.num}</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: s.tc, mt: 0.5 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: '0.775rem', color: s.bg === '#fff' ? '#7A8B99' : 'rgba(255,255,255,0.6)', mt: 0.25 }}>{s.sub}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ background: '#EBF0F5', py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <SectionEyebrow>Training Objectives</SectionEyebrow>
          <Typography variant="h3" sx={{ mb: 4 }}>What We Aim to Achieve</Typography>
          <Grid container spacing={2}>
            {[
              { icon: '🎯', t: 'Technical Proficiency', b: 'Build deep, hands-on expertise in chosen domains — not surface-level familiarity. Every graduate can build, not just describe.' },
              { icon: '🤝', t: 'Team Collaboration', b: 'Develop cross-functional teamwork through group projects modelled on real defence operations and project cycles.' },
              { icon: '🔐', t: 'Security Mindset', b: 'Embed security-first thinking across every technical discipline — non-negotiable in all defence technology contexts.' },
              { icon: '📈', t: 'Continuous Learning', b: 'Instil habits of self-directed learning to keep pace with rapidly evolving technologies and threat landscapes.' },
              { icon: '🏛️', t: 'National Service', b: 'Cultivate responsibility toward national technological self-reliance and the Atmanirbhar Bharat mission.' },
              { icon: '📋', t: 'Documentation Skills', b: 'Produce professional technical documentation, SRS reports, and specifications to MIL-STD and industry standards.' },
            ].map(o => (
              <Grid item xs={12} sm={6} md={4} key={o.t}>
                <Card sx={{ height: '100%' }}><CardContent>
                  <Typography sx={{ fontSize: 26, mb: 1.5 }}>{o.icon}</Typography>
                  <Typography variant="h6" sx={{ mb: 0.75 }}>{o.t}</Typography>
                  <Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.65 }}>{o.b}</Typography>
                </CardContent></Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}

// ── DOMAINS PAGE ──────────────────────────────────────────────
const allDomains = [
  { icon: '🤖', title: 'Artificial Intelligence & Machine Learning', weeks: 16, level: 'Advanced', levelColor: 'primary', tags: ['High Demand'], stack: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'FastAPI', 'YOLOv8'], borderColor: '#4338CA', body: 'Deep learning architectures, CNNs, RNNs, transformer models, computer vision for surveillance and target recognition, and NLP for intelligence text processing. Trainees build a full capstone AI model deployable on edge hardware for field use. Real datasets from simulated defence environments used throughout.' },
  { icon: '🌐', title: 'Full-Stack Web Development', weeks: 12, level: 'Beginner Friendly', levelColor: 'success', tags: ['New Batch'], stack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Nginx', 'JWT'], borderColor: '#3D5A80', body: 'React.js, Node.js, PostgreSQL, REST API design, JWT authentication, role-based access control, and secure deployment on government cloud. Trainees build a complete operational portal as their capstone following OWASP secure coding guidelines.' },
  { icon: '🔐', title: 'Cyber Security & Defence', weeks: 14, level: 'Critical Priority', levelColor: 'error', tags: ['High Demand'], stack: ['Kali Linux', 'Metasploit', 'Wireshark', 'Splunk', 'Burp Suite', 'Python'], borderColor: '#C0392B', body: 'Ethical hacking, penetration testing, SIEM operations, incident response, IDS/IPS configuration, and compliance with CERT-In mandates. Trainees participate in live red-team/blue-team exercises on the dedicated cyber range.' },
  { icon: '📊', title: 'Data Science & Analytics', weeks: 14, level: 'Intermediate', levelColor: 'warning', tags: ['Batch Running'], stack: ['Python', 'Pandas', 'Scikit-learn', 'Tableau', 'SQL', 'Power BI', 'LSTM'], borderColor: '#B8960C', body: 'Statistical modelling, data wrangling, ETL pipelines, interactive dashboards, and geospatial analysis. Capstone: predictive maintenance model for armoured vehicle engine telemetry using LSTM-based anomaly detection.' },
  { icon: '📡', title: 'Internet of Things (IoT)', weeks: 10, level: 'Intermediate', levelColor: 'primary', tags: ['Embedded Focus'], stack: ['Raspberry Pi', 'ESP32', 'MQTT', 'LoRaWAN', 'AWS IoT', 'Node-RED'], borderColor: '#4A6331', body: 'MQTT protocols, sensor networks, Raspberry Pi and ESP32 programming, LoRaWAN communications, and edge computing. Capstone: a complete surveillance sensor network for simulated perimeter monitoring of a forward operating base.' },
  { icon: '⚙️', title: 'Embedded Systems & Firmware', weeks: 16, level: 'Specialized', levelColor: 'secondary', tags: ['Advanced'], stack: ['C/C++', 'FreeRTOS', 'STM32', 'ARM Cortex-M', 'JTAG', 'PCB Design', 'KiCad'], borderColor: '#C2185B', body: 'ARM Cortex-M programming, RTOS design, bare-metal firmware, hardware abstraction layers, JTAG/SWD debugging, PCB design basics, and DO-178C safety compliance principles. Trainees design a real-time controller from scratch.' },
];

export function DomainsPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Box sx={{ background: '#1A2332', py: { xs: 6, md: 8 }, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#D4AF37', mb: 2 }}>Technical Domains</Typography>
          <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 30, md: 42 } }}>Choose Your <span style={{ color: '#D4AF37' }}>Technical Pathway</span></Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2, fontSize: '1rem', maxWidth: 560 }}>Six specialised domains, each with structured curriculum, capstone project, industry mentors, and government certification.</Typography>
        </Container>
      </Box>

      <Box sx={{ py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gap: 2.5 }}>
            {allDomains.map(d => (
              <Card key={d.title} sx={{ borderLeft: `4px solid ${d.borderColor}` }}>
                <CardContent>
                  <Grid container spacing={2.5} alignItems="start">
                    <Grid item xs="auto">
                      <Box sx={{ width: 56, height: 56, borderRadius: '12px', background: `${d.borderColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{d.icon}</Box>
                    </Grid>
                    <Grid item xs>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.75 }}>
                        <Typography variant="h5">{d.title}</Typography>
                        <Chip label={d.level} size="small" color={d.levelColor} sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                        {d.tags.map(t => <Chip key={t} label={t} size="small" color="error" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />)}
                      </Box>
                      <Typography sx={{ color: '#445566', lineHeight: 1.72, mb: 1.5, fontSize: '0.9rem' }}>{d.body}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                        {d.stack.map(s => <Chip key={s} label={s} size="small" sx={{ background: '#EBF0F5', color: '#445566', fontWeight: 600, fontSize: '0.68rem' }} />)}
                      </Box>
                    </Grid>
                    <Grid item xs="auto" sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#4A6331', lineHeight: 1 }}>{d.weeks}</Typography>
                      <Typography variant="caption">weeks</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

    </Box>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────────
export function ContactPage() {
  return (
    <Box>
      <Box sx={{ background: '#1A2332', py: { xs: 6, md: 8 }, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#D4AF37', mb: 2 }}>Get In Touch</Typography>
          <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 30, md: 42 } }}>Contact <span style={{ color: '#D4AF37' }}>TT Cell</span></Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2 }}>Reach our training administration team for inquiries, applications, and support.</Typography>
        </Container>
      </Box>

      <Box sx={{ py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <SectionEyebrow>Send an Inquiry</SectionEyebrow>
              <Typography variant="h5" sx={{ mb: 3 }}>We respond within 48 hours</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {['Full Name *', 'Email Address *', 'Phone Number'].map(label => (
                  <Box key={label}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>{label}</Typography>
                    <Box component="input" sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', '&:focus': { borderColor: '#4A6331' }, boxSizing: 'border-box' }} placeholder={label.replace(' *', '')} />
                  </Box>
                ))}
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Subject *</Typography>
                  <Box component="select" sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', appearance: 'none', background: '#fff' }}>
                    {['Application Inquiry', 'Training Information', 'Domain Selection Guidance', 'Technical Support', 'Other'].map(o => <option key={o}>{o}</option>)}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Message *</Typography>
                  <Box component="textarea" rows={5} sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', '&:focus': { borderColor: '#4A6331' }, boxSizing: 'border-box' }} placeholder="Describe your inquiry in detail..." />
                </Box>
                <Button variant="contained" size="large" fullWidth>Submit Inquiry</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionEyebrow>Contact Details</SectionEyebrow>
              <Typography variant="h5" sx={{ mb: 3 }}>Reach Us Directly</Typography>
              <Box sx={{ display: 'grid', gap: 1.5, mb: 3 }}>
                {[
                  { icon: '📍', t: 'Address', b: 'TT Cell, Army Base Workshop\nCantonment Area\nIndia — 110 XXX (Exact address on enrolment confirmation)' },
                  { icon: '📞', t: 'Phone', b: 'Training Office: +91-XXXX-XXXXXX\nMon–Fri 09:00–17:00, Sat 09:00–13:00' },
                  { icon: '✉️', t: 'Email', b: 'ttcell@armybaseworkshop.mil.in\ntraining@armybaseworkshop.mil.in' },
                  { icon: '🕐', t: 'Office Hours', b: 'Mon–Fri: 09:00–17:00 IST\nSaturday: 09:00–13:00 IST' },
                ].map(c => (
                  <Box key={c.t} sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start', p: 2, background: '#fff', border: '1px solid #D0D9E5', borderRadius: '12px' }}>
                    <Box sx={{ width: 42, height: 42, background: '#EBF2F9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</Box>
                    <Box><Typography sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 0.25 }}>{c.t}</Typography><Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.b}</Typography></Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ background: '#EBF0F5', borderRadius: '12px', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px dashed #B8C5D3', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: 32 }}>🗺️</Typography>
                <Typography sx={{ fontWeight: 700, color: '#445566' }}>Location Map — Restricted</Typography>
                <Typography variant="caption" sx={{ textAlign: 'center', px: 2 }}>Exact coordinates provided in enrolment confirmation letter.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

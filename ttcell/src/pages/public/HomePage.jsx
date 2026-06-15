import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Chip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { SectionEyebrow } from '../../components/UIComponents';
import StarIcon from '@mui/icons-material/Star';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const domains = [
  { icon: '🤖', title: 'AI / Machine Learning', body: 'Neural networks, computer vision, NLP and defence AI applications. Build systems that think.', weeks: 16, tag: 'High Demand', tagColor: 'error' },
  { icon: '🌐', title: 'Web Development', body: 'Full-stack engineering with React, Node.js, and secure government-grade architecture.', weeks: 12, tag: 'Beginner Friendly', tagColor: 'success' },
  { icon: '🔐', title: 'Cyber Security', body: 'Ethical hacking, network defence, cryptography and ops for critical infrastructure.', weeks: 14, tag: 'Critical Priority', tagColor: 'error' },
  { icon: '📊', title: 'Data Science', body: 'Statistical analysis, predictive modelling, and intelligence-driven data pipelines.', weeks: 14, tag: 'Batch Running', tagColor: 'warning' },
  { icon: '📡', title: 'IoT Systems', body: 'Connected device networks, sensor fusion, and real-time monitoring for field operations.', weeks: 10, tag: 'Intermediate', tagColor: 'primary' },
  { icon: '⚙️', title: 'Embedded Systems', body: 'Microcontrollers, RTOS, firmware development and hardware-software co-design.', weeks: 16, tag: 'Specialized', tagColor: 'primary' },
];

const testimonials = [
  { text: 'The AI/ML program was a turning point. The hands-on approach with real defence datasets gave me an edge no university course could replicate.', name: 'Rahul Verma', role: 'Batch 2023 · AI/ML · Now at DRDO', init: 'RV' },
  { text: 'Military-grade discipline combined with cutting-edge curriculum. I secured a role at a Tier-1 defence contractor within three months of certification.', name: 'Priya Sharma', role: 'Batch 2023 · Cyber Sec · Now at BEL', init: 'PS' },
  { text: "The project repository is a goldmine. Studying previous cohorts' work accelerated my understanding far beyond what the curriculum alone provides.", name: 'Arjun Kumar', role: 'Batch 2024 · Embedded · Now at HAL', init: 'AK' },
];

const faqs = [
  { q: 'Who is eligible to apply?', a: 'Engineering graduates, diploma holders, and science graduates with valid government ID. Age limit: 18–28 years.' },
  { q: 'Is there a stipend during training?', a: 'Selected candidates receive a nominal training stipend as per MoD guidelines. Hostel accommodation available for outstation trainees.' },
  { q: 'How are batches and domains allocated?', a: 'Batches run twice annually — January and July. Domain allocation is based on aptitude test scores and interview performance.' },
  { q: 'Is the certificate government-recognised?', a: 'Yes. Certificates are issued under Army Base Workshop authority and recognised by MoD for defence sector placements.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* ── HERO ── */}
      <Box sx={{
        background: '#1A2332',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 58px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 7 },
        boxSizing: 'border-box'
      }}>
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, border: '100px solid rgba(184,150,12,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: 'rgba(184,150,12,0.14)',
            border: '1px solid rgba(184,150,12,0.3)',
            borderRadius: '20px',
            width: 'fit-content',
            px: 1.75,
            py: 0.625,
            mb: 3,
            animation: `${fadeInUp} 1s ease-out forwards`
          }}>
            <StarIcon sx={{ fontSize: 12, color: '#D4AF37' }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#D4AF37' }}>Ministry of Defence — Certified Training Program</Typography>
          </Box>
          <Typography variant="h1" sx={{
            fontSize: { xs: 40, sm: 54, md: 72 },
            color: '#fff',
            mb: 2.5,
            lineHeight: 1.1,
            fontWeight: 800,
            opacity: 0,
            animation: `${fadeInUp} 1s ease-out 0.15s forwards`
          }}>
            Shape the Future of<br /><span style={{ color: '#D4AF37' }}>Defence Technology</span>
          </Typography>
          <Typography sx={{
            fontSize: { xs: 16, md: 20 },
            color: 'rgba(255,255,255,0.72)',
            maxWidth: 640,
            lineHeight: 1.7,
            mb: 4.5,
            opacity: 0,
            animation: `${fadeInUp} 1s ease-out 0.3s forwards`
          }}>
            India's premier vocational training program for cutting-edge technical skills. Delivered by Army Base Workshop TT Cell — where military precision meets modern technology.
          </Typography>
          <Box sx={{
            display: 'flex',
            gap: 1.5,
            flexWrap: 'wrap',
            opacity: 0,
            animation: `${fadeInUp} 1s ease-out 0.45s forwards`
          }}>
            <Button variant="outlined" size="large" onClick={() => navigate('/domains')} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Explore Domains</Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/about')} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Learn More</Button>
          </Box>
        </Container>
      </Box>

      {/* ── ABOUT STRIP ── */}
      <Box sx={{ background: '#2D3B1F', py: 6, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <SectionEyebrow light>About TT Cell</SectionEyebrow>
              <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>Technical Training Cell,<br />Army Base Workshop</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.78, fontSize: '0.9375rem' }}>The TT Cell operates under the Army Base Workshop to develop technically skilled professionals. Our structured curriculum bridges the gap between academic learning and real-world defence technology applications.</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {[
                  { icon: '🎯', t: 'Mission-Driven Training', s: 'Curriculum aligned with defence technology requirements' },
                  { icon: '🏆', t: 'Certified Excellence', s: 'Ministry of Defence approved, government-issued certification' },
                  { icon: '💡', t: 'Industry-Ready Skills', s: 'Capstone projects with real defence data, not just theory' },
                ].map(item => (
                  <Box key={item.t} sx={{ background: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1.75, display: 'flex', gap: 1.75, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 24 }}>{item.icon}</Typography>
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{item.t}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.62)', mt: 0.25 }}>{item.s}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── TRAINING DOMAINS ── */}
      <Box sx={{ background: '#EBF0F5', py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <SectionEyebrow>Training Domains</SectionEyebrow>
          <Typography variant="h3" sx={{ mb: 1 }}>Six Pathways to Technical Excellence</Typography>
          <Typography sx={{ color: '#445566', mb: 4.5, fontSize: '1rem', lineHeight: 1.7 }}>Choose your specialisation from six cutting-edge technical domains, each producing deployment-ready professionals.</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {domains.map(d => (
              <Grid item xs={12} sm={6} md={4} key={d.title}>
                <Card sx={{ height: '100%', borderTop: '3px solid #4A6331', transition: 'transform 0.18s, border-top-color 0.18s', '&:hover': { transform: 'translateY(-3px)', borderTopColor: '#B8960C', boxShadow: '0 8px 24px rgba(26,35,50,0.1)' } }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 28, mb: 1.75 }}>{d.icon}</Typography>
                    <Typography variant="h6" sx={{ mb: 0.75 }}>{d.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#445566', mb: 1.5, lineHeight: 1.65 }}>{d.body}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                      <Chip label={`${d.weeks} weeks`} size="small" sx={{ background: '#EBF2F9', color: '#3D5A80', fontWeight: 700, fontSize: '0.68rem' }} />
                      <Chip label={d.tag} size="small" color={d.tagColor} sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" size="large" onClick={() => navigate('/domains')}>View Full Domain Details →</Button>
          </Box>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ── */}
      <Box sx={{ py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <SectionEyebrow>Trainee Voices</SectionEyebrow>
          <Typography variant="h3" sx={{ mb: 4.5 }}>What Our Graduates Say</Typography>
          <Grid container spacing={2}>
            {testimonials.map(t => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ height: '100%', borderTop: '3px solid #B8960C' }}>
                  <CardContent>
                    <Typography sx={{ fontSize: '0.875rem', color: '#445566', lineHeight: 1.75, mb: 2.5, fontStyle: 'italic' }}>"{t.text}"</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: '#EEF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#4A6331', flexShrink: 0 }}>{t.init}</Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.8375rem', fontWeight: 700 }}>{t.name}</Typography>
                        <Typography variant="caption">{t.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FAQ ── */}
      <Box sx={{ background: '#EBF0F5', py: 8, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <SectionEyebrow>FAQs</SectionEyebrow>
              <Typography variant="h4" sx={{ mb: 1.5 }}>Common Questions</Typography>
              <Typography sx={{ color: '#445566', mb: 3, lineHeight: 1.7 }}>Can't find your answer? Reach us directly through the contact page.</Typography>
              <Button variant="contained" onClick={() => navigate('/contact')}>Contact TT Cell →</Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ overflow: 'hidden' }}>
                {faqs.map((faq, i) => (
                  <Box key={i} sx={{ p: '14px 18px', borderBottom: i < faqs.length - 1 ? '1px solid #EBF0F5' : 'none' }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 0.5 }}>{faq.q}</Typography>
                    <Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.65 }}>{faq.a}</Typography>
                  </Box>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

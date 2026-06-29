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

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0.3; }
`;

// Helper for glassmorphic styling
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
  borderRadius: '16px',
};

const domains = [
  { icon: '🤖', title: 'AI/ML', body: 'Neural networks, computer vision, and predictive modeling algorithms.', weeks: 16, tag: 'High Demand', tagColor: '#C17B2E' },
  { icon: '💻', title: 'Web Dev', body: 'Full-stack development, modern frameworks, and responsive design.', weeks: 12, tag: 'Specialized', tagColor: '#7D7658' },
  { icon: '🔒', title: 'Cyber Sec', body: 'Ethical hacking, threat classification, and network security.', weeks: 14, tag: 'Critical Priority', tagColor: '#C17B2E' },
  { icon: '📊', title: 'Data Sci', body: 'Data analytics, visualization, and statistical computing.', weeks: 14, tag: 'Batch Running', tagColor: '#7D7658' },
  { icon: '📱', title: 'IoT', body: 'Sensor integration, smart devices, and IoT protocols.', weeks: 10, tag: 'Intermediate', tagColor: '#B68A2D' },
  { icon: '🔌', title: 'Embedded', body: 'Microcontrollers, RTOS, and hardware interfacing.', weeks: 16, tag: 'Specialized', tagColor: '#B68A2D' },
];

const testimonials = [
  { text: 'The hands-on approach with real ML datasets gave me an edge no standard course could replicate.', name: 'Rahul Verma', role: 'Batch 2025 · AI/ML · Now at DRDO', init: 'RV' },
  { text: 'Discipline combined with cutting-edge curriculum. I secured a role at a Tier-1 contractor within three months.', name: 'Priya Sharma', role: 'Batch 2025 · Web Dev · Now at BEL', init: 'PS' },
  { text: "The project repository is a goldmine. Studying previous cohorts' work accelerated my understanding far beyond theory.", name: 'Arjun Kumar', role: 'Batch 2024 · Embedded · Now at HAL', init: 'AK' },
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
    <Box sx={{ background: '#121610', color: '#F4F2EC', overflow: 'hidden' }}>
      
      {/* ── HERO ── */}
      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 14, md: 16 },
        pb: { xs: 6, md: 8 },
        px: { xs: 3, md: 7 },
        boxSizing: 'border-box'
      }}>
        {/* Background Blobs for Glassmorphism Effect */}
        <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, background: '#4B5D3A', borderRadius: '50%', filter: 'blur(120px)', animation: `${pulse} 10s infinite alternate` }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, background: '#7D7658', borderRadius: '50%', filter: 'blur(150px)', animation: `${pulse} 12s infinite alternate-reverse` }} />
        <Box sx={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, background: '#1D401D', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            ...glassStyle,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: 'fit-content',
            px: 2,
            py: 0.75,
            mb: 4,
            borderRadius: '20px',
            animation: `${fadeInUp} 1s ease-out forwards`
          }}>
            <StarIcon sx={{ fontSize: 14, color: '#C17B2E' }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#EBF0F5' }}>Ministry of Defence — Certified Training Program</Typography>
          </Box>
          <Typography variant="h1" sx={{
            fontSize: { xs: 44, sm: 60, md: 80 },
            color: '#F4F2EC',
            mb: 3,
            lineHeight: 1.1,
            fontWeight: 800,
            opacity: 0,
            animation: `${fadeInUp} 1s ease-out 0.15s forwards`,
            textShadow: '0 4px 24px rgba(0,0,0,0.5)'
          }}>
            Shape the Future of<br /><span style={{ color: '#C17B2E' }}>Defence Technology</span>
          </Typography>
          <Typography sx={{
            fontSize: { xs: 16, md: 20 },
            color: 'rgba(244, 242, 236, 0.8)',
            maxWidth: 680,
            lineHeight: 1.7,
            mb: 5,
            opacity: 0,
            animation: `${fadeInUp} 1s ease-out 0.3s forwards`
          }}>
            India's premier vocational training program for cutting-edge technical skills. Delivered by Army Base Workshop TT Cell — where military precision meets modern engineering.
          </Typography>
          <Box sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            opacity: 0,
            animation: `${fadeInUp} 1s ease-out 0.45s forwards`
          }}>
            <Button variant="contained" size="large" onClick={() => navigate('/domains')} sx={{ background: 'rgba(75, 93, 58, 0.9)', backdropFilter: 'blur(4px)', color: '#fff', '&:hover': { background: '#3D4A2F' }, px: 4, py: 1.5, borderRadius: '8px' }}>Explore Domains</Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/about')} sx={{ ...glassStyle, borderColor: 'rgba(255,255,255,0.2)', color: '#F4F2EC', '&:hover': { background: 'rgba(255,255,255,0.1)' }, px: 4, py: 1.5, borderRadius: '8px' }}>Learn More</Button>
          </Box>
        </Container>
      </Box>

      {/* ── ABOUT STRIP ── */}
      <Box sx={{ position: 'relative', py: 10, px: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ ...glassStyle, p: { xs: 4, md: 6 }, borderLeft: '4px solid #4B5D3A' }}>
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} md={6}>
                <SectionEyebrow light sx={{ color: '#C17B2E' }}>About TT Cell</SectionEyebrow>
                <Typography variant="h4" sx={{ color: '#F4F2EC', mb: 3, fontWeight: 700 }}>Technical Training Cell,<br />Army Base Workshop</Typography>
                <Typography sx={{ color: 'rgba(244, 242, 236, 0.75)', lineHeight: 1.8, fontSize: '1rem' }}>The TT Cell operates under the Army Base Workshop to develop technically skilled professionals. Our structured curriculum bridges the gap between academic learning and real-world defence technology applications, maintaining BEL-grade operational standards.</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {[
                    { icon: '🎯', t: 'Mission-Driven Training', s: 'Curriculum aligned with defence technology requirements' },
                    { icon: '🏆', t: 'Certified Excellence', s: 'Ministry of Defence approved, government-issued certification' },
                    { icon: '💡', t: 'Industry-Ready Skills', s: 'Capstone projects with real defence data, not just theory' },
                  ].map(item => (
                    <Box key={item.t} sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, p: 2, display: 'flex', gap: 2, alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography sx={{ fontSize: 28 }}>{item.icon}</Typography>
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#F4F2EC' }}>{item.t}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(244, 242, 236, 0.6)', mt: 0.5 }}>{item.s}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ── TRAINING DOMAINS ── */}
      <Box sx={{ position: 'relative', py: 10, px: { xs: 3, md: 7 } }}>
        <Box sx={{ position: 'absolute', top: '20%', right: '-5%', width: 400, height: 400, background: '#7D7658', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.4 }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow sx={{ color: '#C17B2E' }}>Training Domains</SectionEyebrow>
          <Typography variant="h3" sx={{ mb: 2, color: '#F4F2EC', fontWeight: 700 }}>Six Pathways to Technical Excellence</Typography>
          <Typography sx={{ color: 'rgba(244, 242, 236, 0.75)', mb: 6, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 700 }}>Choose your specialisation from six cutting-edge technical domains, each producing deployment-ready professionals.</Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {domains.map(d => (
              <Grid item xs={12} sm={6} md={4} key={d.title}>
                <Card sx={{ 
                  ...glassStyle, 
                  height: '100%', 
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'transform 0.3s, background 0.3s', 
                  '&:hover': { transform: 'translateY(-6px)', background: 'rgba(255,255,255,0.06)' } 
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ fontSize: 36, mb: 2 }}>{d.icon}</Typography>
                    <Typography variant="h5" sx={{ mb: 1, color: '#F4F2EC', fontWeight: 700 }}>{d.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(244, 242, 236, 0.7)', mb: 3, lineHeight: 1.7 }}>{d.body}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`${d.weeks} weeks`} size="small" sx={{ background: 'rgba(75, 93, 58, 0.3)', color: '#F4F2EC', border: '1px solid rgba(75, 93, 58, 0.5)', fontWeight: 600 }} />
                      <Chip label={d.tag} size="small" sx={{ background: `${d.tagColor}33`, color: d.tagColor, border: `1px solid ${d.tagColor}66`, fontWeight: 600 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" size="large" onClick={() => navigate('/domains')} sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#F4F2EC', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.15)' }, px: 4, py: 1.5, borderRadius: '8px' }}>
              View Full Domain Details →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ── */}
      <Box sx={{ position: 'relative', py: 10, px: { xs: 3, md: 7 } }}>
        <Box sx={{ position: 'absolute', bottom: '0%', left: '-10%', width: 500, height: 500, background: '#4B5D3A', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.3 }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow sx={{ color: '#C17B2E' }}>Trainee Voices</SectionEyebrow>
          <Typography variant="h3" sx={{ mb: 6, color: '#F4F2EC', fontWeight: 700 }}>What Our Graduates Say</Typography>
          <Grid container spacing={3}>
            {testimonials.map(t => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ ...glassStyle, background: 'rgba(255,255,255,0.02)', height: '100%', borderTop: '4px solid #7D7658' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ fontSize: '1rem', color: 'rgba(244, 242, 236, 0.85)', lineHeight: 1.8, mb: 4, fontStyle: 'italic' }}>"{t.text}"</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(125, 118, 88, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#C17B2E', flexShrink: 0, border: '1px solid rgba(125, 118, 88, 0.4)' }}>{t.init}</Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#F4F2EC' }}>{t.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(244, 242, 236, 0.6)' }}>{t.role}</Typography>
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
      <Box sx={{ position: 'relative', py: 10, px: { xs: 3, md: 7 }, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <SectionEyebrow sx={{ color: '#C17B2E' }}>FAQs</SectionEyebrow>
              <Typography variant="h4" sx={{ mb: 2, color: '#F4F2EC', fontWeight: 700 }}>Common Questions</Typography>
              <Typography sx={{ color: 'rgba(244, 242, 236, 0.7)', mb: 4, lineHeight: 1.7 }}>Can't find your answer? Reach us directly through the contact page.</Typography>
              <Button variant="contained" onClick={() => navigate('/contact')} sx={{ background: '#4B5D3A', color: '#fff', '&:hover': { background: '#3D4A2F' }, borderRadius: '8px' }}>Contact TT Cell →</Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ ...glassStyle, overflow: 'hidden' }}>
                {faqs.map((faq, i) => (
                  <Box key={i} sx={{ p: 3, borderBottom: i < faqs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', background: 'rgba(255,255,255,0.01)' }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, mb: 1, color: '#F4F2EC' }}>{faq.q}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(244, 242, 236, 0.7)', lineHeight: 1.7 }}>{faq.a}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
    </Box>
  );
}

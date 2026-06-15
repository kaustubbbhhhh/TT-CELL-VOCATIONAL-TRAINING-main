import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, LinearProgress, Chip,
} from '@mui/material';
import {
  MetricCard, BarChart, AnnouncementCard,
  PageHeader, Breadcrumb, StepIndicator,
  InfoRow, StatusChip, AttendanceBar,
} from '../../components/UIComponents';
import { announcements, attendance, traineeProjects } from '../../data/mockData';

// ── TRAINEE DASHBOARD ─────────────────────────────────────────
export function TraineeDashboard() {
  const scheduleData = [82, 88, 91, 85, 78, 87].map((v, i) => ({ value: v, label: `W${i + 1}`, highlight: i === 2 }));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Good morning, Rahul 👋</Typography>
        <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.25 }}>
          AI/ML Domain · Batch 2024-B · Week 11 of 16 · Thursday, 12 Jun 2025
        </Typography>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="My Attendance" value="92%" delta="Well above threshold" deltaUp accentColor="#4A6331" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Projects Done" value="3 / 4" sub="1 currently in progress" accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Composite Score" value="87.5" delta="Top 15% of batch" deltaUp accentColor="#3D5A80" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Weeks Remaining" value="5" sub="Graduation: Aug 2025" accentColor="#4A6331" /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Typography variant="h6">Current Project</Typography>
                  <Typography variant="caption">Edge AI Surveillance System · TT24-AI-001</Typography>
                </Box>
                <Chip label="In Progress" size="small" sx={{ background: '#FAF5DC', color: '#7A6000', fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>

              <Typography variant="body2" sx={{ color: '#445566', mb: 2, lineHeight: 1.65 }}>
                Building a YOLOv8-based real-time detection system on Raspberry Pi 5 with MQTT telemetry to a central dashboard. Currently finalising the alert management module.
              </Typography>

              <Box sx={{ mb: 0.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Overall Progress</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#4A6331' }}>78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78}
                  sx={{ height: 8, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: '#4A6331', borderRadius: 10 } }}
                />
              </Box>

              <Box sx={{ my: 2.5 }}>
                <StepIndicator steps={['Research', 'Design', 'Build', 'Test', 'Submit']} current={2} />
              </Box>

              <Box sx={{ pt: 1.5, borderTop: '1px solid #EBF0F5' }}>
                <Typography variant="caption">
                  Submission deadline: <strong style={{ color: '#1A2332' }}>20 Jun 2025</strong> · 8 days remaining
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6">Announcements</Typography>
                <Chip label="3 new" size="small" sx={{ background: '#FCECEA', color: '#C0392B', fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              {announcements.slice(0, 3).map(a => (
                <AnnouncementCard key={a.id} title={a.title} meta={`${a.date} · ${a.audience}`} priority={a.priority} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>This Week's Schedule</Typography>
              {[
                { day: 'Thu', today: true, text: 'AI/ML Lab — Room 4B, 09:00–13:00' },
                { day: 'Fri', today: false, text: 'DRDO Lecture + Project Review, 14:00–17:00' },
                { day: 'Sat', today: false, text: 'Self-study / Lab access, 09:00–13:00' },
              ].map(s => (
                <Box key={s.day} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1, '&:last-child': { mb: 0 } }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.8125rem', color: s.today ? '#4A6331' : '#7A8B99', minWidth: 28 }}>{s.day}</Typography>
                  <Typography variant="body2" sx={{ color: '#445566' }}>{s.text}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Attendance — This Month</Typography>
              <BarChart data={scheduleData} height={80} />
              <Typography variant="caption" sx={{ mt: 1.5, display: 'block' }}>
                Overall: <strong style={{ color: '#4A6331' }}>92%</strong> · 67 of 73 days present
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Project Scores</Typography>
              {[
                { title: 'NLP Intent Classifier', score: 94, max: 100 },
                { title: 'Aerial Image Segmentation', score: 88, max: 100 },
                { title: 'Mini ML Pipeline Lab', score: 81, max: 100 },
                { title: 'Edge AI System (current)', score: null, progress: 78 },
              ].map((p, i) => (
                <Box key={i} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: p.score ? '#4A6331' : '#7A8B99' }}>
                      {p.score ? `${p.score}/100` : '—/100'}
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={p.score ?? p.progress}
                    sx={{ height: 6, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: p.score ? '#4A6331' : '#B8960C', borderRadius: 10 } }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── TRAINEE PROFILE ───────────────────────────────────────────
export function TraineeProfile() {
  return (
    <Box>
      <PageHeader title="My Profile" />
      <Grid container spacing={2.5} alignItems="flex-start">
        <Grid item xs={12} md="auto">
          <Card sx={{ textAlign: 'center', p: 2, minWidth: 160 }}>
            <CardContent>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2E8', color: '#4A6331', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, margin: '0 auto 12px' }}>RV</Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>Rahul Verma</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>TT24-001</Typography>
              <Chip label="AI/ML Domain" size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700, fontSize: '0.7rem' }} />
              <Button fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>Change Photo</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Personal Information</Typography>
                <Button variant="outlined" size="small">Edit</Button>
              </Box>
              <InfoRow label="Full Name" value="Rahul Verma" />
              <InfoRow label="Roll Number" value={<Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.875rem' }}>TT24-001</Typography>} />
              <InfoRow label="Date of Birth" value="14 March 2002" />
              <InfoRow label="Email (Portal)" value="rahul.v@ttcell" />
              <InfoRow label="Personal Email" value="rahulverma2002@gmail.com" />
              <InfoRow label="Phone" value="+91 98XXX XXXXX" />
              <InfoRow label="Home State" value="Uttar Pradesh" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Training Details</Typography>
              <InfoRow label="Domain" value="Artificial Intelligence & Machine Learning" />
              <InfoRow label="Batch" value="January 2025 (Batch 2024-B)" />
              <InfoRow label="Duration" value="16 weeks (Jan 2025 – Apr 2025)" />
              <InfoRow label="Graduation Date" value="August 2025 (estimated)" />
              <InfoRow label="Instructor" value="Hav. Suresh Nair, Senior Technician (AI Systems)" />
              <InfoRow label="Attendance" value={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>92%</Typography><Typography variant="caption">· Well above 75% minimum threshold</Typography></Box>} />
              <InfoRow label="Composite Score" value={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>87.5 / 100</Typography><Typography variant="caption">· Top 15% of batch</Typography></Box>} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── TRAINEE ATTENDANCE ────────────────────────────────────────
export function TraineeAttendance() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>My Attendance</Typography>
          <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.25 }}>Complete record · Batch 2024-B</Typography>
        </Box>
        <Box component="select" sx={{ p: '8px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
          {['June 2025', 'May 2025', 'April 2025', 'March 2025'].map(m => <option key={m}>{m}</option>)}
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="Overall Attendance" value="92%" sub="Above 75% threshold ✓" accentColor="#4A6331" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Days Present" value="67" sub="of 73 working days" accentColor="#3D5A80" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Approved Leave" value="4" sub="Medical + Personal" accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Unauthorised" value="2" sub="Warning letters issued" accentColor="#C0392B" /></Grid>
      </Grid>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Attendance Standing</Typography>
          <Typography variant="body2" sx={{ color: '#445566', mb: 1.5 }}>
            Your attendance is <strong>well above</strong> the 75% minimum. You have a safe buffer of <strong style={{ color: '#4A6331' }}>17%</strong>.
          </Typography>
          <LinearProgress variant="determinate" value={92}
            sx={{ height: 10, borderRadius: 10, background: '#EBF0F5', mb: 0.75, '& .MuiLinearProgress-bar': { background: '#4A6331', borderRadius: 10 } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">0%</Typography>
            <Typography variant="caption" sx={{ color: '#C0392B', fontWeight: 700 }}>Min: 75%</Typography>
            <Typography variant="caption" sx={{ color: '#4A6331', fontWeight: 700 }}>Your record: 92%</Typography>
            <Typography variant="caption">100%</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ px: 2, py: 1.75, borderBottom: '1px solid #EBF0F5' }}>
          <Typography variant="h6">June 2025 — Day-wise Log</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Session</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Leave Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.day}</TableCell>
                  <TableCell>{a.session}</TableCell>
                  <TableCell><Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{a.time}</Typography></TableCell>
                  <TableCell><StatusChip status={a.status} /></TableCell>
                  <TableCell>
                    {a.leave
                      ? <Chip label={a.leave} size="small" sx={{ background: '#FAF5DC', color: '#7A6000', fontWeight: 700, fontSize: '0.7rem' }} />
                      : <Typography variant="caption">—</Typography>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderTop: '1px solid #EBF0F5', background: '#F5F7FA' }}>
          <Typography variant="caption">7 of 73 working days shown</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {['1', '2', '3', 'Next →'].map((p, i) => (
              <Button key={p} variant={p === '1' ? 'contained' : 'outlined'} size="small" sx={{ minWidth: 36, py: 0.5, fontSize: '0.75rem' }}>{p}</Button>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

// ── TRAINEE PROJECTS ──────────────────────────────────────────
const projStatusColor = { in_progress: '#B8960C', completed: '#4A6331', planning: '#3D5A80' };
const projStatusLabel = { in_progress: 'In Progress', completed: 'Completed', planning: 'Planning' };

export function TraineeProjects() {
  return (
    <Box>
      <PageHeader title="My Projects" subtitle="4 projects assigned · 3 completed · 1 in progress" />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {traineeProjects.map(p => (
          <Card key={p.id} sx={{ borderLeft: `3px solid ${projStatusColor[p.status]}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="h6">{p.title}</Typography>
                  <Typography variant="caption">{p.id} · {p.type} · {p.status === 'in_progress' ? `Due: ${p.due}` : `Submitted: ${p.due}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Chip label={projStatusLabel[p.status]} size="small"
                    sx={{ background: `${projStatusColor[p.status]}22`, color: projStatusColor[p.status], fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  {p.score && (
                    <Chip label={`Score: ${p.score}/100`} size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700, fontSize: '0.7rem' }} />
                  )}
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: '#445566', mb: 1.75, lineHeight: 1.65 }}>{p.description}</Typography>

              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">{p.status === 'completed' ? 'Completed' : 'Progress'}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: projStatusColor[p.status] }}>{p.progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={p.progress}
                  sx={{ height: 6, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: projStatusColor[p.status], borderRadius: 10 } }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: p.status === 'in_progress' ? 2 : 0 }}>
                {p.stack.map(s => <Chip key={s} label={s} size="small" sx={{ background: '#EBF0F5', color: '#445566', fontWeight: 600, fontSize: '0.68rem' }} />)}
              </Box>

              {p.status === 'in_progress' && (
                <Box sx={{ display: 'flex', gap: 1, pt: 1.5, borderTop: '1px solid #EBF0F5' }}>
                  <Button variant="contained" size="small">View Project</Button>
                  <Button variant="outlined" size="small">Submit Draft</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

// ── TRAINEE ANNOUNCEMENTS ─────────────────────────────────────
export function TraineeAnnouncements() {
  const fullAnnouncements = [
    { ...announcements[0], fullBody: 'All trainees are required to report to the Medical Bay (Block C, Room 101) at 10:00 AM for the mandatory bi-monthly health checkup. Attendance is compulsory and will be recorded. Bring your ID card and any current prescriptions. Trainees who miss without medical exemption will be marked absent.' },
    { ...announcements[1], fullBody: 'Dr. Kavita Nair, Principal Scientist at DRDO Electronics & Radar Development Establishment (LRDE), Bangalore, will deliver a talk on "AI in Defence Systems: Current Deployments, Challenges and Future Direction." Session: 15:00–17:00, Seminar Hall A. Bonus attendance for AI/ML and Data Science trainees.' },
    { ...announcements[2], fullBody: 'Due to scheduled server maintenance (13–14 Jun), the project submission portal will be unavailable. Final deadline for AI/ML and Cyber Sec capstone projects extended from 15 Jun to 20 Jun 2025, 23:59 IST. All documentation (codebase, report, presentation, demo video) must be uploaded before the deadline.' },
    { ...announcements[3], fullBody: 'The Annual Best Project Award Ceremony will be held on 25 June 2025 at 16:00 in Parade Ground Auditorium. Top 3 projects from each domain will be showcased. The Commanding Officer will preside. All trainees and instructors requested to attend in uniform. Shortlisted teams notified by 22 Jun.' },
  ];

  return (
    <Box>
      <PageHeader title="Announcements" subtitle="All announcements relevant to your batch and domain" />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {fullAnnouncements.map(a => (
          <Card key={a.id} sx={{ borderLeft: `3px solid ${a.priority === 'urgent' ? '#C0392B' : a.priority === 'notice' ? '#3D5A80' : '#4A6331'}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{a.title}</Typography>
                  <Typography variant="caption">{a.date} · {a.audience}</Typography>
                </Box>
                <Chip
                  label={a.priority.charAt(0).toUpperCase() + a.priority.slice(1)}
                  size="small"
                  sx={{
                    background: a.priority === 'urgent' ? '#FCECEA' : a.priority === 'notice' ? '#EBF2F9' : '#EEF2E8',
                    color: a.priority === 'urgent' ? '#C0392B' : a.priority === 'notice' ? '#3D5A80' : '#4A6331',
                    fontWeight: 700, fontSize: '0.7rem',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.72, mt: 1 }}>{a.fullBody}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

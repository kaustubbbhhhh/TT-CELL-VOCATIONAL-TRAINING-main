import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Table,
  TableHead, TableBody, TableRow, TableCell, TableContainer,
  LinearProgress, Chip, TextField, InputAdornment, MenuItem, Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  StatusChip, DomainChip, AttendanceBar, MetricCard,
  PageHeader, Breadcrumb, AnnouncementCard,
} from '../../components/UIComponents';
import { trainees, projects, announcements, attendance } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

// ── STUDENTS ──────────────────────────────────────────────────
export function TraineesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');

  const filtered = trainees.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (domain === 'All' || s.domain === domain)
  );

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Trainees' }]} />
      <PageHeader
        title="Trainee Management"
        subtitle={`${trainees.length} enrolled trainees across 6 domains · Batch 2024-B`}
        actions={
          <>
            <Button variant="outlined" size="small">📥 Import CSV</Button>
            <Button variant="outlined" size="small">📤 Export</Button>
            <Button variant="contained" size="small">+ Add Trainee</Button>
          </>
        }
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.25, mb: 2.5, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search by name, roll number, domain…" value={search} onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#7A8B99' }} /></InputAdornment> }}
        />
        <Select size="small" value={domain} onChange={e => setDomain(e.target.value)} sx={{ minWidth: 150 }}>
          {['All', 'AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </Select>
        <Select size="small" defaultValue="All" sx={{ minWidth: 130 }}>
          {['All Status', 'Active', 'At Risk', 'Completed'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </Select>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><input type="checkbox" /></TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Projects</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell padding="checkbox"><input type="checkbox" /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: `${s.color}22`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{s.initials}</Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{s.name}</Typography>
                        <Typography variant="caption">{s.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{s.id}</Typography></TableCell>
                  <TableCell><DomainChip domain={s.domain} /></TableCell>
                  <TableCell><AttendanceBar value={s.attendance} /></TableCell>
                  <TableCell>{s.projects} / {s.total}</TableCell>
                  <TableCell><StatusChip status={s.status} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button variant="outlined" size="small" sx={{ fontSize: '0.72rem', py: 0.5, px: 1.25 }}>View</Button>
                      {s.status === 'at_risk' && <Button variant="contained" color="error" size="small" sx={{ fontSize: '0.72rem', py: 0.5, px: 1.25 }}>Warn</Button>}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderTop: '1px solid #EBF0F5', background: '#F5F7FA' }}>
          <Typography variant="caption">Showing {filtered.length} of {trainees.length} trainees · <strong>2 at risk</strong></Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {['← Prev', '1', '2', '3', 'Next →'].map((p, i) => (
              <Button key={p} variant={p === '1' ? 'contained' : 'outlined'} size="small" sx={{ minWidth: 36, py: 0.5, fontSize: '0.75rem' }}>{p}</Button>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

// ── PROJECTS ──────────────────────────────────────────────────
const statusColors = { submitted: '#4A6331', in_progress: '#B8960C', planning: '#3D5A80' };
const statusLabels = { submitted: 'Submitted', in_progress: 'In Progress', planning: 'Planning' };

export function ProjectsPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Projects' }]} />
      <PageHeader title="Project Management" subtitle="38 active projects across all domains · Batch 2024-B"
        actions={<><Button variant="outlined" size="small">Filter</Button><Button variant="contained" size="small">+ Assign Project</Button></>}
      />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {projects.map(p => (
          <Card key={p.id} sx={{ borderLeft: `3px solid ${p.color}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="h6">{p.title}</Typography>
                  <Typography variant="caption">{p.id} · Team of {p.team} · {p.domain} Domain</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                  <Chip label={statusLabels[p.status]} size="small" sx={{ background: `${statusColors[p.status]}22`, color: statusColors[p.status], fontWeight: 700, fontSize: '0.7rem' }} />
                  {p.score && <Chip label={`Score: ${p.score}/100`} size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700, fontSize: '0.7rem' }} />}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#445566', mb: 1.75, lineHeight: 1.65 }}>{p.description}</Typography>
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Completion</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: statusColors[p.status] }}>{p.progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={p.progress}
                  sx={{ height: 7, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: statusColors[p.status], borderRadius: 10 } }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {p.stack.map(s => <Chip key={s} label={s} size="small" sx={{ background: '#EBF0F5', color: '#445566', fontWeight: 600, fontSize: '0.68rem' }} />)}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

// ── ATTENDANCE ────────────────────────────────────────────────
export function AttendancePage() {
  const navigate = useNavigate();
  const domainSummary = [
    { name: 'AI/ML', present: 29, total: 31, color: '#4A6331' },
    { name: 'Cyber Sec', present: 17, total: 20, color: '#C0392B' },
    { name: 'Web Dev', present: 21, total: 23, color: '#3D5A80' },
    { name: 'Data Sci', present: 18, total: 19, color: '#B8960C' },
    { name: 'IoT', present: 14, total: 15, color: '#4A6331' },
    { name: 'Embedded', present: 13, total: 14, color: '#C2185B' },
  ];

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Attendance' }]} />
      <PageHeader title="Attendance Management" subtitle="Thursday, 12 June 2025 · Batch 2024-B"
        actions={<><Button variant="outlined" size="small">📤 Export</Button><Button variant="contained" size="small">✓ Mark Attendance</Button></>}
      />
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="Present Today" value="124" sub="of 142 trainees" accentColor="#4A6331" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Absent Today" value="18" sub="6 without leave approval" accentColor="#C0392B" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="This Week Avg" value="87.4%" delta="+2.1% vs last week" deltaUp accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Batch Overall" value="89.2%" sub="Since Jan 2025" accentColor="#3D5A80" /></Grid>
      </Grid>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.25, mb: 2.5 }}>
        {domainSummary.map(d => (
          <Box key={d.name} sx={{ background: `${d.color}14`, border: `1px solid ${d.color}30`, borderRadius: '8px', p: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{d.name}</Typography>
            <Chip label={`${d.present} / ${d.total}`} size="small" sx={{ background: `${d.color}22`, color: d.color, fontWeight: 700, fontSize: '0.7rem' }} />
          </Box>
        ))}
      </Box>

      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.75, borderBottom: '1px solid #EBF0F5' }}>
          <Typography variant="h6">Today's Attendance Register — 12 Jun 2025</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((a, i) => (
                <TableRow key={i} sx={{ background: a.status === 'absent' ? 'rgba(252,236,234,0.35)' : 'transparent' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2E8', color: '#4A6331', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                        {trainees[i % trainees.length]?.initials || 'TR'}
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{trainees[i % trainees.length]?.name || 'Trainee'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{trainees[i % trainees.length]?.id}</Typography></TableCell>
                  <TableCell><DomainChip domain={trainees[i % trainees.length]?.domain || 'AI/ML'} /></TableCell>
                  <TableCell><Typography sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.time}</Typography></TableCell>
                  <TableCell><StatusChip status={a.status} /></TableCell>
                  <TableCell>{a.leave ? <Chip label={a.leave} size="small" sx={{ background: '#FAF5DC', color: '#7A6000', fontWeight: 700, fontSize: '0.7rem' }} /> : '—'}</TableCell>
                  <TableCell><Typography variant="caption" sx={{ color: a.status === 'absent' ? '#C0392B' : '#7A8B99' }}>{a.status === 'absent' ? 'No leave applied — Warning triggered' : '—'}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────
export function AnnouncementsPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Announcements' }]} />
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Announcement Center</Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>Post New Announcement</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Announcement Title *</Typography>
                  <Box component="input" sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', '&:focus': { borderColor: '#4A6331' } }} placeholder="e.g. Revised Session Schedule for AI/ML" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Full Message *</Typography>
                  <Box component="textarea" rows={5} sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box', '&:focus': { borderColor: '#4A6331' } }} placeholder="Write the full announcement here..." />
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Target Audience</Typography>
                    <Box component="select" sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', appearance: 'none', background: '#fff' }}>
                      {['All Batches', 'AI/ML Domain', 'Cyber Security', 'Web Development', 'Data Science', 'IoT', 'Embedded Systems'].map(o => <option key={o}>{o}</option>)}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>Priority Level</Typography>
                    <Box component="select" sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', appearance: 'none', background: '#fff' }}>
                      {['Normal', 'Urgent', 'Notice', 'Informational'].map(o => <option key={o}>{o}</option>)}
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" sx={{ flex: 1 }}>Publish Now</Button>
                  <Button variant="outlined">Save Draft</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6">Published</Typography>
            <Chip label={`${announcements.length} total`} size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700 }} />
          </Box>
          {announcements.map(a => (
            <Box key={a.id} sx={{ mb: 1 }}>
              <AnnouncementCard title={a.title} meta={`${a.date} · ${a.audience} · ${a.priority.charAt(0).toUpperCase() + a.priority.slice(1)}`} priority={a.priority} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

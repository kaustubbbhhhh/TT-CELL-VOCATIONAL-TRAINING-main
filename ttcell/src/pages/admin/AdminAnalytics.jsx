import React from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Chip, LinearProgress,
} from '@mui/material';
import {
  MetricCard, BarChart, AnalyticsRow, PageHeader,
  Breadcrumb, DomainChip, ToggleRow,
} from '../../components/UIComponents';
import { repository, placementYears, domainData } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

// ── ANALYTICS ─────────────────────────────────────────────────
export function AnalyticsPage() {
  const navigate = useNavigate();
  const placementData = placementYears.map(y => ({ value: y.rate, label: y.year, highlight: y.year === '2024' }));
  const domainColors = { 'AI/ML': '#4A6331', 'Web Dev': '#3D5A80', 'Cyber Sec': '#C0392B', 'Data Sci': '#B8960C', 'IoT': '#4A6331', 'Embedded': '#C2185B' };
  const scores = [
    { name: 'AI/ML', val: 88.2 }, { name: 'Cyber Sec', val: 84.0 },
    { name: 'Data Sci', val: 82.1 }, { name: 'Web Dev', val: 79.4 },
    { name: 'Embedded', val: 74.8 }, { name: 'IoT', val: 71.3 },
  ];

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Analytics' }]} />
      <PageHeader title="Training Analytics" subtitle="Batch 2024-B performance overview" />

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="Completion Rate" value="78.2%" delta="+4.1% vs Batch 2023" deltaUp accentColor="#4A6331" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Avg Project Score" value="81.4" delta="+3.2 points" deltaUp accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Placement Rate" value="94%" delta="All-time high ↑" deltaUp accentColor="#3D5A80" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Dropout Rate" value="2.1%" delta="↓ Down from 3.4%" deltaUp accentColor="#C0392B" /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Average Score by Domain</Typography>
              {scores.map(s => (
                <AnalyticsRow key={s.name} label={s.name} value={Math.round(s.val)} total={100} color={domainColors[s.name] || '#4A6331'} />
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Placement Rate by Batch Year</Typography>
              <BarChart data={placementData} height={130} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Attendance Distribution</Typography>
              {[
                { label: '95–100%', val: 40, total: 142, color: '#4A6331' },
                { label: '85–95%', val: 74, total: 142, color: '#4A6331' },
                { label: '75–85%', val: 25, total: 142, color: '#B8960C' },
                { label: 'Below 75%', val: 7, total: 142, color: '#C0392B' },
              ].map(r => <AnalyticsRow key={r.label} label={r.label} value={r.val} total={r.total} color={r.color} />)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Project Submission Status</Typography>
              {[
                { label: 'Submitted', val: 22, total: 38, color: '#4A6331' },
                { label: 'In Progress', val: 14, total: 38, color: '#B8960C' },
                { label: 'Planning', val: 2, total: 38, color: '#3D5A80' },
              ].map(r => <AnalyticsRow key={r.label} label={r.label} value={r.val} total={r.total} color={r.color} />)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Top Performers</Typography>
              {[
                { rank: 1, name: 'Meera Rao', sub: 'Data Sci · 96% att · 4/4', score: 95, c: '#4A6331', bg: '#EEF2E8' },
                { rank: 2, name: 'Priya Sharma', sub: 'Cyber Sec · 88% att · 4/4', score: 92, c: '#3D5A80', bg: '#EBF2F9' },
                { rank: 3, name: 'Rahul Verma', sub: 'AI/ML · 92% att · 3/4', score: 88, c: '#B8960C', bg: '#FAF5DC' },
              ].map(p => (
                <Box key={p.rank} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5, '&:last-child': { mb: 0 } }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: p.bg, color: p.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>{p.rank}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.8375rem', fontWeight: 700 }}>{p.name}</Typography>
                    <Typography variant="caption">{p.sub}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>{p.score}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── REPORTS ───────────────────────────────────────────────────
export function ReportsPage() {
  const navigate = useNavigate();
  const reports = [
    { icon: '📊', title: 'Attendance Report', body: 'Domain-wise and date-range attendance summaries with defaulters list and leave breakdown.', color: '#4A6331', variant: 'contained' },
    { icon: '📁', title: 'Project Progress Report', body: 'Status of all active and completed projects with scoring breakdown and review comments.', color: '#3D5A80', variant: 'contained' },
    { icon: '🎓', title: 'Batch Performance Report', body: 'Overall cohort assessment: composite scores, attendance, project quality, readiness index.', color: '#B8960C', variant: 'contained' },
    { icon: '⚠️', title: 'At-Risk Trainee Report', body: 'Trainees below the 75% attendance threshold or with outstanding project submissions.', color: '#C0392B', variant: 'danger' },
    { icon: '📈', title: 'Placement Analytics Report', body: 'Historical placement data, hiring organisations, salary benchmarks, and domain-wise outcomes.', color: '#3D5A80', variant: 'outlined' },
    { icon: '🏛️', title: 'MoD Compliance Report', body: 'Ministry of Defence required format for quarterly submission to Training Directorate, Army HQ.', color: '#4A6331', variant: 'contained' },
  ];

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Reports' }]} />
      <PageHeader title="Reports" subtitle="Generate and export training reports" />
      <Grid container spacing={2}>
        {reports.map(r => (
          <Grid item xs={12} sm={6} md={4} key={r.title}>
            <Card sx={{ height: '100%', borderTop: `3px solid ${r.color}` }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography sx={{ fontSize: 32, mb: 1.5 }}>{r.icon}</Typography>
                <Typography variant="h6" sx={{ mb: 0.75 }}>{r.title}</Typography>
                <Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.65, flex: 1, mb: 2 }}>{r.body}</Typography>
                <Button
                  fullWidth
                  variant={r.variant === 'outlined' ? 'outlined' : 'contained'}
                  color={r.variant === 'danger' ? 'error' : 'primary'}
                  size="small"
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ── REPOSITORY ────────────────────────────────────────────────
export function RepositoryPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Project Archive' }]} />
      <PageHeader
        title="Historical Project Repository"
        subtitle="Archive of all completed capstone projects since Batch 2012 · 312 projects"
        actions={<Button variant="outlined" size="small">📤 Export Index</Button>}
      />

      <Box sx={{ display: 'flex', gap: 1.25, mb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, background: '#fff', border: '1px solid #B8C5D3', borderRadius: '8px', px: 1.5, py: 0.75, minWidth: 220 }}>
          <Typography sx={{ color: '#7A8B99', fontSize: 16 }}>🔍</Typography>
          <Box component="input" sx={{ border: 'none', outline: 'none', fontSize: '0.875rem', flex: 1, fontFamily: 'inherit', color: '#1A2332', background: 'transparent' }} placeholder="Search by project name, technology, batch year, domain…" />
        </Box>
        {['All Domains', 'All Years', 'Sort: Newest'].map(label => (
          <Box key={label} component="select" sx={{ p: '8px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', appearance: 'none', background: '#fff', minWidth: 130 }}>
            <option>{label}</option>
          </Box>
        ))}
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Title</TableCell>
                <TableCell>Project ID</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Tech Stack</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repository.map(r => (
                <TableRow key={r.id}>
                  <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{r.title}</Typography></TableCell>
                  <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.775rem', color: '#7A8B99' }}>{r.id}</Typography></TableCell>
                  <TableCell><DomainChip domain={r.domain} /></TableCell>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>{r.team}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.25 }}>
                      <Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>{r.score}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#7A8B99' }}>/100</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.775rem', color: '#7A8B99' }}>{r.stack}</Typography></TableCell>
                  <TableCell><Button variant="outlined" size="small" sx={{ fontSize: '0.72rem' }}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderTop: '1px solid #EBF0F5', background: '#F5F7FA' }}>
          <Typography variant="caption">Showing 6 of 312 archived projects</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {['1', '2', '3', '…52', 'Next →'].map((p, i) => (
              <Button key={p} variant={p === '1' ? 'contained' : 'outlined'} size="small" sx={{ minWidth: 36, py: 0.5, fontSize: '0.75rem' }}>{p}</Button>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────
export function SettingsPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Settings' }]} />
      <PageHeader title="Portal Settings" subtitle="Configure system-wide parameters and access controls" />
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>General Configuration</Typography>
              {[
                { label: 'Organisation Name', val: 'TT Cell — Army Base Workshop' },
                { label: 'Current Batch Identifier', val: 'Batch 2024-B', hint: 'Used across all reports, dashboards, and trainee-facing views.' },
                { label: 'Min. Attendance Threshold (%)', val: '75', hint: 'Trainees below this trigger an automatic at-risk flag.' },
                { label: 'Academic Year', val: '2024–2025' },
              ].map(f => (
                <Box key={f.label} sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>{f.label}</Typography>
                  <Box component="input" defaultValue={f.val} sx={{ width: '100%', p: '9px 12px', border: '1px solid #B8C5D3', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', '&:focus': { borderColor: '#4A6331' } }} />
                  {f.hint && <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>{f.hint}</Typography>}
                </Box>
              ))}
              <Button variant="contained">Save Configuration</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Notification Settings</Typography>
              <ToggleRow label="Email alerts for at-risk trainees" sub="Sent to admin and training officer" enabled={true} />
              <ToggleRow label="Daily attendance summary" sub="Emailed to CO at 18:00 daily" enabled={true} />
              <ToggleRow label="Project deadline reminders" sub="Sent 7 and 2 days before deadlines" enabled={true} />
              <ToggleRow label="New trainee registration alerts" sub="Instant notification on new enrolment" enabled={false} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>User & Access Management</Typography>
              {[
                { label: 'Admin accounts', value: '4 active' },
                { label: 'Trainee accounts', value: '142 active' },
                { label: 'Last login', value: 'Today, 09:28 IST (ADM Sharma)' },
                { label: 'Two-factor auth', value: null, chip: { label: '✓ Enabled', bg: '#EAFAF1', color: '#1D6A42' } },
                { label: 'Session timeout', value: '8 hours' },
              ].map(r => (
                <Box key={r.label} sx={{ display: 'flex', gap: 2, py: 1.25, borderBottom: '1px solid #EBF0F5', '&:last-child': { borderBottom: 'none' } }}>
                  <Typography sx={{ fontSize: '0.775rem', fontWeight: 700, color: '#7A8B99', minWidth: 160 }}>{r.label}</Typography>
                  {r.chip
                    ? <Chip label={r.chip.label} size="small" sx={{ background: r.chip.bg, color: r.chip.color, fontWeight: 700, fontSize: '0.7rem' }} />
                    : <Typography sx={{ fontSize: '0.8375rem', fontWeight: 600 }}>{r.value}</Typography>
                  }
                </Box>
              ))}
              <Box sx={{ display: 'grid', gap: 1, mt: 2 }}>
                <Button variant="contained" color="primary" size="small" fullWidth>Manage Admin Accounts</Button>
                <Button variant="outlined" size="small" fullWidth>Reset Trainee Passwords</Button>
                <Button variant="outlined" size="small" fullWidth>Export User Directory</Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ border: '1.5px solid #C0392B' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 0.5, color: '#C0392B' }}>⚠️ Danger Zone</Typography>
              <Typography variant="body2" sx={{ color: '#445566', mb: 2, lineHeight: 1.6 }}>
                These actions are irreversible. Confirm with CO authorisation before proceeding.
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Button variant="outlined" color="error" size="small" fullWidth>Archive Current Batch Data</Button>
                <Button variant="contained" color="error" size="small" fullWidth>Reset Portal to Factory State</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

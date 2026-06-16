import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Chip, LinearProgress, CircularProgress,
  TextField, InputAdornment, MenuItem, Select,
  Snackbar, Alert, Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  MetricCard, BarChart, AnalyticsRow, PageHeader,
  Breadcrumb, DomainChip,
} from '../../components/UIComponents';
import { analyticsApi, repositoryApi, settingsApi, reportsApi } from '../../api/portalApi';
import { useNavigate } from 'react-router-dom';

// ── ANALYTICS ─────────────────────────────────────────────────
export function AnalyticsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await analyticsApi.get();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#4A6331' }} />
      </Box>
    );
  }

  const {
    completion_rate = 0,
    avg_project_score = 0,
    total_trainees = 0,
    dropout_rate = 0,
    domain_scores = [],
    attendance_distribution = [],
    project_status_breakdown = [],
    top_performers = [],
  } = data || {};

  const domainColors = { 'AI/ML': '#4A6331', 'Web Dev': '#3D5A80', 'Cyber Sec': '#C0392B', 'Data Sci': '#B8960C', 'IoT': '#4A6331', 'Embedded': '#C2185B' };

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Analytics' }]} />
      <PageHeader title="Training Analytics" subtitle={`${total_trainees} trainees · Live data from MongoDB`} />

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="Completion Rate" value={`${completion_rate}%`} delta="Projects submitted or completed" deltaUp={completion_rate >= 70} accentColor="#4A6331" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Avg Project Score" value={String(avg_project_score)} delta="Across all scored projects" deltaUp={avg_project_score >= 75} accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Total Trainees" value={String(total_trainees)} delta="Active profiles" deltaUp accentColor="#3D5A80" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Dropout Rate" value={`${dropout_rate}%`} delta={dropout_rate <= 5 ? "Within acceptable range" : "Needs attention"} deltaUp={dropout_rate <= 5} accentColor="#C0392B" /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Average Score by Domain</Typography>
              {domain_scores.length > 0 ? (
                domain_scores.map(s => (
                  <AnalyticsRow key={s.name} label={s.name} value={Math.round(s.score)} total={100} color={domainColors[s.name] || '#4A6331'} />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 2 }}>No scored projects yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Attendance Distribution</Typography>
              {attendance_distribution.length > 0 ? (
                attendance_distribution.map(r => (
                  <AnalyticsRow
                    key={r.label}
                    label={r.label}
                    value={r.count}
                    total={total_trainees || 1}
                    color={r.color}
                  />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 2 }}>No attendance data.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Project Submission Status</Typography>
              {project_status_breakdown.length > 0 ? (
                project_status_breakdown.map(r => (
                  <AnalyticsRow key={r.label} label={r.label} value={r.count} total={project_status_breakdown.reduce((a, b) => a + b.count, 0) || 1} color={r.color} />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 2 }}>No projects yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Top Performers</Typography>
              {top_performers.length > 0 ? (
                top_performers.map(p => {
                  const rankColors = [
                    { c: '#4A6331', bg: '#EEF2E8' },
                    { c: '#3D5A80', bg: '#EBF2F9' },
                    { c: '#B8960C', bg: '#FAF5DC' },
                  ];
                  const rc = rankColors[p.rank - 1] || rankColors[0];
                  return (
                    <Box key={p.rank} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: rc.bg, color: rc.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>{p.rank}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.8375rem', fontWeight: 700 }}>{p.name}</Typography>
                        <Typography variant="caption">{p.domain} · {p.attendance}% att · {p.projects_completed}</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>{p.composite}</Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 2 }}>No trainee data yet.</Typography>
              )}
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
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleGenerate = async (reportType) => {
    setToast({ open: true, message: `Generating ${reportType}... please wait.`, severity: 'info' });
    try {
      const data = await reportsApi.generate(reportType);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType.toLowerCase().replace(/ /g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setToast({ open: true, message: `${reportType} generated and downloaded successfully!`, severity: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: `Failed to generate ${reportType}.`, severity: 'error' });
    }
  };

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
      <PageHeader title="Reports" subtitle="Generate and export training reports from live data" />
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
                  onClick={() => handleGenerate(r.title)}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={toast.open} autoHideDuration={5000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// ── REPOSITORY ────────────────────────────────────────────────
export function RepositoryPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [page, setPage] = useState(1);

  const fetchRepository = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (domain !== 'All') params.domain = domain;
      if (search.trim()) params.search = search;

      const res = await repositoryApi.list(params);
      setProjects(res.data.projects || []);
      setTotalCount(res.data.total_count || 0);
    } catch (err) {
      console.error('Failed to load repository:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepository();
  }, [domain, page]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchRepository();
    }
  };

  const totalPages = Math.ceil(totalCount / 20) || 1;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Project Archive' }]} />
      <PageHeader
        title="Historical Project Repository"
        subtitle={`Archive of completed and submitted capstone projects · ${totalCount} projects`}
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.25, mb: 2.5, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by project name, technology…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: '#7A8B99', cursor: 'pointer' }} onClick={() => { setPage(1); fetchRepository(); }} />
              </InputAdornment>
            )
          }}
        />
        <Select size="small" value={domain} onChange={e => { setDomain(e.target.value); setPage(1); }} sx={{ minWidth: 150 }}>
          {['All', 'AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded'].map(d => <MenuItem key={d} value={d}>{d === 'All' ? 'All Domains' : d}</MenuItem>)}
        </Select>
      </Box>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4A6331' }} /></Box>
        ) : (
          <>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map(r => (
                      <TableRow key={r.id}>
                        <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.8375rem' }}>{r.title}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.775rem', color: '#7A8B99' }}>{r.project_code}</Typography></TableCell>
                        <TableCell><DomainChip domain={r.domain} /></TableCell>
                        <TableCell>{r.batch}</TableCell>
                        <TableCell>{r.team}</TableCell>
                        <TableCell>
                          {r.score != null ? (
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.25 }}>
                              <Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>{r.score}</Typography>
                              <Typography sx={{ fontSize: '0.72rem', color: '#7A8B99' }}>/100</Typography>
                            </Box>
                          ) : (
                            <Typography sx={{ fontSize: '0.8rem', color: '#7A8B99' }}>—</Typography>
                          )}
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.775rem', color: '#7A8B99' }}>{r.stack}</Typography></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography sx={{ color: '#7A8B99', py: 2 }}>No archived projects found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderTop: '1px solid #EBF0F5', background: '#F5F7FA' }}>
              <Typography variant="caption">Showing page {page} of {totalPages} · {totalCount} total projects</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button variant="outlined" size="small" disabled={page <= 1} onClick={() => setPage(p => p - 1)} sx={{ minWidth: 36, py: 0.5, fontSize: '0.75rem' }}>← Prev</Button>
                <Button variant="contained" size="small" sx={{ minWidth: 36, py: 0.5, fontSize: '0.75rem' }}>{page}</Button>
                <Button variant="outlined" size="small" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} sx={{ minWidth: 36, py: 0.5, fontSize: '0.75rem' }}>Next →</Button>
              </Box>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────
function ToggleRow({ label, sub, enabled, onChange }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #EBF0F5', '&:last-child': { borderBottom: 'none' } }}>
      <Box>
        <Typography sx={{ fontSize: '0.8375rem', fontWeight: 700 }}>{label}</Typography>
        {sub && <Typography variant="caption" sx={{ color: '#7A8B99' }}>{sub}</Typography>}
      </Box>
      <Switch checked={enabled} onChange={onChange} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4A6331' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4A6331' } }} />
    </Box>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [settings, setSettings] = useState({
    org_name: 'TT Cell — Army Base Workshop',
    batch_identifier: 'Batch 2024-B',
    min_attendance_threshold: 75,
    academic_year: '2024–2025',
    email_at_risk_alerts: true,
    daily_attendance_summary: true,
    project_deadline_reminders: true,
    new_trainee_registration_alerts: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await settingsApi.get();
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      setToast({ open: true, message: 'Settings saved successfully.', severity: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to save settings.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#4A6331' }} />
      </Box>
    );
  }

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
                { label: 'Organisation Name', key: 'org_name' },
                { label: 'Current Batch Identifier', key: 'batch_identifier', hint: 'Used across all reports, dashboards, and trainee-facing views.' },
                { label: 'Min. Attendance Threshold (%)', key: 'min_attendance_threshold', type: 'number', hint: 'Trainees below this trigger an automatic at-risk flag.' },
                { label: 'Academic Year', key: 'academic_year' },
              ].map(f => (
                <Box key={f.key} sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75 }}>{f.label}</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    type={f.type || 'text'}
                    value={settings[f.key] || ''}
                    onChange={e => setSettings({ ...settings, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                  />
                  {f.hint && <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>{f.hint}</Typography>}
                </Box>
              ))}
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{ background: '#4A6331', '&:hover': { background: '#3A4E27' } }}
              >
                {saving ? 'Saving…' : 'Save Configuration'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Notification Settings</Typography>
              <ToggleRow
                label="Email alerts for at-risk trainees"
                sub="Sent to admin and training officer"
                enabled={settings.email_at_risk_alerts}
                onChange={() => setSettings({ ...settings, email_at_risk_alerts: !settings.email_at_risk_alerts })}
              />
              <ToggleRow
                label="Daily attendance summary"
                sub="Emailed to CO at 18:00 daily"
                enabled={settings.daily_attendance_summary}
                onChange={() => setSettings({ ...settings, daily_attendance_summary: !settings.daily_attendance_summary })}
              />
              <ToggleRow
                label="Project deadline reminders"
                sub="Sent 7 and 2 days before deadlines"
                enabled={settings.project_deadline_reminders}
                onChange={() => setSettings({ ...settings, project_deadline_reminders: !settings.project_deadline_reminders })}
              />
              <ToggleRow
                label="New trainee registration alerts"
                sub="Instant notification on new enrolment"
                enabled={settings.new_trainee_registration_alerts}
                onChange={() => setSettings({ ...settings, new_trainee_registration_alerts: !settings.new_trainee_registration_alerts })}
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Notification Preferences'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>User & Access Management</Typography>
              {[
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

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, LinearProgress, Chip, CircularProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  MetricCard, BarChart, AnnouncementCard,
  PageHeader, Breadcrumb, StepIndicator,
  InfoRow, StatusChip, AttendanceBar,
} from '../../components/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, announcementsApi, attendanceApi } from '../../api/portalApi';
import { authApi } from '../../api/authApi';

// Helper to get initials
function getInitials(name) {
  if (!name) return 'TR';
  return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
}

// ── TRAINEE DASHBOARD ─────────────────────────────────────────
export function TraineeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, announcementsRes] = await Promise.all([
          dashboardApi.getTraineeStats(user?.trainee_id),
          announcementsApi.list()
        ]);
        setStats(statsRes.data);
        setAnnouncements((announcementsRes.data || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load trainee dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.trainee_id) {
      loadDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#4A6331' }} />
      </Box>
    );
  }

  const {
    my_attendance = 100,
    projects_done = '0 / 0',
    composite_score = 85.0,
    weeks_remaining = 5,
    current_project = null,
    schedule_data = []
  } = stats || {};

  const barChartData = schedule_data.map((v, i) => ({
    value: v,
    label: `W${i + 1}`,
    highlight: i === schedule_data.length - 1
  }));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Good morning, {stats?.name || user?.name} 👋</Typography>
        <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.25 }}>
          {stats?.domain || 'Vocational Training'} Domain · {stats?.batch || 'Batch 2024-B'} · Week 11 of 16
        </Typography>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}>
          <MetricCard 
            label="My Attendance" 
            value={`${my_attendance}%`} 
            delta={my_attendance >= 75 ? "Well above threshold" : "Below 75% limit"} 
            deltaUp={my_attendance >= 75} 
            accentColor="#4A6331" 
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard 
            label="Projects Done" 
            value={projects_done} 
            sub="Active Assignments" 
            accentColor="#B8960C" 
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard 
            label="Composite Score" 
            value={String(composite_score)} 
            delta="Overall Performance" 
            deltaUp 
            accentColor="#3D5A80" 
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard 
            label="Weeks Remaining" 
            value={String(weeks_remaining)} 
            sub="Graduation: August 2025" 
            accentColor="#4A6331" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              {current_project ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="h6">Current Project</Typography>
                      <Typography variant="caption">{current_project.title} · {current_project.project_code}</Typography>
                    </Box>
                    <Chip 
                      label={current_project.status.replace('_', ' ').toUpperCase()} 
                      size="small" 
                      sx={{ background: '#FAF5DC', color: '#7A6000', fontWeight: 700, fontSize: '0.7rem' }} 
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#445566', mb: 2, lineHeight: 1.65 }}>
                    {current_project.description}
                  </Typography>

                  <Box sx={{ mb: 0.75 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Overall Progress</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#4A6331' }}>{current_project.progress}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={current_project.progress}
                      sx={{ height: 8, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: '#4A6331', borderRadius: 10 } }}
                    />
                  </Box>

                  <Box sx={{ my: 2.5 }}>
                    <StepIndicator steps={['Research', 'Design', 'Build', 'Test', 'Submit']} current={2} />
                  </Box>

                  <Box sx={{ pt: 1.5, borderTop: '1px solid #EBF0F5' }}>
                    <Typography variant="caption">
                      Submission deadline: <strong style={{ color: '#1A2332' }}>{current_project.deadline}</strong>
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#7A8B99' }}>No Active Project</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>You are not assigned to any in-progress projects.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6">Announcements</Typography>
                <Chip label={`${announcements.length} new`} size="small" sx={{ background: '#FCECEA', color: '#C0392B', fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              {announcements.length > 0 ? (
                announcements.map(a => (
                  <AnnouncementCard 
                    key={a.id} 
                    title={a.title} 
                    meta={`${new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} · ${a.target_audience}`} 
                    priority={a.priority} 
                  />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', mt: 4 }}>No recent announcements.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Attendance — This Month</Typography>
              <BarChart data={barChartData} height={80} />
              <Typography variant="caption" sx={{ mt: 1.5, display: 'block' }}>
                Overall standing: <strong style={{ color: '#4A6331' }}>{my_attendance}%</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Project Standings</Typography>
              {stats?.project_scores && stats.project_scores.length > 0 ? (
                stats.project_scores.map((p, i) => (
                  <Box key={i} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.title}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: p.score ? '#4A6331' : '#7A8B99' }}>
                        {p.score ? `${p.score}/100` : '—/100'}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={p.score ?? p.progress}
                      sx={{ height: 6, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: p.score ? '#4A6331' : '#B8960C', borderRadius: 10 } }}
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 2 }}>No projects assigned yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── TRAINEE PROFILE ───────────────────────────────────────────
export function TraineeProfile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password reset state
  const [openPwdModal, setOpenPwdModal] = useState(false);
  const [pwdData, setPwdData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const handlePwdChange = async () => {
    setPwdError('');
    if (pwdData.new_password !== pwdData.confirm_password) {
      setPwdError("Passwords do not match");
      return;
    }
    setPwdLoading(true);
    try {
      await authApi.changePassword(pwdData.old_password, pwdData.new_password, pwdData.confirm_password);
      setPwdSuccess(true);
      setTimeout(() => {
        setOpenPwdModal(false);
        setPwdSuccess(false);
        setPwdData({ old_password: '', new_password: '', confirm_password: '' });
        // Optional: you might want to reload page or trigger logout since sessions are revoked
      }, 2000);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password. Please check complexity requirements.');
    } finally {
      setPwdLoading(false);
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await dashboardApi.getTraineeStats(user?.trainee_id);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.trainee_id) {
      loadStats();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4A6331' }} /></Box>
    );
  }

  const initials = getInitials(stats?.name || user?.name);

  return (
    <Box>
      <PageHeader title="My Profile" />
      <Grid container spacing={2.5} alignItems="flex-start">
        <Grid item xs={12} md="auto">
          <Card sx={{ textAlign: 'center', p: 2, minWidth: 160 }}>
            <CardContent>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2E8', color: '#4A6331', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, margin: '0 auto 12px' }}>
                {initials}
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>{stats?.name || user?.name}</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>{stats?.roll_number}</Typography>
              <Chip label={`${stats?.domain || 'Vocational'} Domain`} size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700, fontSize: '0.7rem' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
              <InfoRow label="Full Name" value={stats?.name || user?.name || ''} />
              <InfoRow label="Roll Number" value={<Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.875rem' }}>{stats?.roll_number}</Typography>} />
              <InfoRow label="Email (Portal)" value={user?.email || ''} />
              <InfoRow label="Phone" value={stats?.phone || '—'} />
              <Box sx={{ mt: 3 }}>
                <Button variant="outlined" color="primary" onClick={() => setOpenPwdModal(true)}>
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Training Details</Typography>
              <InfoRow label="Domain" value={stats?.domain || ''} />
              <InfoRow label="Batch" value={stats?.batch || ''} />
              <InfoRow label="Attendance Standing" value={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>{stats?.my_attendance}%</Typography>
                  <Typography variant="caption">· {stats?.my_attendance >= 75 ? 'Well above minimum threshold' : 'Below 75% limit'}</Typography>
                </Box>
              } />
              <InfoRow label="Composite Score" value={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#4A6331', fontSize: '1rem' }}>{stats?.composite_score} / 100</Typography>
                </Box>
              } />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openPwdModal} onClose={() => !pwdLoading && setOpenPwdModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {pwdSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>Password updated successfully! You may need to log in again.</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {pwdError && <Alert severity="error">{pwdError}</Alert>}
              <TextField
                label="Old Password" type="password" fullWidth
                value={pwdData.old_password} onChange={(e) => setPwdData({...pwdData, old_password: e.target.value})}
              />
              <TextField
                label="New Password" type="password" fullWidth
                value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})}
                helperText="Must be at least 8 chars long with 1 uppercase, 1 lowercase, 1 number, and 1 special character."
              />
              <TextField
                label="Confirm New Password" type="password" fullWidth
                value={pwdData.confirm_password} onChange={(e) => setPwdData({...pwdData, confirm_password: e.target.value})}
              />
            </Box>
          )}
        </DialogContent>
        {!pwdSuccess && (
          <DialogActions>
            <Button onClick={() => setOpenPwdModal(false)} disabled={pwdLoading}>Cancel</Button>
            <Button onClick={handlePwdChange} variant="contained" disabled={pwdLoading}>
              {pwdLoading ? <CircularProgress size={24} /> : 'Save New Password'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}

// ── TRAINEE ATTENDANCE ────────────────────────────────────────
export function TraineeAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const [statsRes, attendanceRes] = await Promise.all([
          dashboardApi.getTraineeStats(user?.trainee_id),
          attendanceApi.get({ trainee_id: user?.trainee_id })
        ]);
        setStats(statsRes.data);
        setRecords(attendanceRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.trainee_id) {
      loadAttendance();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4A6331' }} /></Box>
    );
  }

  const overall = stats?.my_attendance || 100;
  const presentCount = records.filter(r => r.status === 'present').length;
  const leaveCount = records.filter(r => r.status === 'leave').length;
  const absentCount = records.filter(r => r.status === 'absent').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>My Attendance</Typography>
          <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.25 }}>Complete record · Batch 2024-B</Typography>
        </Box>
      </Box>

      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}>
          <MetricCard label="Overall Attendance" value={`${overall}%`} sub={overall >= 75 ? "Above 75% threshold ✓" : "Defaulter list ⚠️"} accentColor="#4A6331" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Days Present" value={String(presentCount)} sub={`of ${records.length} registered days`} accentColor="#3D5A80" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Approved Leave" value={String(leaveCount)} sub="Medical + Personal" accentColor="#B8960C" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Unauthorised" value={String(absentCount)} sub="Unexcused absences" accentColor="#C0392B" />
        </Grid>
      </Grid>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Attendance Standing</Typography>
          <Typography variant="body2" sx={{ color: '#445566', mb: 1.5 }}>
            Your attendance is <strong>{overall >= 75 ? 'safe' : 'low'}</strong>. Current standing: <strong style={{ color: '#4A6331' }}>{overall}%</strong>.
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={overall}
            sx={{ height: 10, borderRadius: 10, background: '#EBF0F5', mb: 0.75, '& .MuiLinearProgress-bar': { background: '#4A6331', borderRadius: 10 } }}
          />
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ px: 2, py: 1.75, borderBottom: '1px solid #EBF0F5' }}>
          <Typography variant="h6">Day-wise Attendance Logs</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Session / Activity</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length > 0 ? (
                records.map((a, i) => {
                  const dateObj = new Date(a.date);
                  const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const formattedDay = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{formattedDate}</Typography>
                        <Typography variant="caption" sx={{ color: '#7A8B99' }}>{formattedDay}</Typography>
                      </TableCell>
                      <TableCell>{a.session_name}</TableCell>
                      <TableCell><Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{a.time_in || '—'}</Typography></TableCell>
                      <TableCell><StatusChip status={a.status} /></TableCell>
                      <TableCell>
                        {a.leave_type ? (
                          <Chip label={a.leave_type} size="small" sx={{ background: '#FAF5DC', color: '#7A6000', fontWeight: 700, fontSize: '0.7rem' }} />
                        ) : (
                          <Typography variant="caption">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>{a.notes || '—'}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography sx={{ color: '#7A8B99', py: 2 }}>No attendance records found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

// ── TRAINEE PROJECTS ──────────────────────────────────────────
const projStatusColor = { in_progress: '#B8960C', completed: '#4A6331', planning: '#3D5A80' };
const projStatusLabel = { in_progress: 'In Progress', completed: 'Completed', planning: 'Planning' };

export function TraineeProjects() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await dashboardApi.getTraineeStats(user?.trainee_id);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.trainee_id) {
      loadStats();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4A6331' }} /></Box>
    );
  }

  const projects = stats?.project_scores || [];
  const completedCount = stats?.completed_count || 0;
  const activeCount = stats?.total_assigned || 0;

  return (
    <Box>
      <PageHeader 
        title="My Projects" 
        subtitle={`${activeCount} assigned projects · ${completedCount} completed`} 
      />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {projects.length > 0 ? (
          projects.map((p, idx) => {
            const statusVal = p.score ? 'completed' : 'in_progress';
            return (
              <Card key={idx} sx={{ borderLeft: `3px solid ${projStatusColor[statusVal]}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="h6">{p.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      <Chip 
                        label={projStatusLabel[statusVal]} 
                        size="small"
                        sx={{ background: `${projStatusColor[statusVal]}22`, color: projStatusColor[statusVal], fontWeight: 700, fontSize: '0.7rem' }}
                      />
                      {p.score && (
                        <Chip label={`Score: ${p.score}/100`} size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700, fontSize: '0.7rem' }} />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 1.5, mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">{statusVal === 'completed' ? 'Completed' : 'Progress'}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: projStatusColor[statusVal] }}>{p.score ? 100 : p.progress}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={p.score ? 100 : p.progress}
                      sx={{ height: 6, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: projStatusColor[statusVal], borderRadius: 10 } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 4 }}>No projects assigned to you.</Typography>
        )}
      </Box>
    </Box>
  );
}

// ── TRAINEE ANNOUNCEMENTS ─────────────────────────────────────
export function TraineeAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await announcementsApi.list();
        setAnnouncements((res.data || []).filter(a => !a.is_draft));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#4A6331' }} /></Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Announcements" subtitle="Announcements relevant to your domain and batch" />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {announcements.length > 0 ? (
          announcements.map(a => (
            <Card key={a.id} sx={{ borderLeft: `3px solid ${a.priority === 'urgent' ? '#C0392B' : a.priority === 'notice' ? '#3D5A80' : '#4A6331'}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{a.title}</Typography>
                    <Typography variant="caption">
                      {new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {a.target_audience}
                    </Typography>
                  </Box>
                  <Chip
                    label={a.priority.toUpperCase()}
                    size="small"
                    sx={{
                      background: a.priority === 'urgent' ? '#FCECEA' : a.priority === 'notice' ? '#EBF2F9' : '#EEF2E8',
                      color: a.priority === 'urgent' ? '#C0392B' : a.priority === 'notice' ? '#3D5A80' : '#4A6331',
                      fontWeight: 700, fontSize: '0.7rem',
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#445566', lineHeight: 1.72, mt: 1 }}>{a.body}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', py: 4 }}>No announcements targeted to you.</Typography>
        )}
      </Box>
    </Box>
  );
}

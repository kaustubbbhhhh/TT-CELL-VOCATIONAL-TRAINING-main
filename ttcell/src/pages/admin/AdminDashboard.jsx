import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import {
  MetricCard, BarChart, AnalyticsRow, TimelineItem,
  AnnouncementCard, PageHeader, StatusBadge
} from '../../components/UIComponents';
import { dashboardApi, announcementsApi } from '../../api/portalApi';
import { useNavigate } from 'react-router-dom';

const domainColors = {
  'AI/ML': '#4B5D3A', 
  'Web Dev': '#7D7658', 
  'Cyber Sec': '#C17B2E',
  'Data Sci': '#B68A2D', 
  'IoT': '#547A43', 
  'Embedded': '#8C8470',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, announcementsRes] = await Promise.all([
          dashboardApi.getStats(),
          announcementsApi.list(),
        ]);
        setStats(statsRes.data);
        const activeAnn = (announcementsRes.data || [])
          .filter(a => !a.is_draft)
          .slice(0, 4);
        setPinnedAnnouncements(activeAnn);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#4B5D3A' }} />
      </Box>
    );
  }

  const {
    total_trainees = 0,
    avg_attendance = 100,
    active_projects = 0,
    at_risk_trainees = 0,
    attendance_weeks = [],
    domain_data = [],
    recent_activity = [],
  } = stats || {};

  const attendanceData = attendance_weeks.map((v, i) => ({
    value: v,
    label: `W${i + 1}`,
    highlight: v === Math.max(...attendance_weeks),
  }));

  const totalDomainTrainees = domain_data.reduce((acc, d) => acc + d.count, 0) || 1;

  return (
    <Box>
      <PageHeader
        title="Operations Command Centre"
        subtitle={`Live monitoring for Phase 1 Training Batch`}
        actions={
          <>
            <Button variant="outlined" size="small" onClick={() => navigate('/admin/reports')} sx={{ fontWeight: 600 }}>Generate Report</Button>
            <Button variant="contained" size="small" onClick={() => navigate('/admin/trainees')} sx={{ fontWeight: 600 }}>Register Trainee</Button>
          </>
        }
      />

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="Enrolled Trainees"
            value={String(total_trainees)}
            delta="Active Personnel"
            deltaUp
            accentColor="#4B5D3A"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="Avg Attendance"
            value={`${avg_attendance}%`}
            delta="Operational Presence"
            deltaUp={avg_attendance >= 75}
            accentColor="#7D7658"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="Active Projects"
            value={String(active_projects)}
            delta="In Deployment"
            deltaUp
            accentColor="#C17B2E"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="At Risk Personnel"
            value={String(at_risk_trainees)}
            delta="Below threshold"
            deltaUp={at_risk_trainees === 0}
            accentColor="#9E3A36"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#222222', fontSize: '1rem' }}>Attendance Trends (Last 6 Weeks)</Typography>
                <StatusBadge status="active" />
              </Box>
              <BarChart data={attendanceData} height={180} color="#4B5D3A" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#222222', fontSize: '1rem' }}>Deployment by Domain</Typography>
              {domain_data.map(d => (
                <AnalyticsRow
                  key={d.name}
                  label={d.name}
                  value={d.count}
                  total={totalDomainTrainees}
                  color={domainColors[d.name] || '#7D7658'}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity + Announcements */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#222222', fontSize: '1rem' }}>Operational Log</Typography>
                <Typography
                  sx={{ fontSize: '0.8125rem', color: '#4B5D3A', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => navigate('/admin/settings')}
                >
                  View Archive →
                </Typography>
              </Box>
              <Box>
                {recent_activity.map((act, index) => (
                  <TimelineItem
                    key={index}
                    time={act.time}
                    title={act.title}
                    body={act.body}
                    dotColor={
                      act.title.includes('Register') ? '#4B5D3A' :
                      act.title.includes('Attendance') ? '#7D7658' :
                      act.title.includes('Alert') ? '#C17B2E' : '#D6D0C4'
                    }
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#222222', fontSize: '1rem' }}>Active Directives</Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/admin/announcements')} sx={{ borderColor: '#D6D0C4', color: '#444444' }}>Issue Notice</Button>
              </Box>
              {pinnedAnnouncements.length > 0 ? (
                pinnedAnnouncements.map(a => (
                  <AnnouncementCard
                    key={a.id}
                    title={a.title}
                    meta={`${new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · [${a.priority.toUpperCase()}] · TGT: ${a.target_audience}`}
                    priority={a.priority}
                  />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#888888', textAlign: 'center', mt: 4, fontStyle: 'italic' }}>
                  No active directives currently deployed.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

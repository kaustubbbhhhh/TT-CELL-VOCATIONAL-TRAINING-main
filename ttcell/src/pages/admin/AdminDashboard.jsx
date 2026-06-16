import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Chip, CircularProgress } from '@mui/material';
import {
  MetricCard, BarChart, AnalyticsRow, TimelineItem,
  AnnouncementCard, PageHeader,
} from '../../components/UIComponents';
import { dashboardApi, announcementsApi } from '../../api/portalApi';
import { useNavigate } from 'react-router-dom';

const domainColors = {
  'AI/ML': '#4A6331', 'Web Dev': '#3D5A80', 'Cyber Sec': '#C0392B',
  'Data Sci': '#B8960C', 'IoT': '#4A6331', 'Embedded': '#C2185B',
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
        // Take non-draft announcements and sort by priority/date
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
        <CircularProgress sx={{ color: '#4A6331' }} />
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

  // Total domain trainees
  const totalDomainTrainees = domain_data.reduce((acc, d) => acc + d.count, 0) || 1;

  return (
    <Box>
      <PageHeader
        title="Executive Dashboard"
        subtitle={`Batch 2024-B · Live Updates`}
        actions={
          <>
            <Button variant="outlined" size="small" onClick={() => navigate('/admin/reports')}>Export Report</Button>
            <Button variant="contained" size="small" onClick={() => navigate('/admin/trainees')}>+ Add Trainee</Button>
          </>
        }
      />

      {/* Metrics */}
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="Total Trainees"
            value={String(total_trainees)}
            delta="Active Profiles"
            deltaUp
            accentColor="#4A6331"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="Avg Attendance"
            value={`${avg_attendance}%`}
            delta="Overall Presence"
            deltaUp={avg_attendance >= 75}
            accentColor="#B8960C"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="Active Projects"
            value={String(active_projects)}
            delta="In progress / Planning"
            deltaUp
            accentColor="#3D5A80"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard
            label="At Risk Trainees"
            value={String(at_risk_trainees)}
            delta="Below 75% attendance"
            deltaUp={at_risk_trainees === 0}
            accentColor="#C0392B"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Attendance — Last 6 Weeks</Typography>
                <Chip label="● Live" size="small" sx={{ background: '#EEF2E8', color: '#4A6331', fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              <BarChart data={attendanceData} height={130} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Trainees by Domain</Typography>
              {domain_data.map(d => (
                <AnalyticsRow
                  key={d.name}
                  label={d.name}
                  value={d.count}
                  total={totalDomainTrainees}
                  color={domainColors[d.name] || '#4A6331'}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity + Announcements */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Activity</Typography>
                <Typography
                  sx={{ fontSize: '0.8rem', color: '#4A6331', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => navigate('/admin/settings')}
                >
                  View logs →
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', pl: 3, '&::before': { content: '""', position: 'absolute', left: '4px', top: 8, bottom: 8, width: 2, background: '#D0D9E5' } }}>
                {recent_activity.map((act, index) => (
                  <TimelineItem
                    key={index}
                    time={act.time}
                    title={act.title}
                    body={act.body}
                    dotColor={
                      act.title.includes('New trainee') ? '#4A6331' :
                      act.title.includes('Attendance') ? '#B8960C' :
                      act.title.includes('Announcement') ? '#3D5A80' : '#7A8B99'
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Pinned Announcements</Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/admin/announcements')}>Post New</Button>
              </Box>
              {pinnedAnnouncements.length > 0 ? (
                pinnedAnnouncements.map(a => (
                  <AnnouncementCard
                    key={a.id}
                    title={a.title}
                    meta={`${new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · ${a.priority.toUpperCase()} · ${a.target_audience}`}
                    priority={a.priority}
                  />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#7A8B99', textAlign: 'center', mt: 4 }}>
                  No published announcements.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

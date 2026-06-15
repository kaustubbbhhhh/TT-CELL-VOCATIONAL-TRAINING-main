import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import {
  MetricCard, BarChart, AnalyticsRow, TimelineItem,
  AnnouncementCard, PageHeader,
} from '../../components/UIComponents';
import { attendanceWeeks, domainData, announcements } from '../../data/mockData';

const domainColors = {
  'AI/ML': '#4A6331', 'Web Dev': '#3D5A80', 'Cyber Sec': '#C0392B',
  'Data Sci': '#B8960C', 'IoT': '#4A6331', 'Embedded': '#C2185B',
};

export default function AdminDashboard() {
  const attendanceData = attendanceWeeks.map((v, i) => ({
    value: v, label: `W${i + 1}`, highlight: v === Math.max(...attendanceWeeks),
  }));

  return (
    <Box>
      <PageHeader
        title="Executive Dashboard"
        subtitle="Batch 2024-B · Updated 12 Jun 2025, 09:42 IST"
        actions={
          <>
            <Button variant="outlined" size="small">📤 Export Report</Button>
            <Button variant="contained" size="small">+ Add Trainee</Button>
          </>
        }
      />

      {/* Metrics */}
      <Grid container spacing={1.75} sx={{ mb: 2.5 }}>
        <Grid item xs={6} md={3}><MetricCard label="Total Trainees" value="142" delta="+12 this month" deltaUp accentColor="#4A6331" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Avg Attendance" value="87.4%" delta="+2.1% vs last week" deltaUp accentColor="#B8960C" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="Active Projects" value="38" delta="6 submitted this week" deltaUp accentColor="#3D5A80" /></Grid>
        <Grid item xs={6} md={3}><MetricCard label="At Risk Trainees" value="7" delta="Below 75% attendance" accentColor="#C0392B" /></Grid>
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
              {domainData.map(d => (
                <AnalyticsRow key={d.name} label={d.name} value={d.count} total={31} color={domainColors[d.name] || '#4A6331'} />
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
                <Typography sx={{ fontSize: '0.8rem', color: '#4A6331', cursor: 'pointer', fontWeight: 600 }}>View all →</Typography>
              </Box>
              <Box sx={{ position: 'relative', pl: 3, '&::before': { content: '""', position: 'absolute', left: '4px', top: 8, bottom: 8, width: 2, background: '#D0D9E5' } }}>
                <TimelineItem time="Today, 09:28" title="Project submitted: Edge AI Surveillance System" body="Batch AI/ML — Team of 4 · Score pending review" />
                <TimelineItem time="Today, 08:15" title="Attendance marked — all 6 domains" body="87.4% overall presence today · 18 absent" dotColor="#B8960C" />
                <TimelineItem time="Yesterday, 16:40" title="Announcement posted: Schedule Change" body="Embedded Systems practical moved to Lab 3B" dotColor="#3D5A80" />
                <TimelineItem time="Yesterday, 11:00" title="3 trainees flagged — low attendance" body="Below 75% threshold — warning letters issued" dotColor="#C0392B" />
                <TimelineItem time="10 Jun, 14:30" title="New trainee enrolled: TT24-143" body="Assigned to Cyber Security domain · Batch B" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Pinned Announcements</Typography>
                <Button variant="outlined" size="small">Post New</Button>
              </Box>
              {announcements.map(a => (
                <AnnouncementCard key={a.id} title={a.title} meta={`${a.date} · ${a.priority.charAt(0).toUpperCase() + a.priority.slice(1)} · ${a.audience}`} priority={a.priority} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

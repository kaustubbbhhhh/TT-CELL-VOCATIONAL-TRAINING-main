import React from 'react';
import {
  Box, Typography, Chip, LinearProgress, Avatar,
  Card, CardContent,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// ── Status Chip ──────────────────────────────────────────────
export const StatusChip = ({ status }) => {
  const map = {
    active:      { label: 'Active',      bg: '#EAFAF1', color: '#1D6A42' },
    at_risk:     { label: 'At Risk',     bg: '#FCECEA', color: '#C0392B' },
    inactive:    { label: 'Inactive',    bg: '#EBF0F5', color: '#7A8B99' },
    submitted:   { label: 'Submitted',   bg: '#EEF2E8', color: '#4A6331' },
    in_progress: { label: 'In Progress', bg: '#FAF5DC', color: '#7A6000' },
    planning:    { label: 'Planning',    bg: '#EBF2F9', color: '#3D5A80' },
    completed:   { label: 'Completed',   bg: '#EEF2E8', color: '#4A6331' },
    present:     { label: 'Present',     bg: '#EAFAF1', color: '#1D6A42' },
    absent:      { label: 'Absent',      bg: '#FCECEA', color: '#C0392B' },
    leave:       { label: 'On Leave',    bg: '#FAF5DC', color: '#7A6000' },
    urgent:      { label: 'Urgent',      bg: '#FCECEA', color: '#C0392B' },
    normal:      { label: 'Normal',      bg: '#EEF2E8', color: '#4A6331' },
    notice:      { label: 'Notice',      bg: '#EBF2F9', color: '#3D5A80' },
  };
  const s = map[status] || map.inactive;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{ background: s.bg, color: s.color, fontWeight: 700, fontSize: '0.7rem', height: 22, borderRadius: '20px' }}
    />
  );
};

// ── Domain Chip ──────────────────────────────────────────────
export const DomainChip = ({ domain }) => {
  const map = {
    'AI/ML':     { bg: '#EEF2FF', color: '#4338CA' },
    'Cyber Sec': { bg: '#FCECEA', color: '#C0392B' },
    'Web Dev':   { bg: '#EBF2F9', color: '#3D5A80' },
    'Data Sci':  { bg: '#FAF5DC', color: '#7A6000' },
    'IoT':       { bg: '#EEF2E8', color: '#4A6331' },
    'Embedded':  { bg: '#FFF0F5', color: '#C2185B' },
  };
  const s = map[domain] || { bg: '#EBF0F5', color: '#7A8B99' };
  return (
    <Chip label={domain} size="small"
      sx={{ background: s.bg, color: s.color, fontWeight: 700, fontSize: '0.7rem', height: 22, borderRadius: '20px' }}
    />
  );
};

// ── Priority Chip ─────────────────────────────────────────────
export const PriorityChip = ({ priority }) => <StatusChip status={priority} />;

// ── Metric Card ───────────────────────────────────────────────
export const MetricCard = ({ label, value, sub, delta, deltaUp, accentColor = '#4A6331' }) => (
  <Card sx={{ position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentColor } }}>
    <CardContent sx={{ p: '20px !important' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1, color: '#1A2332' }}>{value}</Typography>
      {sub && <Typography variant="caption" sx={{ mt: 0.75, display: 'block' }}>{sub}</Typography>}
      {delta && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75, px: 1, py: 0.25, borderRadius: '20px', width: 'fit-content', background: deltaUp ? '#EAFAF1' : '#FCECEA' }}>
          {deltaUp ? <TrendingUpIcon sx={{ fontSize: 12, color: '#1D6A42' }} /> : <TrendingDownIcon sx={{ fontSize: 12, color: '#C0392B' }} />}
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: deltaUp ? '#1D6A42' : '#C0392B' }}>{delta}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// ── Section Eyebrow ───────────────────────────────────────────
export const SectionEyebrow = ({ children, light }) => (
  <Typography sx={{
    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1.5px',
    textTransform: 'uppercase', color: light ? '#D4AF37' : '#4A6331', mb: 1.25,
  }}>{children}</Typography>
);

// ── User Avatar ───────────────────────────────────────────────
export const UserAvatar = ({ initials, color = '#4A6331', size = 34 }) => (
  <Avatar sx={{
    width: size, height: size, fontSize: size < 40 ? 12 : 16,
    fontWeight: 800, background: `${color}22`, color,
    border: `1.5px solid ${color}44`,
  }}>{initials}</Avatar>
);

// ── Attendance Bar ─────────────────────────────────────────────
export const AttendanceBar = ({ value }) => {
  const color = value >= 85 ? '#4A6331' : value >= 75 ? '#B8960C' : '#C0392B';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LinearProgress variant="determinate" value={value}
        sx={{ width: 64, height: 6, borderRadius: 10, background: '#EBF0F5', '& .MuiLinearProgress-bar': { background: color, borderRadius: 10 } }}
      />
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color }}>{value}%</Typography>
    </Box>
  );
};

// ── Page Header ───────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A2332', mb: 0.25 }}>{title}</Typography>
      {subtitle && <Typography variant="body2" sx={{ color: '#7A8B99' }}>{subtitle}</Typography>}
    </Box>
    {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>}
  </Box>
);

// ── Breadcrumb ────────────────────────────────────────────────
export const Breadcrumb = ({ items }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Typography sx={{ color: '#B8C5D3', fontSize: '0.8rem' }}>/</Typography>}
        <Typography sx={{ fontSize: '0.8rem', color: i === items.length - 1 ? '#445566' : '#4A6331', cursor: item.onClick ? 'pointer' : 'default', fontWeight: i === items.length - 1 ? 600 : 400, '&:hover': item.onClick ? { textDecoration: 'underline' } : {} }}
          onClick={item.onClick}>{item.label}</Typography>
      </React.Fragment>
    ))}
  </Box>
);

// ── Analytics Row ─────────────────────────────────────────────
export const AnalyticsRow = ({ label, value, total, color = '#4A6331' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
    <Typography sx={{ fontSize: '0.8rem', color: '#445566', minWidth: 88, fontWeight: 500 }}>{label}</Typography>
    <Box sx={{ flex: 1, background: '#EBF0F5', borderRadius: 10, height: 8, overflow: 'hidden' }}>
      <Box sx={{ height: '100%', borderRadius: 10, background: color, width: `${(value / total) * 100}%`, transition: 'width 0.4s' }} />
    </Box>
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A2332', minWidth: 28, textAlign: 'right' }}>{value}</Typography>
  </Box>
);

// ── Bar Chart (CSS) ───────────────────────────────────────────
export const BarChart = ({ data, color = '#4A6331', height = 130 }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height, mb: 0.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', pr: 0.75 }}>
        {['100%', '75%', '50%', '25%'].map(l => (
          <Typography key={l} sx={{ fontSize: '0.65rem', color: '#7A8B99', lineHeight: 1 }}>{l}</Typography>
        ))}
      </Box>
      {data.map((d, i) => (
        <Box key={i} sx={{
          flex: 1, borderRadius: '4px 4px 0 0',
          background: d.highlight ? '#B8960C' : color,
          height: `${d.value}%`, opacity: 0.85,
          transition: 'opacity 0.15s',
          '&:hover': { opacity: 1, background: '#B8960C', cursor: 'pointer' },
        }} title={`${d.label}: ${d.value}%`} />
      ))}
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-around', pl: 3 }}>
      {data.map((d, i) => (
        <Typography key={i} sx={{ fontSize: '0.65rem', color: '#7A8B99' }}>{d.label}</Typography>
      ))}
    </Box>
  </Box>
);

// ── Timeline Item ─────────────────────────────────────────────
export const TimelineItem = ({ time, title, body, dotColor = '#4A6331' }) => (
  <Box sx={{ position: 'relative', pl: 3, mb: 2.25, '&:last-child': { mb: 0 } }}>
    <Box sx={{ position: 'absolute', left: 0, top: 5, width: 10, height: 10, borderRadius: '50%', background: dotColor, border: '2px solid #fff', boxShadow: `0 0 0 1px ${dotColor}` }} />
    <Typography sx={{ fontSize: '0.7rem', color: '#7A8B99', mb: 0.25 }}>{time}</Typography>
    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1A2332', mb: 0.25 }}>{title}</Typography>
    <Typography sx={{ fontSize: '0.775rem', color: '#445566' }}>{body}</Typography>
  </Box>
);

// ── Announcement Card ─────────────────────────────────────────
export const AnnouncementCard = ({ title, meta, body, priority }) => {
  const borderColor = priority === 'urgent' ? '#C0392B' : priority === 'notice' ? '#3D5A80' : '#4A6331';
  const bg = priority === 'urgent' ? '#FFF5F5' : priority === 'notice' ? '#F0F5FF' : '#F5F8F0';
  return (
    <Box sx={{ borderLeft: `3px solid ${borderColor}`, background: bg, borderRadius: '0 8px 8px 0', p: '10px 14px', mb: 1, transition: 'transform 0.12s', '&:hover': { transform: 'translateX(2px)' }, '&:last-child': { mb: 0 } }}>
      <Typography sx={{ fontSize: '0.8375rem', fontWeight: 700, color: '#1A2332', mb: 0.25 }}>{title}</Typography>
      {meta && <Typography sx={{ fontSize: '0.7rem', color: '#7A8B99' }}>{meta}</Typography>}
      {body && <Typography sx={{ fontSize: '0.8125rem', color: '#445566', mt: 1, lineHeight: 1.65 }}>{body}</Typography>}
    </Box>
  );
};

// ── Step Indicator ─────────────────────────────────────────────
export const StepIndicator = ({ steps, current }) => (
  <Box sx={{ display: 'flex', gap: 0, position: 'relative' }}>
    <Box sx={{ position: 'absolute', top: 14, left: '10%', right: '10%', height: '2px', background: '#D0D9E5', zIndex: 0 }} />
    {steps.map((step, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <Box key={i} sx={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 800,
            background: done ? '#4A6331' : active ? '#fff' : '#EBF0F5',
            border: `2px solid ${done ? '#4A6331' : active ? '#4A6331' : '#D0D9E5'}`,
            color: done ? '#fff' : active ? '#4A6331' : '#7A8B99',
          }}>
            {done ? '✓' : i + 1}
          </Box>
          <Typography sx={{ fontSize: '0.65rem', color: done || active ? '#4A6331' : '#7A8B99', fontWeight: done || active ? 700 : 400 }}>{step}</Typography>
        </Box>
      );
    })}
  </Box>
);

// ── Info Row (Profile) ─────────────────────────────────────────
export const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 2, py: 1.25, borderBottom: '1px solid #EBF0F5', '&:last-child': { borderBottom: 'none' } }}>
    <Typography sx={{ fontSize: '0.775rem', fontWeight: 700, color: '#7A8B99', minWidth: 160, flexShrink: 0 }}>{label}</Typography>
    <Typography sx={{ fontSize: '0.8375rem', color: '#1A2332' }}>{value}</Typography>
  </Box>
);

// ── Toggle Row ─────────────────────────────────────────────────
export const ToggleRow = ({ label, sub, enabled = true }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #EBF0F5', '&:last-child': { borderBottom: 'none' } }}>
    <Box>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{label}</Typography>
      {sub && <Typography variant="caption">{sub}</Typography>}
    </Box>
    <Box sx={{ width: 40, height: 22, borderRadius: 11, background: enabled ? '#4A6331' : '#B8C5D3', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
      <Box sx={{ position: 'absolute', top: 3, [enabled ? 'right' : 'left']: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
    </Box>
  </Box>
);

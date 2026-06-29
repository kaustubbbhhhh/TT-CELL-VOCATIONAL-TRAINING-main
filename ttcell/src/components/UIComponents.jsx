import React from 'react';
import {
  Box, Typography, Chip, LinearProgress, Avatar,
  Card, CardContent, Button
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';

// ── Empty State ──────────────────────────────────────────────
export const EmptyState = ({ title, description, actionText, onAction }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', p: 6, textAlign: 'center',
    border: '1px dashed #D6D0C4', borderRadius: 2, background: '#FAF8F3'
  }}>
    <Box sx={{
      width: 48, height: 48, borderRadius: '50%', background: '#F4F2EC',
      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
    }}>
      <AssignmentIcon sx={{ color: '#7D7658' }} />
    </Box>
    <Typography variant="h6" sx={{ color: '#222222', mb: 1 }}>{title}</Typography>
    <Typography variant="body2" sx={{ color: '#444444', mb: 3, maxWidth: 400 }}>{description}</Typography>
    {actionText && onAction && (
      <Button variant="outlined" color="primary" onClick={onAction}>
        {actionText}
      </Button>
    )}
  </Box>
);

// ── Error State ──────────────────────────────────────────────
export const ErrorState = ({ title, message, onRetry }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', p: 4, textAlign: 'center',
    border: '1px solid #FCECEA', borderRadius: 2, background: '#FFF5F5'
  }}>
    <ErrorOutlineIcon sx={{ color: '#9E3A36', fontSize: 40, mb: 1.5 }} />
    <Typography variant="subtitle1" sx={{ color: '#9E3A36', fontWeight: 600, mb: 0.5 }}>{title || 'An Error Occurred'}</Typography>
    <Typography variant="body2" sx={{ color: '#5E1B1B', mb: 2 }}>{message}</Typography>
    {onRetry && (
      <Button variant="contained" color="error" size="small" onClick={onRetry} sx={{ background: '#9E3A36' }}>
        Retry
      </Button>
    )}
  </Box>
);

// ── Status Badge ──────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    active:      { label: 'Active',      bg: '#EEF4EC', color: '#1D401D', border: '#547A43' },
    at_risk:     { label: 'At Risk',     bg: '#FCECEA', color: '#5E1B1B', border: '#9E3A36' },
    inactive:    { label: 'Inactive',    bg: '#EAE6DB', color: '#444444', border: '#D6D0C4' },
    submitted:   { label: 'Submitted',   bg: '#F4F2EC', color: '#222222', border: '#7D7658' },
    in_progress: { label: 'In Progress', bg: '#FAF5DC', color: '#5C4410', border: '#B68A2D' },
    planning:    { label: 'Planning',    bg: '#F4F2EC', color: '#444444', border: '#D6D0C4' },
    completed:   { label: 'Completed',   bg: '#EEF4EC', color: '#1D401D', border: '#547A43' },
    present:     { label: 'Present',     bg: '#EEF4EC', color: '#1D401D', border: '#547A43' },
    absent:      { label: 'Absent',      bg: '#FCECEA', color: '#5E1B1B', border: '#9E3A36' },
    leave:       { label: 'On Leave',    bg: '#FAF5DC', color: '#5C4410', border: '#B68A2D' },
    urgent:      { label: 'Urgent',      bg: '#FCECEA', color: '#5E1B1B', border: '#9E3A36' },
    normal:      { label: 'Normal',      bg: '#EEF4EC', color: '#1D401D', border: '#547A43' },
    notice:      { label: 'Notice',      bg: '#F4F2EC', color: '#222222', border: '#D6D0C4' },
  };
  const s = map[status] || map.inactive;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{ 
        background: s.bg, color: s.color, fontWeight: 600, 
        fontSize: '0.75rem', height: 22, borderRadius: '4px',
        border: `1px solid ${s.border}`
      }}
    />
  );
};

// ── Domain Chip ──────────────────────────────────────────────
export const DomainChip = ({ domain }) => {
  return (
    <Chip label={domain} size="small"
      sx={{ background: '#EAE6DB', color: '#222222', fontWeight: 600, fontSize: '0.75rem', height: 22, borderRadius: '4px', border: '1px solid #D6D0C4' }}
    />
  );
};

export const PriorityChip = ({ priority }) => <StatusBadge status={priority} />;
export const StatusChip = StatusBadge; // alias

// ── Metric Card ───────────────────────────────────────────────
export const MetricCard = ({ label, value, sub, delta, deltaUp, accentColor = '#4B5D3A' }) => (
  <Card sx={{ position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentColor } }}>
    <CardContent sx={{ p: '20px !important' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#444444', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>{label}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1, color: '#222222', fontFamily: '"JetBrains Mono", monospace' }}>{value}</Typography>
      {sub && <Typography variant="caption" sx={{ mt: 0.75, display: 'block' }}>{sub}</Typography>}
      {delta && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, px: 1, py: 0.25, borderRadius: '4px', width: 'fit-content', background: deltaUp ? '#EEF4EC' : '#FCECEA', border: `1px solid ${deltaUp ? '#547A43' : '#9E3A36'}` }}>
          {deltaUp ? <TrendingUpIcon sx={{ fontSize: 14, color: '#547A43' }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: '#9E3A36' }} />}
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: deltaUp ? '#1D401D' : '#5E1B1B' }}>{delta}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// ── Section Eyebrow ───────────────────────────────────────────
export const SectionEyebrow = ({ children, light }) => (
  <Typography sx={{
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px',
    textTransform: 'uppercase', color: light ? '#7D7658' : '#4B5D3A', mb: 1.5,
  }}>{children}</Typography>
);

// ── User Avatar ───────────────────────────────────────────────
export const UserAvatar = ({ initials, color = '#4B5D3A', size = 36 }) => (
  <Avatar sx={{
    width: size, height: size, fontSize: size < 40 ? 12 : 16,
    fontWeight: 600, background: '#EAE6DB', color: color,
    border: `1px solid #D6D0C4`,
  }}>{initials}</Avatar>
);

// ── Attendance Bar ─────────────────────────────────────────────
export const AttendanceBar = ({ value }) => {
  const color = value >= 85 ? '#547A43' : value >= 75 ? '#B68A2D' : '#9E3A36';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LinearProgress variant="determinate" value={value}
        sx={{ width: 64, height: 6, borderRadius: 2, background: '#EAE6DB', '& .MuiLinearProgress-bar': { background: color, borderRadius: 2 } }}
      />
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#222222', fontFamily: '"JetBrains Mono", monospace' }}>{value}%</Typography>
    </Box>
  );
};

// ── Page Header ───────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2, borderBottom: '1px solid #D6D0C4', pb: 2 }}>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#222222', mb: 0.5 }}>{title}</Typography>
      {subtitle && <Typography variant="body2" sx={{ color: '#444444' }}>{subtitle}</Typography>}
    </Box>
    {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>}
  </Box>
);

// ── Breadcrumb ────────────────────────────────────────────────
export const Breadcrumb = ({ items }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Typography sx={{ color: '#D6D0C4', fontSize: '0.875rem' }}>/</Typography>}
        <Typography sx={{ fontSize: '0.875rem', color: i === items.length - 1 ? '#222222' : '#4B5D3A', cursor: item.onClick ? 'pointer' : 'default', fontWeight: i === items.length - 1 ? 600 : 400, '&:hover': item.onClick ? { textDecoration: 'underline' } : {} }}
          onClick={item.onClick}>{item.label}</Typography>
      </React.Fragment>
    ))}
  </Box>
);

// ── Analytics Row ─────────────────────────────────────────────
export const AnalyticsRow = ({ label, value, total, color = '#4B5D3A' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
    <Typography sx={{ fontSize: '0.875rem', color: '#444444', minWidth: 100, fontWeight: 500 }}>{label}</Typography>
    <Box sx={{ flex: 1, background: '#EAE6DB', borderRadius: 2, height: 8, overflow: 'hidden' }}>
      <Box sx={{ height: '100%', borderRadius: 2, background: color, width: `${(value / total) * 100}%`, transition: 'width 0.4s' }} />
    </Box>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#222222', minWidth: 40, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace' }}>{value}</Typography>
  </Box>
);

// ── Bar Chart (CSS) ───────────────────────────────────────────
export const BarChart = ({ data, color = '#4B5D3A', height = 140 }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height, mb: 1, borderBottom: '1px solid #D6D0C4', pb: 0.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', pr: 1 }}>
        {['100%', '75%', '50%', '25%'].map(l => (
          <Typography key={l} sx={{ fontSize: '0.75rem', color: '#444444', lineHeight: 1, fontFamily: '"JetBrains Mono", monospace' }}>{l}</Typography>
        ))}
      </Box>
      {data.map((d, i) => (
        <Box key={i} sx={{
          flex: 1, borderRadius: '4px 4px 0 0',
          background: d.highlight ? '#C17B2E' : color,
          height: `${d.value}%`, opacity: 0.9,
          border: '1px solid rgba(0,0,0,0.1)',
          borderBottom: 'none',
          transition: 'opacity 0.15s',
          '&:hover': { opacity: 1, background: '#B68A2D', cursor: 'pointer' },
        }} title={`${d.label}: ${d.value}%`} />
      ))}
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-around', pl: 4 }}>
      {data.map((d, i) => (
        <Typography key={i} sx={{ fontSize: '0.75rem', color: '#444444', fontWeight: 500 }}>{d.label}</Typography>
      ))}
    </Box>
  </Box>
);

// ── Timeline Item ─────────────────────────────────────────────
export const TimelineItem = ({ time, title, body, dotColor = '#4B5D3A' }) => (
  <Box sx={{ position: 'relative', pl: 3.5, mb: 2.5, '&:last-child': { mb: 0 } }}>
    <Box sx={{ position: 'absolute', left: 0, top: 4, bottom: -24, width: '1px', background: '#D6D0C4', '&:last-child': { display: 'none' } }} />
    <Box sx={{ position: 'absolute', left: -4, top: 5, width: 9, height: 9, borderRadius: '50%', background: dotColor, border: '2px solid #FAF8F3' }} />
    <Typography sx={{ fontSize: '0.75rem', color: '#444444', mb: 0.25, fontFamily: '"JetBrains Mono", monospace' }}>{time}</Typography>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#222222', mb: 0.25 }}>{title}</Typography>
    <Typography sx={{ fontSize: '0.875rem', color: '#444444' }}>{body}</Typography>
  </Box>
);

// ── Announcement Card ─────────────────────────────────────────
export const AnnouncementCard = ({ title, meta, body, priority }) => {
  const borderColor = priority === 'urgent' ? '#9E3A36' : priority === 'notice' ? '#7D7658' : '#4B5D3A';
  const bg = priority === 'urgent' ? '#FFF5F5' : '#F4F2EC';
  return (
    <Box sx={{ borderLeft: `4px solid ${borderColor}`, border: `1px solid #D6D0C4`, borderLeftWidth: 4, background: bg, borderRadius: 1, p: 2, mb: 1.5, transition: 'background 0.15s', '&:hover': { background: '#EAE6DB' }, '&:last-child': { mb: 0 } }}>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#222222', mb: 0.25 }}>{title}</Typography>
      {meta && <Typography sx={{ fontSize: '0.75rem', color: '#444444', fontFamily: '"JetBrains Mono", monospace' }}>{meta}</Typography>}
      {body && <Typography sx={{ fontSize: '0.875rem', color: '#222222', mt: 1, lineHeight: 1.5 }}>{body}</Typography>}
    </Box>
  );
};

// ── Step Indicator ─────────────────────────────────────────────
export const StepIndicator = ({ steps, current }) => (
  <Box sx={{ display: 'flex', gap: 0, position: 'relative' }}>
    <Box sx={{ position: 'absolute', top: 12, left: '10%', right: '10%', height: '1px', background: '#D6D0C4', zIndex: 0 }} />
    {steps.map((step, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <Box key={i} sx={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 24, height: 24, borderRadius: '4px', margin: '0 auto 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace',
            background: done ? '#4B5D3A' : active ? '#FAF8F3' : '#F4F2EC',
            border: `1px solid ${done ? '#4B5D3A' : active ? '#4B5D3A' : '#D6D0C4'}`,
            color: done ? '#FAF8F3' : active ? '#4B5D3A' : '#444444',
          }}>
            {done ? '✓' : i + 1}
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: done || active ? '#222222' : '#444444', fontWeight: done || active ? 600 : 400 }}>{step}</Typography>
        </Box>
      );
    })}
  </Box>
);

// ── Info Row (Profile) ─────────────────────────────────────────
export const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 2, py: 1.5, borderBottom: '1px solid #D6D0C4', '&:last-child': { borderBottom: 'none' } }}>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#444444', minWidth: 160, flexShrink: 0 }}>{label}</Typography>
    <Typography sx={{ fontSize: '0.875rem', color: '#222222' }}>{value}</Typography>
  </Box>
);

// ── Toggle Row ─────────────────────────────────────────────────
export const ToggleRow = ({ label, sub, enabled = true }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #D6D0C4', '&:last-child': { borderBottom: 'none' } }}>
    <Box>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#222222' }}>{label}</Typography>
      {sub && <Typography variant="caption">{sub}</Typography>}
    </Box>
    <Box sx={{ width: 40, height: 20, borderRadius: 10, background: enabled ? '#4B5D3A' : '#D6D0C4', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
      <Box sx={{ position: 'absolute', top: 2, [enabled ? 'right' : 'left']: 2, width: 16, height: 16, borderRadius: '50%', background: '#FAF8F3' }} />
    </Box>
  </Box>
);

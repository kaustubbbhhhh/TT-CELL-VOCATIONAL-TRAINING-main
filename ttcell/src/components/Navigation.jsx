import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Badge, Chip, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CampaignIcon from '@mui/icons-material/Campaign';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/portalApi';

// ── Logo ──────────────────────────────────────────────────────
const Logo = ({ onClick }) => (
  <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer', userSelect: 'none' }}>
    <Box sx={{ width: 32, height: 32, background: '#B8960C', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
        <path d="M6 22V12l8-4.5 8 4.5V22" stroke="#1A2332" strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
        <rect x="11" y="16" width="6" height="6" fill="#1A2332"/>
        <path d="M4 22h20" stroke="#1A2332" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fff', lineHeight: 1.2 }}>
        TT Cell <span style={{ color: '#D4AF37' }}>Portal</span>
      </Typography>
      <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.4px' }}>
        Army Base Workshop
      </Typography>
    </Box>
    <Chip label="GOV" size="small" sx={{ background: '#4A6331', color: '#fff', fontSize: '0.6rem', fontWeight: 800, height: 18, ml: 0.5 }} />
  </Box>
);

// ── Public Top Nav ─────────────────────────────────────────────
export const PublicNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Training Domains', path: '/domains' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 0, px: { xs: 2, md: 3.5 }, minHeight: '58px !important' }}>
        <Logo onClick={() => navigate('/')} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 3, flex: 1 }}>
          {links.map(link => (
            <Button key={link.path} onClick={() => navigate(link.path)}
              sx={{
                color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.72)',
                borderBottom: location.pathname === link.path ? '2px solid #D4AF37' : '2px solid transparent',
                borderRadius: 0, px: 1.75, height: 58, fontWeight: 600, fontSize: '0.8375rem',
                '&:hover': { color: '#fff', background: 'transparent' },
              }}>{link.label}</Button>
          ))}
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/login')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.5)' } }}>
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// ── Admin Sidebar ──────────────────────────────────────────────
const adminNav = [
  { section: 'Overview' },
  { label: 'Executive Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/admin' },
  { section: 'Management' },
  { label: 'Trainees', icon: <PeopleIcon fontSize="small" />, path: '/admin/trainees' },
  { label: 'Projects', icon: <FolderIcon fontSize="small" />, path: '/admin/projects' },
  { label: 'Attendance', icon: <CalendarTodayIcon fontSize="small" />, path: '/admin/attendance' },
  { label: 'Announcements', icon: <CampaignIcon fontSize="small" />, path: '/admin/announcements' },
  { section: 'Intelligence' },
  { label: 'Analytics', icon: <BarChartIcon fontSize="small" />, path: '/admin/analytics' },
  { label: 'Reports', icon: <AssessmentIcon fontSize="small" />, path: '/admin/reports' },
  { label: 'Project Archive', icon: <ArchiveIcon fontSize="small" />, path: '/admin/repository' },
  { section: 'System' },
  { label: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/admin/settings' },
];

const traineeNav = [
  { section: 'My Training' },
  { label: 'My Dashboard', icon: <HomeIcon fontSize="small" />, path: '/trainee' },
  { label: 'My Profile', icon: <PersonIcon fontSize="small" />, path: '/trainee/profile' },
  { label: 'Attendance', icon: <CalendarTodayIcon fontSize="small" />, path: '/trainee/attendance' },
  { label: 'My Projects', icon: <FolderIcon fontSize="small" />, path: '/trainee/projects' },
  { label: 'Announcements', icon: <CampaignIcon fontSize="small" />, path: '/trainee/announcements' },
];

const SidebarContent = ({ navItems, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <Box sx={{ px: 2, py: 1.75, borderBottom: '1px solid #D0D9E5' }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: isAdmin ? '#4A6331' : '#3D5A80', letterSpacing: '0.4px' }}>
          {isAdmin ? 'ADMIN PORTAL' : 'TRAINEE PORTAL'}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#7A8B99' }}>Army Base Workshop · TT Cell</Typography>
      </Box>

      {/* Nav Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <Typography key={i} sx={{ px: 2, pt: 1.75, pb: 0.5, fontSize: '0.625rem', fontWeight: 800, letterSpacing: '1.2px', color: '#7A8B99', textTransform: 'uppercase' }}>
                {item.section}
              </Typography>
            );
          }
          const active = location.pathname === item.path;
          return (
            <List dense disablePadding key={item.path}>
              <ListItem disablePadding>
                <ListItemButton selected={active} onClick={() => navigate(item.path)}
                  sx={{ '&.Mui-selected': { color: '#4A6331', '& .MuiListItemIcon-root': { color: '#4A6331' } } }}>
                  <ListItemIcon sx={{ minWidth: 30, color: active ? '#4A6331' : '#7A8B99' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.8375rem', fontWeight: active ? 700 : 500 }} />
                  {item.badge && (
                    <Chip label={item.badge} size="small" sx={{ background: '#C0392B', color: '#fff', fontSize: '0.6rem', fontWeight: 800, height: 18, ml: 0.5 }} />
                  )}
                </ListItemButton>
              </ListItem>
            </List>
          );
        })}
      </Box>

      <Divider />
      {/* User Card */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ background: isAdmin ? '#EEF2E8' : '#EBF2F9', borderRadius: 2, p: 1.5, mb: 1 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1A2332' }}>{user?.name}</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#7A8B99', mt: 0.25 }}>{user?.title}</Typography>
        </Box>
        <Button fullWidth variant="outlined" size="small" startIcon={<LogoutIcon />} onClick={onLogout}
          sx={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

// ── Portal App Bar ─────────────────────────────────────────────
export const PortalLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  
  const [badgeStats, setBadgeStats] = useState({ trainees: null, announcements: null });

  useEffect(() => {
    async function fetchBadges() {
      try {
        if (isAdmin) {
          const res = await dashboardApi.getStats();
          setBadgeStats({
            trainees: res.data?.total_trainees,
            announcements: res.data?.total_announcements
          });
        } else if (user?.trainee_id) {
          const res = await dashboardApi.getTraineeStats(user.trainee_id);
          setBadgeStats({
            trainees: null,
            announcements: res.data?.total_announcements
          });
        }
      } catch (err) {
        console.error("Failed to fetch badge stats", err);
      }
    }
    if (user) {
      fetchBadges();
    }

    const handleUpdate = () => fetchBadges();
    window.addEventListener('dashboardStatsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('dashboardStatsUpdated', handleUpdate);
    };
  }, [user, isAdmin]);

  const navItems = (isAdmin ? adminNav : traineeNav).map(item => {
    if (item.label === 'Trainees' && badgeStats.trainees > 0) return { ...item, badge: badgeStats.trainees };
    if (item.label === 'Announcements' && badgeStats.announcements > 0) return { ...item, badge: badgeStats.announcements };
    return item;
  });

  const handleLogout = () => { logout(); navigate('/'); };

  const adminLinks = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Trainees', path: '/admin/trainees' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Attendance', path: '/admin/attendance' },
    { label: 'Announcements', path: '/admin/announcements' },
    { label: 'Analytics', path: '/admin/analytics' },
  ];
  const traineeLinks = [
    { label: 'Dashboard', path: '/trainee' },
    { label: 'My Profile', path: '/trainee/profile' },
    { label: 'Attendance', path: '/trainee/attendance' },
    { label: 'Projects', path: '/trainee/projects' },
    { label: 'Announcements', path: '/trainee/announcements' },
  ];
  const topLinks = isAdmin ? adminLinks : traineeLinks;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, md: 3.5 }, minHeight: '58px !important', gap: 0 }}>
          <IconButton color="inherit" sx={{ mr: 1, display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Logo onClick={() => navigate(isAdmin ? '/admin' : '/trainee')} />
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 2, flex: 1 }}>
            {topLinks.map(link => (
              <Button key={link.path} onClick={() => navigate(link.path)}
                sx={{
                  color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.72)',
                  borderBottom: location.pathname === link.path ? '2px solid #D4AF37' : '2px solid transparent',
                  borderRadius: 0, px: 1.75, height: 58, fontWeight: 600, fontSize: '0.8125rem',
                  '&:hover': { color: '#fff', background: 'transparent' },
                }}>{link.label}</Button>
            ))}
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.65)', display: { xs: 'none', sm: 'block' } }}>{user?.name}</Typography>
            <Tooltip title="Sign Out">
              <Button variant="outlined" size="small" onClick={handleLogout}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.75rem', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
                Sign Out
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Desktop Sidebar */}
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: 236, flexShrink: 0, '& .MuiDrawer-paper': { top: 60, height: 'calc(100vh - 60px)', borderTop: 'none' } }}>
          <SidebarContent navItems={navItems} user={user} onLogout={handleLogout} />
        </Drawer>

        {/* Mobile Sidebar */}
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { md: 'none' } }}>
          <SidebarContent navItems={navItems} user={user} onLogout={handleLogout} />
        </Drawer>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3.5 }, overflow: 'auto', minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

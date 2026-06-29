import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Badge, Chip, Tooltip, InputBase
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

import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { dashboardApi, announcementsApi } from '../api/portalApi';

// ── Logo ──────────────────────────────────────────────────────
const Logo = ({ onClick, lightText = false }) => (
  <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', userSelect: 'none' }}>
    <Box sx={{ width: 32, height: 32, background: lightText ? 'rgba(255,255,255,0.1)' : '#4B5D3A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: lightText ? '1px solid rgba(255,255,255,0.2)' : '1px solid #7D7658' }}>
      <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
        <path d="M6 22V12l8-4.5 8 4.5V22" stroke={lightText ? "#FFFFFF" : "#FAF8F3"} strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
        <rect x="11" y="16" width="6" height="6" fill={lightText ? "#FFFFFF" : "#FAF8F3"}/>
        <path d="M4 22h20" stroke={lightText ? "#FFFFFF" : "#FAF8F3"} strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: lightText ? '#FFFFFF' : '#222222', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
        TTC-VTP <span style={{ color: lightText ? 'rgba(255,255,255,0.7)' : '#7D7658', fontWeight: 600 }}>Portal</span>
      </Typography>
      <Typography sx={{ fontSize: '0.65rem', color: lightText ? 'rgba(255,255,255,0.5)' : '#444444', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Operations Command
      </Typography>
    </Box>
    <Chip label="GOV" size="small" sx={{ background: lightText ? 'rgba(255,255,255,0.15)' : '#7D7658', color: lightText ? '#FFFFFF' : '#FAF8F3', fontSize: '0.6rem', fontWeight: 700, height: 18, ml: 1, borderRadius: '4px' }} />
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
    <AppBar position="fixed" elevation={0} sx={{ 
      background: 'rgba(10, 15, 25, 0.65)', 
      backdropFilter: 'blur(16px)', 
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
    }}>
      <Toolbar sx={{ gap: 0, px: { xs: 2, md: 4 }, minHeight: '72px !important' }}>
        <Logo onClick={() => navigate('/')} lightText={true} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 6, flex: 1, gap: 3 }}>
          {links.map(link => (
            <Button key={link.path} onClick={() => navigate(link.path)}
              sx={{
                color: location.pathname === link.path ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                fontWeight: location.pathname === link.path ? 700 : 500, 
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                '&:hover': { color: '#FFFFFF', background: 'transparent' },
                position: 'relative',
                '&::after': location.pathname === link.path ? {
                  content: '""', position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                  width: '20px', height: '2px', background: '#FFFFFF', borderRadius: '2px'
                } : {}
              }}>{link.label}</Button>
          ))}
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
          <Button variant="contained" onClick={() => navigate('/login')}
            sx={{ 
              fontWeight: 600, letterSpacing: '0.5px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: '#FFFFFF', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
            }}>
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// ── Sidebar Nav Configuration ──────────────────────────────────
const adminNav = [
  { section: 'Overview' },
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/admin' },
  { section: 'Monitoring' },
  { label: 'Trainees', icon: <PeopleIcon fontSize="small" />, path: '/admin/trainees' },
  { label: 'Projects', icon: <FolderIcon fontSize="small" />, path: '/admin/projects' },
  { label: 'Attendance', icon: <CalendarTodayIcon fontSize="small" />, path: '/admin/attendance' },
  { section: 'Communications' },
  { label: 'Alerts & Notices', icon: <CampaignIcon fontSize="small" />, path: '/admin/announcements' },
  { section: 'Intelligence' },
  { label: 'Analytics', icon: <BarChartIcon fontSize="small" />, path: '/admin/analytics' },
  { label: 'Reports', icon: <AssessmentIcon fontSize="small" />, path: '/admin/reports' },
  { label: 'System', icon: <SettingsIcon fontSize="small" />, path: '/admin/settings' },
];

const traineeNav = [
  { section: 'Command Centre' },
  { label: 'My Dashboard', icon: <HomeIcon fontSize="small" />, path: '/trainee' },
  { label: 'My Profile', icon: <PersonIcon fontSize="small" />, path: '/trainee/profile' },
  { section: 'Tracking' },
  { label: 'Attendance', icon: <CalendarTodayIcon fontSize="small" />, path: '/trainee/attendance' },
  { label: 'Assigned Projects', icon: <FolderIcon fontSize="small" />, path: '/trainee/projects' },
  { section: 'Communications' },
  { label: 'Notices', icon: <CampaignIcon fontSize="small" />, path: '/trainee/announcements' },
];

const SidebarContent = ({ navItems, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAF8F3' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #D6D0C4', display: 'flex', alignItems: 'center' }}>
        <Logo onClick={() => navigate(isAdmin ? '/admin' : '/trainee')} />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <Typography key={i} sx={{ px: 3, pt: 2, pb: 1, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: '#7D7658', textTransform: 'uppercase' }}>
                {item.section}
              </Typography>
            );
          }
          const active = location.pathname === item.path;
          return (
            <List dense disablePadding key={item.path} sx={{ px: 1.5 }}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton selected={active} onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: '4px',
                    '&.Mui-selected': { background: '#EAE6DB', color: '#4B5D3A', '& .MuiListItemIcon-root': { color: '#4B5D3A' } },
                    '&:hover': { background: active ? '#EAE6DB' : '#F4F2EC' }
                  }}>
                  <ListItemIcon sx={{ minWidth: 32, color: active ? '#4B5D3A' : '#444444' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 700 : 600 }} />
                  {item.badge && (
                    <Chip label={item.badge} size="small" sx={{ background: '#9E3A36', color: '#FAF8F3', fontSize: '0.65rem', fontWeight: 700, height: 20, ml: 1, borderRadius: '4px' }} />
                  )}
                </ListItemButton>
              </ListItem>
            </List>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: '#D6D0C4' }} />
      <Box sx={{ p: 2, background: '#F4F2EC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <AccountCircleIcon sx={{ color: '#7D7658', fontSize: 32 }} />
          <Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#222222' }}>{user?.name || 'Trainee'}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#444444' }}>{isAdmin ? 'Administrator' : 'Student'}</Typography>
          </Box>
        </Box>
        <Button fullWidth variant="outlined" size="small" startIcon={<LogoutIcon />} onClick={onLogout}
          sx={{ fontSize: '0.8125rem', borderColor: '#D6D0C4', color: '#444444', justifyContent: 'center' }}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

// ── Top Command Bar ────────────────────────────────────────────
export const PortalLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const [badgeStats, setBadgeStats] = useState({ trainees: 0, announcements: 0 });

  useEffect(() => {
    const fetchAnnouncementCount = async () => {
      try {
        const res = await announcementsApi.list();
        const list = res.data || [];
        // Count only published (non-draft) announcements
        const publishedCount = list.filter(a => !a.is_draft).length;
        setBadgeStats(prev => ({ ...prev, announcements: publishedCount }));
      } catch (err) {
        console.error('Failed to fetch announcement count:', err);
      }
    };
    fetchAnnouncementCount();

    // Re-fetch when announcements are created/deleted elsewhere
    const handler = () => fetchAnnouncementCount();
    window.addEventListener('dashboardStatsUpdated', handler);
    return () => window.removeEventListener('dashboardStatsUpdated', handler);
  }, []);

  const navItems = (isAdmin ? adminNav : traineeNav).map(item => {
    if ((item.label === 'Alerts & Notices' || item.label === 'Notices') && badgeStats.announcements > 0) return { ...item, badge: badgeStats.announcements };
    return item;
  });

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F4F2EC' }}>
      
      {/* Desktop Sidebar */}
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: 260, flexShrink: 0, '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' } }}>
        <SidebarContent navItems={navItems} user={user} onLogout={handleLogout} />
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: 260 } }}>
        <SidebarContent navItems={navItems} user={user} onLogout={handleLogout} />
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Command Bar */}
        <AppBar position="sticky" elevation={0} sx={{ background: '#FAF8F3', borderBottom: '1px solid #D6D0C4', zIndex: 10 }}>
          <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, md: 4 }, gap: 2 }}>
            <IconButton color="inherit" sx={{ display: { md: 'none' }, color: '#444444' }} onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>

            {/* Global Search */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', background: '#F4F2EC', borderRadius: '4px', px: 2, py: 0.5, border: '1px solid #D6D0C4', flex: 1, maxWidth: 400 }}>
              <SearchIcon sx={{ color: '#7D7658', fontSize: 20, mr: 1 }} />
              <InputBase placeholder="Search trainees, projects, or ID..." sx={{ ml: 1, flex: 1, fontSize: '0.875rem', fontFamily: '"JetBrains Mono", monospace' }} />
              <Typography sx={{ fontSize: '0.7rem', color: '#888888', border: '1px solid #D6D0C4', borderRadius: '4px', px: 0.5 }}>Ctrl+K</Typography>
            </Box>

            <Box sx={{ flex: 1 }} />



          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, overflowX: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

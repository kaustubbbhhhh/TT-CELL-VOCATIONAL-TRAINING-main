import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import { PublicNav } from './components/Navigation';
import HomePage from './pages/public/HomePage';
import { AboutPage, DomainsPage, ContactPage } from './pages/public/OtherPublicPages';
// Auth pages
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from './pages/auth/AuthPages';
// Portal layout
import { PortalLayout } from './components/Navigation';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { TraineesPage, ProjectsPage, AttendancePage, AnnouncementsPage } from './pages/admin/AdminManagement';
import { AnalyticsPage, ReportsPage, RepositoryPage, SettingsPage } from './pages/admin/AdminAnalytics';

// Trainee pages
import {
  TraineeDashboard, TraineeProfile, TraineeAttendance,
  TraineeProjects, TraineeAnnouncements,
} from './pages/trainee/TraineePages';

function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function PublicLayout({ children }) {
  return (
    <>
      <PublicNav />
      {children}
    </>
  );
}

function AdminRoutes() {
  return (
    <RequireRole role="admin">
      <PortalLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="trainees" element={<TraineesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="repository" element={<RepositoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </PortalLayout>
    </RequireRole>
  );
}

function TraineeRoutes() {
  return (
    <RequireRole role="trainee">
      <PortalLayout>
        <Routes>
          <Route index element={<TraineeDashboard />} />
          <Route path="profile" element={<TraineeProfile />} />
          <Route path="attendance" element={<TraineeAttendance />} />
          <Route path="projects" element={<TraineeProjects />} />
          <Route path="announcements" element={<TraineeAnnouncements />} />
        </Routes>
      </PortalLayout>
    </RequireRole>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/domains" element={<PublicLayout><DomainsPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'trainee' ? '/trainee' : '/'} replace /> : <PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
      <Route path="/reset-password" element={<PublicLayout><ResetPasswordPage /></PublicLayout>} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/trainee/*" element={<TraineeRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

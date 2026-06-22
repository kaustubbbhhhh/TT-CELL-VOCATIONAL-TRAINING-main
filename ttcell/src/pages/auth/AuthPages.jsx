import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Alert, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useAuth } from '../../context/AuthContext';

const FormField = ({ label, type = 'text', placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.75, color: '#1A2332' }}>{label}</Typography>
      <Box sx={{ position: 'relative' }}>
        <Box
          component="input"
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          sx={{
            width: '100%', p: '9px 12px', pr: isPassword ? '40px' : '12px', border: '1px solid #B8C5D3',
            borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit',
            outline: 'none', boxSizing: 'border-box', color: '#1A2332',
            '&:focus': { borderColor: '#4A6331', boxShadow: '0 0 0 3px rgba(74,99,49,0.12)' },
          }}
        />
        {isPassword && (
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', padding: '6px' }}
            tabIndex={-1}
          >
            {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" sx={{ color: '#7A8B99' }} /> : <VisibilityOutlinedIcon fontSize="small" sx={{ color: '#7A8B99' }} />}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roleLabels = {
    admin:   'Signing in as: Administrator',
    trainee: 'Signing in as: Trainee',
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setUsername('');
    setPassword('');
  };

  const handleLogin = async () => {
    if (!username || !password) { setError('Please enter your credentials.'); return; }
    setError('');
    try {
      const user = await login(username, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'trainee') navigate('/trainee');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or server connection issue.');
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 58px)', background: '#1A2332', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, border: '80px solid rgba(184,150,12,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
      <Card sx={{ width: 420, position: 'relative', zIndex: 1, boxShadow: '0 32px 80px rgba(0,0,0,0.28)' }}>
        <CardContent sx={{ p: '40px !important' }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box sx={{ width: 64, height: 64, background: '#1A2332', border: '2px solid #B8960C', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
                <path d="M6 22V12l8-4.5 8 4.5V22" stroke="#B8960C" strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
                <rect x="11" y="16" width="6" height="6" fill="#B8960C"/>
                <path d="M4 22h20" stroke="#B8960C" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>TT Cell Portal</Typography>
            <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.5 }}>509 Army Base Workshop — Secure Access</Typography>
          </Box>

          {/* Role Tabs */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
            {[
              { key: 'admin', label: '🛡️ Admin' },
              { key: 'trainee', label: '🎓 Trainee' },
            ].map(r => (
              <Box key={r.key} onClick={() => handleRoleChange(r.key)} sx={{
                p: '12px 8px', border: `1.5px solid ${role === r.key ? '#4A6331' : '#D0D9E5'}`,
                borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
                background: role === r.key ? '#EEF2E8' : 'transparent',
                color: role === r.key ? '#4A6331' : '#445566',
                fontSize: '0.85rem', fontWeight: 700,
                transition: 'all 0.14s',
                '&:hover': { borderColor: '#8FA878', color: '#4A6331' },
              }}>{r.label}</Box>
            ))}
          </Box>

          <Box sx={{ background: '#EEF2E8', border: '1px solid rgba(74,99,49,0.2)', borderRadius: '8px', p: '6px 12px', mb: 2.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4A6331' }}>{roleLabels[role]}</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>{error}</Alert>}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <FormField label="Email / Service ID" placeholder="e.g. admin@ttcell" value={username} onChange={e => setUsername(e.target.value)} />
            <FormField label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#445566', display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <input type="checkbox" defaultChecked /> Remember on this device
              </Typography>
              <Typography onClick={() => navigate('/forgot-password')} sx={{ fontSize: '0.8rem', color: '#4A6331', cursor: 'pointer', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Typography>
            </Box>

            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} startIcon={<LockOutlinedIcon />} sx={{ mb: 2 }}>
              {loading ? 'Signing In...' : 'Sign In Securely'}
            </Button>
          </form>

          <Box sx={{ background: '#EBF0F5', borderRadius: '8px', p: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#7A8B99', lineHeight: 1.6 }}>
              🔒 This portal is restricted to authorised personnel only.<br />
              Unauthorised access is a punishable offence under IT Act 2000.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 58px)', background: '#1A2332', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.28)' }}>
        <CardContent sx={{ p: '40px !important' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: 40, mb: 1.5 }}>🔑</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Reset Password</Typography>
            <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.5 }}>Enter your registered email to receive a reset link.</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>{error}</Alert>}

          {sent ? (
            <Alert severity="success" sx={{ mb: 2 }}>Reset request processed! If the email exists, the reset link has been printed in the backend log for development testing.</Alert>
          ) : (
            <>
              <FormField label="Registered Email" placeholder="e.g. trainee@ttcell" value={email} onChange={e => setEmail(e.target.value)} />
              <Typography variant="caption" sx={{ display: 'block', mb: 2.5 }}>The reset link will be generated and printed to the terminal console / log output.</Typography>
              <Button fullWidth variant="contained" size="large" sx={{ mb: 1.5 }} disabled={loading} onClick={handleSubmit}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </>
          )}

          <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>← Back to Sign In</Button>

          <Typography sx={{ fontSize: '0.75rem', color: '#7A8B99', textAlign: 'center', mt: 2, lineHeight: 1.6 }}>
            If you don't receive the email within 10 minutes, contact the Training Office directly.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) { setError('Invalid token link.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 58px)', background: '#1A2332', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.28)' }}>
        <CardContent sx={{ p: '40px !important' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: 40, mb: 1.5 }}>🛡️</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Choose New Password</Typography>
            <Typography variant="body2" sx={{ color: '#7A8B99', mt: 0.5 }}>Enter a new secure password for your account.</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>{error}</Alert>}
          {!token && <Alert severity="warning" sx={{ mb: 2, fontSize: '0.8rem' }}>Missing reset token in URL parameters.</Alert>}

          {success ? (
            <>
              <Alert severity="success" sx={{ mb: 2.5 }}>Password reset successfully!</Alert>
              <Button fullWidth variant="contained" size="large" onClick={() => navigate('/login')}>Sign In</Button>
            </>
          ) : (
            <>
              <FormField label="New Password" type="password" placeholder="•••••••• (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} />
              <FormField label="Confirm New Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <Button fullWidth variant="contained" size="large" sx={{ mb: 1.5 }} disabled={loading || !token} onClick={handleSubmit}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
              <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>Cancel</Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}


import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Alert, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useAuth } from '../../context/AuthContext';

// Background Line Illustration pattern
const LinePattern = () => (
  <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222222" strokeWidth="1"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <path d="M0 0 L100% 100%" stroke="#222222" strokeWidth="1" strokeDasharray="5,5" />
    <path d="M100% 0 L0 100%" stroke="#222222" strokeWidth="1" strokeDasharray="5,5" />
  </svg>
);

const FormField = ({ label, type = 'text', placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 0.75, color: '#444444' }}>{label}</Typography>
      <Box sx={{ position: 'relative' }}>
        <Box
          component="input"
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          sx={{
            width: '100%', p: '10px 14px', pr: isPassword ? '40px' : '14px', 
            border: '1px solid #D6D0C4',
            borderRadius: '4px', fontSize: '0.875rem', fontFamily: 'inherit',
            outline: 'none', boxSizing: 'border-box', color: '#222222', background: '#FAF8F3',
            transition: 'border-color 0.2s',
            '&:focus': { borderColor: '#4B5D3A', boxShadow: 'inset 0 0 0 1px #4B5D3A' },
            '&::placeholder': { color: '#888888', fontFamily: '"JetBrains Mono", monospace' }
          }}
        />
        {isPassword && (
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', padding: '6px' }}
            tabIndex={-1}
          >
            {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" sx={{ color: '#888888' }} /> : <VisibilityOutlinedIcon fontSize="small" sx={{ color: '#888888' }} />}
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
    <Box sx={{ minHeight: '100vh', background: '#F4F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', p: 2 }}>
      <LinePattern />
      
      <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ width: 48, height: 48, background: '#4B5D3A', border: '1px solid #7D7658', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M6 22V12l8-4.5 8 4.5V22" stroke="#FAF8F3" strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
              <rect x="11" y="16" width="6" height="6" fill="#FAF8F3"/>
              <path d="M4 22h20" stroke="#FAF8F3" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#222222', mb: 0.5, letterSpacing: '-0.5px' }}>TTC–VTP</Typography>
          <Typography variant="body2" sx={{ color: '#444444', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Vocational Training Portal</Typography>
        </Box>

        <Card sx={{ background: '#FAF8F3', borderRadius: '8px', border: '1px solid #D6D0C4', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <CardContent sx={{ p: '32px !important' }}>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {[
                { key: 'admin', label: 'Administrator' },
                { key: 'trainee', label: 'Student / Trainee' },
              ].map(r => (
                <Box key={r.key} onClick={() => handleRoleChange(r.key)} sx={{
                  flex: 1, p: '8px', border: `1px solid ${role === r.key ? '#4B5D3A' : '#D6D0C4'}`,
                  borderRadius: '4px', textAlign: 'center', cursor: 'pointer',
                  background: role === r.key ? '#EEF4EC' : '#F4F2EC',
                  color: role === r.key ? '#1D401D' : '#444444',
                  fontSize: '0.8125rem', fontWeight: 600,
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: '#4B5D3A' },
                }}>{r.label}</Box>
              ))}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, fontSize: '0.875rem' }}>{error}</Alert>}

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <FormField label="Service ID or Email" placeholder={role === 'admin' ? 'admin@ttcell.gov' : 'TN-2026-XXXX'} value={username} onChange={e => setUsername(e.target.value)} />
              <FormField label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1 }}>
                <Typography sx={{ fontSize: '0.8125rem', color: '#444444', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#4B5D3A' }} /> Remember session
                </Typography>
                <Typography onClick={() => navigate('/forgot-password')} sx={{ fontSize: '0.8125rem', color: '#4B5D3A', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                  Recover access
                </Typography>
              </Box>

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} startIcon={<VerifiedUserIcon />} sx={{ mb: 3, py: 1.5 }}>
                {loading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>

            <Box sx={{ borderTop: '1px solid #D6D0C4', pt: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#7D7658', lineHeight: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <LockOutlinedIcon sx={{ fontSize: 14 }} /> Restricted to Authorized Personnel
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            © 2026 Bharat Electronics Limited • Training Division
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ── Forgot Password & Reset Password omit structural changes for brevity 
// but updated to use new color tokens matching the Login
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    setError(''); setLoading(true);
    try {
      await forgotPassword(email); setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending password reset request.');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#F4F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <LinePattern />
      <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <Card sx={{ background: '#FAF8F3', borderRadius: '8px', border: '1px solid #D6D0C4', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <CardContent sx={{ p: '32px !important' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#222222', mb: 1 }}>Recover Access</Typography>
              <Typography variant="body2" sx={{ color: '#444444' }}>Enter your official email to receive a reset link.</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {sent ? (
              <Alert severity="success" sx={{ mb: 3 }}>Reset request processed! If the email exists, the reset link has been dispatched.</Alert>
            ) : (
              <>
                <FormField label="Official Email" placeholder="e.g. user@bel.co.in" value={email} onChange={e => setEmail(e.target.value)} />
                <Button fullWidth variant="contained" size="large" sx={{ mb: 2, mt: 1 }} disabled={loading} onClick={handleSubmit}>
                  {loading ? 'Dispatching...' : 'Dispatch Reset Link'}
                </Button>
              </>
            )}
            <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>Return to Login</Button>
          </CardContent>
        </Card>
      </Box>
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
    setError(''); setLoading(true);
    try {
      await resetPassword(token, password); setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password. Token may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#F4F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <LinePattern />
      <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <Card sx={{ background: '#FAF8F3', borderRadius: '8px', border: '1px solid #D6D0C4', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <CardContent sx={{ p: '32px !important' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#222222', mb: 1 }}>New Credential</Typography>
              <Typography variant="body2" sx={{ color: '#444444' }}>Establish a new secure password.</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {!token && <Alert severity="warning" sx={{ mb: 3 }}>Missing authorization token.</Alert>}

            {success ? (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>Credential established successfully.</Alert>
                <Button fullWidth variant="contained" size="large" onClick={() => navigate('/login')}>Proceed to Login</Button>
              </>
            ) : (
              <>
                <FormField label="New Password" type="password" placeholder="Min 8 chars" value={password} onChange={e => setPassword(e.target.value)} />
                <FormField label="Confirm Password" type="password" placeholder="Match new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <Button fullWidth variant="contained" size="large" sx={{ mb: 2, mt: 1 }} disabled={loading || !token} onClick={handleSubmit}>
                  {loading ? 'Committing...' : 'Commit Credential'}
                </Button>
                <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>Cancel Operation</Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

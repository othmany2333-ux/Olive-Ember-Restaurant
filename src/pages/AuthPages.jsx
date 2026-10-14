import { useState } from 'react';
import { Alert, Box, Button, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useAuth } from '../contexts/AuthContext';

function AuthShell({ title, subtitle, children }) {
  return (
    <section className="auth-page"><Container maxWidth="sm">
      <div className="auth-panel">
        <Typography className="eyebrow" sx={{ textAlign: 'center' }}>WELCOME TO OLIVE & EMBER</Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: '2.25rem', sm: '2.75rem' }, textAlign: 'center', mb: 1 }}>{title}</Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>{subtitle}</Typography>
        {children}
      </div>
    </Container></section>
  );
}

export function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/discover'} replace />;

  function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const loggedIn = login(email, password);
      const desired = location.state?.from;
      navigate(desired || (loggedIn.role === 'admin' ? '/admin' : '/discover'), { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return <AuthShell title="Welcome back." subtitle="Come on in — good food is waiting.">
    <Box component="form" onSubmit={submit}><Stack spacing={2.5}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth autoComplete="email" />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth autoComplete="current-password" />
      <Button type="submit" variant="contained" size="large" fullWidth endIcon={<ArrowForwardRoundedIcon />}>Log in</Button>
      <Typography textAlign="center" color="text.secondary">New here? <Link component={RouterLink} to="/register" color="primary">Create an account</Link></Typography>
    </Stack></Box>
    <div className="demo-hint"><strong>Try the demo accounts</strong><span>Customer: guest@oliveember.test / Guest123!</span><span>Manager: admin@oliveember.test / Admin123!</span></div>
  </AuthShell>;
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/discover'} replace />;

  function submit(event) {
    event.preventDefault();
    setError('');
    if (values.name.trim().length < 2) return setError('Please enter your name.');
    if (values.password.length < 8) return setError('Please use a password with at least 8 characters.');
    if (values.password !== values.confirm) return setError('Those passwords do not match.');
    try {
      register(values);
      navigate('/discover', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }
  const update = (key) => (event) => setValues((old) => ({ ...old, [key]: event.target.value }));
  return <AuthShell title="Join the table." subtitle="Save your details and keep track of your favorites.">
    <Box component="form" onSubmit={submit}><Stack spacing={2.5}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Your name" value={values.name} onChange={update('name')} required fullWidth autoComplete="name" inputProps={{ maxLength: 80 }} />
      <TextField label="Email address" type="email" value={values.email} onChange={update('email')} required fullWidth autoComplete="email" />
      <TextField label="Password (at least 8 characters)" type="password" value={values.password} onChange={update('password')} required fullWidth autoComplete="new-password" />
      <TextField label="Confirm password" type="password" value={values.confirm} onChange={update('confirm')} required fullWidth autoComplete="new-password" />
      <Button type="submit" variant="contained" size="large" fullWidth endIcon={<ArrowForwardRoundedIcon />}>Create account</Button>
      <Typography textAlign="center" color="text.secondary">Already have an account? <Link component={RouterLink} to="/login">Log in</Link></Typography>
    </Stack></Box>
  </AuthShell>;
}

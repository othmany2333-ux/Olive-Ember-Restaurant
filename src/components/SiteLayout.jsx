import { useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Badge, Box, Button, Container, Divider, Drawer, IconButton,
  Link, Snackbar, Alert, Stack, Toolbar, Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';

function Wordmark() {
  return (
    <Link component={RouterLink} to="/" underline="none" color="inherit" className="wordmark" aria-label="Olive and Ember home">
      <span className="wordmark-icon">✳</span>
      <span>olive <em>&</em> ember<span className="wordmark-dot">.</span></span>
    </Link>
  );
}

export default function SiteLayout() {
  const { user, logout } = useAuth();
  const { cartCount, notice, setNotice } = useRestaurant();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    { to: '/', label: 'Home' }, { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'Our story' }, { to: '/contact', label: 'Contact' },
  ];
  if (user?.role === 'admin') links.push({ to: '/admin', label: 'Manager tools' });
  else if (user) links.push({ to: '/discover', label: 'My home' }, { to: '/account', label: 'My account' }, { to: '/messages', label: 'Messages' });

  function signOut() {
    logout();
    setDrawerOpen(false);
    navigate('/');
  }

  const mobileLinks = (
    <Stack spacing={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Explore</Typography>
        <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)}><CloseRoundedIcon /></IconButton>
      </Box>
      {links.map(({ to, label }) => (
        <Button key={to} component={RouterLink} to={to} onClick={() => setDrawerOpen(false)} sx={{ justifyContent: 'start' }}>
          {label}
        </Button>
      ))}
      <Button component={RouterLink} to="/cart" onClick={() => setDrawerOpen(false)} sx={{ justifyContent: 'start' }}>
        My bag ({cartCount})
      </Button>
      <Divider sx={{ my: 1 }} />
      {user ? (
        <Button variant="outlined" onClick={signOut} startIcon={<LogoutRoundedIcon />}>Sign out</Button>
      ) : (
        <Button variant="contained" component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}>Log in</Button>
      )}
    </Stack>
  );

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0} className="site-header">
        <Container maxWidth="lg">
          <Toolbar disableGutters className="header-toolbar">
            <Wordmark />
            <Stack direction="row" spacing={3.5} className="desktop-links">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  {label}
                </NavLink>
              ))}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" className="header-actions">
              <IconButton component={RouterLink} to="/cart" aria-label={`View bag (${cartCount} items)`} sx={{ color: 'primary.main' }}>
                <Badge badgeContent={cartCount} color="secondary"><ShoppingBagOutlinedIcon /></Badge>
              </IconButton>
              {user ? (
                <Button size="small" variant="outlined" color="primary" onClick={signOut} className="desktop-login">Sign out</Button>
              ) : (
                <Button size="small" variant="outlined" component={RouterLink} to="/login" className="desktop-login">Log in</Button>
              )}
              <Button size="small" variant="contained" component={RouterLink} to="/menu" endIcon={<ArrowForwardRoundedIcon />} className="header-order">
                Order now
              </Button>
              <IconButton aria-label="Open navigation" onClick={() => setDrawerOpen(true)} className="mobile-menu-button">
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <main id="main-content"><Outlet /></main>

      <Box component="footer" className="footer">
        <Container maxWidth="lg">
          <div className="footer-grid">
            <div>
              <Wordmark />
              <Typography sx={{ mt: 2, color: '#d0ddd1', maxWidth: 300, lineHeight: 1.8 }}>
                Good food, gathered around good people. Made with care, every single day.
              </Typography>
            </div>
            <div>
              <Typography className="footer-title">Explore</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Link component={RouterLink} to="/menu">Our menu</Link>
                <Link component={RouterLink} to="/about">Our story</Link>
                <Link component={RouterLink} to="/contact">Get in touch</Link>
              </Stack>
            </div>
            <div>
              <Typography className="footer-title">Say hello</Typography>
              <Typography sx={{ mt: 2, color: '#d0ddd1', lineHeight: 1.9 }}>
                18 Olive Lane, Market District<br />
                hello@oliveember.example<br />
                Mon–Sun, 11:00 AM – 10:00 PM
              </Typography>
            </div>
          </div>
          <Divider sx={{ borderColor: '#486253', mt: 6, mb: 2 }} />
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Olive & Ember. A cozy corner of the internet.</span>
            <span>Fresh food. Warm welcome.</span>
          </div>
        </Container>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 290 } }}>
        {mobileLinks}
      </Drawer>
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setNotice('')} sx={{ width: '100%' }}>{notice}</Alert>
      </Snackbar>
    </>
  );
}

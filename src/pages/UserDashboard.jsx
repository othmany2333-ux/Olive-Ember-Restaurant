import { useState } from 'react';
import { Alert, Box, Button, Chip, Container, Divider, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';
import { money, shortDate } from '../utils/format';

export default function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({ name: user.name, email: user.email });
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  function submitProfile(event) {
    event.preventDefault(); setProfileError(''); setProfileSaved(false);
    try { updateProfile(profile); setProfileSaved(true); }
    catch (err) { setProfileError(err.message); }
  }
  const { orders } = useRestaurant();
  const myOrders = orders.filter((order) => order.userId === user.id);
  return (
    <section className="dashboard-page"><Container maxWidth="lg">
      <div className="dashboard-heading"><div><Typography className="eyebrow">YOUR LITTLE CORNER</Typography>
        <Typography variant="h2" className="section-title">Hey, {user.name.split(' ')[0]}!</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Here's what's cooking with your orders.</Typography></div>
        <Button component={RouterLink} to="/menu" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>Order again</Button>
      </div>
      <div className="dashboard-stats customer-stats">
        <div className="stat-card"><span>Total orders</span><strong>{myOrders.length}</strong><small>Thanks for dining with us</small></div>
        <div className="stat-card"><span>In progress</span><strong>{myOrders.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length}</strong><small>Making their way to you</small></div>
        <div className="stat-card"><span>Member since</span><strong className="stat-small">Today & beyond</strong><small>Part of the Olive & Ember family</small></div>
      </div>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Button component={RouterLink} to="/discover" variant="outlined">My home</Button>
        <Button component={RouterLink} to="/messages" variant="outlined">Send feedback / view messages</Button>
      </Box>
      <Box component="form" onSubmit={submitProfile} className="contact-form" sx={{ mb: 5, maxWidth: 600 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Edit profile</Typography>
        <Stack spacing={2}>
          {profileError && <Alert severity="error">{profileError}</Alert>}
          {profileSaved && <Alert severity="success">Profile saved.</Alert>}
          <TextField label="Name" value={profile.name} required inputProps={{ maxLength: 80 }} onChange={(e) => setProfile((old) => ({ ...old, name: e.target.value }))} />
          <TextField label="Email" value={profile.email} type="email" required onChange={(e) => setProfile((old) => ({ ...old, email: e.target.value }))} />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'start' }}>Save my details</Button>
        </Stack>
      </Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Your order history</Typography>
      {myOrders.length ? <Stack spacing={2.5}>{myOrders.map((order) => <Box key={order.id} className="order-card">
        <div className="order-head"><div><Typography fontWeight={800}>Order #{order.id.slice(0, 8).toUpperCase()}</Typography>
          <Typography variant="body2" color="text.secondary">{shortDate(order.createdAt)}</Typography></div>
          <Chip label={order.status} color={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'error' : 'primary'} variant="outlined" size="small" /></div>
        <Divider sx={{ my: 2 }} />
        <Typography color="text.secondary">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(' • ')}</Typography>
        <div className="summary-row" style={{ marginTop: 16 }}><Typography color="text.secondary" variant="body2">Delivering to {order.address}</Typography><strong>{money(order.total)}</strong></div>
      </Box>)}</Stack> : <div className="empty-state"><ReceiptLongOutlinedIcon sx={{ fontSize: 42, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5">No orders yet.</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Your first good meal is only a click away.</Typography>
        <Button component={RouterLink} to="/menu" variant="contained">Browse our menu</Button></div>}
    </Container></section>
  );
}

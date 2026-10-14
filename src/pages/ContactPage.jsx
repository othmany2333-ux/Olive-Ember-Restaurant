import { useState } from 'react';
import { Box, Button, Container, Stack, TextField, Typography, Alert } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';

export default function ContactPage() {
  const { user } = useAuth();
  const { sendMessage } = useRestaurant();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  function submitMessage(event) {
    event.preventDefault(); setError(''); setSent(false);
    const data = new FormData(event.currentTarget);
    try {
      sendMessage({ user, type: 'message', name: String(data.get('name')), email: String(data.get('email')), content: String(data.get('message')) });
      event.currentTarget.reset(); setSent(true);
    } catch (err) { setError(err.message); }
  }
  return <>
    <section className="page-intro"><Container maxWidth="md" sx={{ textAlign: 'center' }}>
      <Typography className="eyebrow">LET'S TALK</Typography><Typography variant="h1" className="page-title">We'd love to hear from you.</Typography>
      <Typography className="intro-text">Questions about the menu? Something you'd like to share? Drop us a note.</Typography>
    </Container></section>
    <section className="section-pad"><Container maxWidth="lg"><div className="contact-grid">
      <div><Typography className="eyebrow">COME SAY HELLO</Typography>
        <Typography variant="h2" className="section-title">There's always a seat at our table.</Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 4, lineHeight: 1.9 }}>Whether you're planning lunch or just feeling curious, we'd be happy to chat.</Typography>
        <Stack spacing={3}>
          <div className="contact-detail"><LocationOnOutlinedIcon /><div><strong>Find us</strong><span>18 Olive Lane, Market District</span></div></div>
          <div className="contact-detail"><AccessTimeRoundedIcon /><div><strong>Opening hours</strong><span>Every day, 11:00 AM – 10:00 PM</span></div></div>
          <div className="contact-detail"><EmailOutlinedIcon /><div><strong>Drop a line</strong><span>hello@oliveember.example</span></div></div>
        </Stack>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 4 }}>Contact details are fictional. Messages are stored in this browser and can be read in the manager dashboard; no email is sent.</Typography>
      </div>
      <Box component="form" onSubmit={submitMessage} className="contact-form">
        <Typography variant="h5" sx={{ mb: 1 }}>Send us a message</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Our demo manager can review your note in their dashboard.</Typography>
        {sent && <Alert severity="success" sx={{ mb: 2 }}>Message saved in the manager inbox.</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2.5}>
          <TextField label="Your name" name="name" fullWidth required defaultValue={user?.name || ''} inputProps={{ maxLength: 80 }} />
          <TextField label="Email address" name="email" type="email" fullWidth required defaultValue={user?.email || ''} />
          <TextField label="Your message" name="message" multiline rows={5} fullWidth required inputProps={{ minLength: 10, maxLength: 1000 }} />
          <Button type="submit" variant="contained" size="large" endIcon={<SendRoundedIcon />}>Send message</Button>
        </Stack>
      </Box>
    </div></Container></section>
  </>;
}

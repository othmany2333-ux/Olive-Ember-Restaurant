import { useState } from 'react';
import { Alert, Box, Button, Container, MenuItem, Stack, TextField, Typography, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';
import { shortDate } from '../utils/format';

export default function MessagesPage() {
  const { user } = useAuth();
  const { messages, sendMessage } = useRestaurant();
  const [form, setForm] = useState({ type: 'review', content: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const mine = messages.filter((message) => message.userId === user.id);
  function submit(event) {
    event.preventDefault();
    setError(''); setSent(false);
    try {
      sendMessage({ user, name: user.name, email: user.email, ...form });
      setForm((old) => ({ ...old, content: '' }));
      setSent(true);
    } catch (err) { setError(err.message); }
  }
  return <section className="dashboard-page"><Container maxWidth="md">
    <Typography className="eyebrow">YOUR VOICE MATTERS</Typography>
    <Typography variant="h2" className="section-title" sx={{ mb: 2 }}>Talk to our team.</Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>Ask a question privately, or leave a review for our public guestbook. Reviews are published only after manager approval.</Typography>
    <Box className="contact-form" component="form" onSubmit={submit} sx={{ mb: 5 }}>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {sent && <Alert severity="success">Thanks — we've received your note.</Alert>}
        <TextField select label="Kind of message" value={form.type} onChange={(e) => setForm((old) => ({ ...old, type: e.target.value }))}>
          <MenuItem value="review">Public review (requires approval)</MenuItem><MenuItem value="message">Private message to manager</MenuItem>
        </TextField>
        <TextField label="Your message" multiline rows={5} required value={form.content} inputProps={{ maxLength: 1000 }} helperText="At least 10 characters" onChange={(e) => setForm((old) => ({ ...old, content: e.target.value }))} />
        <Button type="submit" variant="contained">Send to the restaurant</Button>
      </Stack>
    </Box>
    <Typography variant="h5" sx={{ mb: 2 }}>Your messages</Typography>
    {mine.length ? <Stack spacing={2}>{mine.map((message) => <Box key={message.id} className="order-card">
      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
        <Typography fontWeight={700}>{message.type === 'review' ? 'Review' : 'Private message'}</Typography>
        <Chip size="small" label={message.type === 'review' ? message.status : message.status === 'Pending' ? 'Received' : 'Read'} color={message.status === 'Approved' ? 'success' : 'default'} />
      </Stack>
      <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{message.content}</Typography>
      <Typography variant="caption" color="text.secondary">{shortDate(message.createdAt)}</Typography>
    </Box>)}</Stack> : <Typography color="text.secondary">No messages yet.</Typography>}
  </Container></section>;
}

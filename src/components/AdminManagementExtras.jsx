import { useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  LinearProgress, MenuItem, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';
import { categoryCount, summarizeOrders, orderStatuses } from '../utils/management';
import { money, shortDate } from '../utils/format';

export function MessagesManagement() {
  const { messages, setMessageStatus } = useRestaurant();
  const [active, setActive] = useState(null);
  const pending = messages.filter((message) => message.status === 'Pending').length;
  return <Box sx={{ py: 3 }}>
    <Typography variant="h5" sx={{ mb: 1 }}>Guest messages and reviews</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>{pending} item(s) awaiting attention. Only approved reviews appear on the public homepage; private messages are never published.</Typography>
    {messages.length ? <Stack spacing={2}>{messages.map((item) => <Box key={item.id} className="order-card">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
        <Box><Typography fontWeight={700}>{item.name} · {item.type === 'review' ? 'Guest review' : 'Private message'}</Typography>
          <Typography variant="caption" color="text.secondary">{item.email} · {shortDate(item.createdAt)}</Typography>
        </Box><Chip size="small" label={item.status} color={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'error' : 'default'} />
      </Stack>
      <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', my: 2 }}>{item.content}</Typography>
      {item.type === 'review' ? <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button variant="outlined" color="success" onClick={() => setMessageStatus(item.id, 'Approved')}>Approve review</Button>
        <Button color="error" onClick={() => setActive(item)}>Reject review</Button>
      </Stack> : <Button variant="outlined" onClick={() => setMessageStatus(item.id, 'Approved')} disabled={item.status === 'Approved'}>Mark as read</Button>}
    </Box>)}</Stack> : <div className="empty-state">No guest messages yet. Send one through the Contact page to test this feature.</div>}
    <Dialog open={Boolean(active)} onClose={() => setActive(null)}><DialogTitle>Reject this review?</DialogTitle>
      <DialogContent><Typography>The review will remain visible to its author but will not appear publicly.</Typography></DialogContent>
      <DialogActions><Button onClick={() => setActive(null)}>Cancel</Button><Button color="error" variant="contained" onClick={() => { if (active) setMessageStatus(active.id, 'Rejected'); setActive(null); }}>Reject</Button></DialogActions>
    </Dialog>
  </Box>;
}

export function UsersManagement() {
  const { user, accounts, changeRole } = useAuth();
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  function change() {
    try { changeRole(confirm.id, confirm.role); setError(''); }
    catch (err) { setError(err.message); }
    setConfirm(null);
  }
  return <Box sx={{ py: 3 }}>
    <Typography variant="h5" sx={{ mb: 1 }}>User accounts</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Review registered users and update roles. Your own role cannot be changed here, and at least one manager must remain.</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <TableContainer className="data-table-wrap"><Table sx={{ minWidth: 540 }}><TableHead><TableRow>
      <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Actions</TableCell>
    </TableRow></TableHead><TableBody>{accounts.map((person) => <TableRow key={person.id}>
      <TableCell>{person.name}</TableCell><TableCell>{person.email}</TableCell><TableCell><Chip label={person.role} size="small" /></TableCell>
      <TableCell><Button disabled={person.id === user.id} size="small" variant="outlined" onClick={() => setConfirm({ id: person.id, name: person.name, role: person.role === 'admin' ? 'user' : 'admin' })}>Change role</Button></TableCell>
    </TableRow>)}</TableBody></Table></TableContainer>
    <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)}><DialogTitle>Change account role?</DialogTitle>
      <DialogContent><Typography>Assign <strong>{confirm?.name}</strong> the <strong>{confirm?.role}</strong> role? This affects access when they next navigate.</Typography></DialogContent>
      <DialogActions><Button onClick={() => setConfirm(null)}>Cancel</Button><Button onClick={change} variant="contained">Confirm change</Button></DialogActions>
    </Dialog>
  </Box>;
}

export function CategoriesManagement() {
  const { menu, categories, addCategory, deleteCategory } = useRestaurant();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState('');
  function add(event) {
    event.preventDefault();
    try { addCategory(name); setName(''); setError(''); }
    catch (err) { setError(err.message); }
  }
  function remove() {
    try { deleteCategory(confirm); setError(''); }
    catch (err) { setError(err.message); }
    setConfirm('');
  }
  return <Box sx={{ py: 3 }}>
    <Typography variant="h5" sx={{ mb: 2 }}>Food categories</Typography>
    <Typography color="text.secondary" sx={{ mb: 2 }}>Categories help guests filter dishes. A category containing dishes cannot be removed.</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Box component="form" onSubmit={add} sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
      <TextField size="small" label="New category" value={name} inputProps={{ maxLength: 40 }} onChange={(e) => setName(e.target.value)} required />
      <Button type="submit" variant="contained">Add category</Button>
    </Box>
    <Stack spacing={1.5}>{categories.map((category) => <Box key={category} className="order-card" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box><Typography fontWeight={700}>{category}</Typography><Typography color="text.secondary" variant="caption">{categoryCount(menu, category)} dish(es)</Typography></Box>
      <Button color="error" disabled={categoryCount(menu, category) > 0} onClick={() => setConfirm(category)}>Remove</Button>
    </Box>)}</Stack>
    <Dialog open={Boolean(confirm)} onClose={() => setConfirm('')}><DialogTitle>Remove category?</DialogTitle>
      <DialogContent><Typography>Remove the unused category <strong>{confirm}</strong>?</Typography></DialogContent>
      <DialogActions><Button onClick={() => setConfirm('')}>Cancel</Button><Button variant="contained" color="error" onClick={remove}>Remove</Button></DialogActions>
    </Dialog>
  </Box>;
}

function ComparisonBar({ title, subtitle, value, max }) {
  const percent = max ? Math.min(100, (value / max) * 100) : 0;
  return <Box sx={{ my: 2.2 }}>
    <Stack direction="row" justifyContent="space-between" gap={1}><Typography fontWeight={600}>{title}</Typography><Typography fontWeight={700}>{value}</Typography></Stack>
    {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    <LinearProgress variant="determinate" value={percent} sx={{ height: 11, borderRadius: 2, mt: 1, bgcolor: '#e6ece5' }} />
  </Box>;
}

export function ReportsManagement() {
  const { menu, categories, orders, messages } = useRestaurant();
  const summary = summarizeOrders(orders);
  const largest = Math.max(1, ...categories.map((category) => categoryCount(menu, category)));
  const peakStatus = Math.max(1, ...orderStatuses.map((status) => orders.filter((order) => order.status === status).length));
  return <Box sx={{ py: 3 }}>
    <Typography variant="h5" sx={{ mb: 1 }}>Restaurant snapshot</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Live charts use the demo data saved in this browser. These figures are illustrative rather than actual commercial sales.</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
      <Box className="stat-card"><span>Orders</span><strong>{summary.total}</strong><small>{summary.delivered} delivered</small></Box>
      <Box className="stat-card"><span>Average non-cancelled order</span><strong>{money(summary.average)}</strong><small>Sample checkout data</small></Box>
      <Box className="stat-card"><span>Non-cancelled order value</span><strong>{money(summary.orderValue)}</strong></Box>
      <Box className="stat-card"><span>Reviews awaiting approval</span><strong>{messages.filter((entry) => entry.type === 'review' && entry.status === 'Pending').length}</strong></Box>
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
      <Box><Typography variant="h6">Dishes by category</Typography>
        {categories.map((category) => <ComparisonBar key={category} title={category} value={categoryCount(menu, category)} max={largest} />)}
      </Box>
      <Box><Typography variant="h6">Orders by status</Typography>
        {orderStatuses.map((status) => <ComparisonBar key={status} title={status} value={orders.filter((order) => order.status === status).length} max={peakStatus} />)}
      </Box>
    </Box>
  </Box>;
}

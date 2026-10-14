import { useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Container, Dialog, DialogActions, DialogContent, Drawer,
  DialogTitle, Divider, FormControlLabel, IconButton, MenuItem, Stack, Tab, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import DishArtwork from '../components/DishArtwork';
import { artworkOptions } from '../data/menu';
import { MessagesManagement, UsersManagement, CategoriesManagement, ReportsManagement } from '../components/AdminManagementExtras';
import { summarizeOrders } from '../utils/management';
import { useRestaurant } from '../contexts/RestaurantContext';
import { money, shortDate } from '../utils/format';

const orderStatuses = ['Received', 'Preparing', 'On the way', 'Delivered', 'Cancelled'];
const emptyDish = { name: '', category: 'Pizza', description: '', price: '', art: 'pizza', popular: false, available: true };

export default function AdminDashboard() {
  const { menu, orders, categories, saveDish, deleteDish, setOrderStatus } = useRestaurant();
  const [tab, setTab] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyDish);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const { orderValue: sales, pending } = summarizeOrders(orders);

  function openDish(dish) {
    setEditing(dish?.id || 'new');
    setForm(dish ? { ...dish, price: String(dish.price) } : { ...emptyDish, category: categories[0] || '' });
    setFormError('');
  }
  function save(event) {
    event.preventDefault();
    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    if (!name || !description || !Number.isFinite(price) || price <= 0) {
      setFormError('Please add a name, description, and a price greater than zero.');
      return;
    }
    try {
      saveDish({ ...form, name, description, price });
      setEditing(null);
    } catch (error) {
      setFormError(error.message);
    }
  }
  const updateForm = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }));

  return (
    <section className="dashboard-page"><Container maxWidth="lg">
      <div className="dashboard-heading"><div>
        <Typography className="eyebrow">BEHIND THE COUNTER</Typography>
        <Typography variant="h2" className="section-title">Restaurant dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Keep the good stuff running smoothly.</Typography>
      </div><Stack direction="row" spacing={1} flexWrap="wrap">
        <Button variant="outlined" startIcon={<MenuRoundedIcon />} onClick={() => setToolsOpen(true)}>Tools menu</Button>
        <Button variant="contained" onClick={() => { openDish(null); setTab(1); }} startIcon={<AddRoundedIcon />}>Add a dish</Button>
      </Stack></div>

      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-icon"><Inventory2OutlinedIcon /></div><span>Menu items</span><strong>{menu.length}</strong><small>{menu.filter((dish) => dish.available).length} available</small></div>
        <div className="stat-card"><div className="stat-icon"><ShoppingBagOutlinedIcon /></div><span>Total orders</span><strong>{orders.length}</strong><small>{pending} waiting for attention</small></div>
        <div className="stat-card"><div className="stat-icon"><PaidOutlinedIcon /></div><span>Order value</span><strong>{money(sales)}</strong><small>Excludes cancelled orders</small></div>
      </div>

      <Drawer anchor="left" open={toolsOpen} onClose={() => setToolsOpen(false)} PaperProps={{ sx: { width: 280, p: 2 } }}>
        <Typography variant="h6" sx={{ p: 2 }}>Manager navigation</Typography>
        {['Overview', 'Menu management', 'Orders', 'Messages and reviews', 'Users', 'Categories', 'Charts and reports'].map((label, index) =>
          <Button key={label} variant={tab === index ? 'contained' : 'text'} sx={{ my: 0.5, justifyContent: 'flex-start' }}
            onClick={() => { setTab(index); setToolsOpen(false); }}>{label}</Button>)}
      </Drawer>
      <Box className="admin-content">
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: '1px solid #e7e8e2' }}>
          <Tab label="Overview" /><Tab label={`Menu (${menu.length})`} /><Tab label={`Orders (${orders.length})`} />
          <Tab label="Messages & reviews" /><Tab label="Users" /><Tab label="Categories" /><Tab label="Charts & reports" />
        </Tabs>

        {tab === 0 && <Box sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>A quick look at today</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Your menu and incoming orders are all in one place.</Typography>
          <div className="quick-actions">
            <Button variant="outlined" onClick={() => setTab(1)} startIcon={<Inventory2OutlinedIcon />}>Manage menu</Button>
            <Button variant="outlined" onClick={() => setTab(2)} startIcon={<ShoppingBagOutlinedIcon />}>Check orders {pending > 0 ? `(${pending} active)` : ''}</Button>
          </div>
          <Box className="overview-note"><Typography variant="h6">A small tip from the kitchen</Typography>
            <Typography color="text.secondary">Mark dishes unavailable if you run out of an ingredient. Customers will still see them, but won't be able to add them to their bags.</Typography></Box>
        </Box>}

        {tab === 1 && <Box sx={{ py: 3 }}>
          <div className="table-heading"><div><Typography variant="h5">Your menu</Typography><Typography color="text.secondary">Add, update, or remove dishes whenever you like.</Typography></div>
            <Button variant="contained" onClick={() => openDish(null)} startIcon={<AddRoundedIcon />}>New dish</Button></div>
          <TableContainer className="data-table-wrap"><Table sx={{ minWidth: 650 }} aria-label="Manage menu items">
            <TableHead><TableRow><TableCell>Dish</TableCell><TableCell>Category</TableCell><TableCell>Price</TableCell><TableCell>Availability</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
            <TableBody>{menu.map((dish) => <TableRow key={dish.id} hover>
              <TableCell><div className="table-dish"><DishArtwork type={dish.art} name={dish.name} /><span>{dish.name}</span></div></TableCell>
              <TableCell>{dish.category}</TableCell><TableCell>{money(dish.price)}</TableCell>
              <TableCell><Chip label={dish.available ? 'Available' : 'Unavailable'} size="small" variant="outlined" color={dish.available ? 'success' : 'default'} /></TableCell>
              <TableCell align="right"><IconButton title="Edit dish" aria-label={`Edit ${dish.name}`} onClick={() => openDish(dish)}><EditOutlinedIcon /></IconButton>
                <IconButton title="Delete dish" aria-label={`Delete ${dish.name}`} color="error" onClick={() => setDeleteTarget(dish)}><DeleteOutlineRoundedIcon /></IconButton></TableCell>
            </TableRow>)}</TableBody>
          </Table></TableContainer>
          {!menu.length && <div className="empty-state">Your menu is empty. Add your first dish!</div>}
        </Box>}

        {tab === 2 && <Box sx={{ py: 3 }}>
          <div className="table-heading"><div><Typography variant="h5">Incoming orders</Typography><Typography color="text.secondary">Update each order as it moves through the kitchen.</Typography></div></div>
          {orders.length ? <TableContainer className="data-table-wrap"><Table sx={{ minWidth: 840 }} aria-label="Incoming orders">
            <TableHead><TableRow><TableCell>Order</TableCell><TableCell>Customer</TableCell><TableCell>Items</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
            <TableBody>{orders.map((order) => <TableRow hover key={order.id}>
              <TableCell><Typography fontWeight={700}>#{order.id.slice(0, 8).toUpperCase()}</Typography><Typography variant="caption" color="text.secondary">{shortDate(order.createdAt)}</Typography></TableCell>
              <TableCell><Typography fontWeight={600}>{order.customer}</Typography><Typography variant="caption" display="block">{order.phone}</Typography><Typography variant="caption" display="block" color="text.secondary">{order.address}</Typography></TableCell>
              <TableCell>{order.items.map((item) => <Typography key={item.id} variant="body2">{item.quantity}× {item.name}</Typography>)}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{money(order.total)}</TableCell>
              <TableCell><TextField select value={order.status} size="small" aria-label={`Status for order ${order.id.slice(0, 8)}`} onChange={(e) => setOrderStatus(order.id, e.target.value)} sx={{ minWidth: 145 }}>
                {orderStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </TextField></TableCell>
            </TableRow>)}</TableBody>
          </Table></TableContainer> : <div className="empty-state"><ShoppingBagOutlinedIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">No orders just yet.</Typography><Typography color="text.secondary">New customer orders will appear here automatically in this browser.</Typography></div>}
        </Box>}
        {tab === 3 && <MessagesManagement />}
        {tab === 4 && <UsersManagement />}
        {tab === 5 && <CategoriesManagement />}
        {tab === 6 && <ReportsManagement />}
      </Box>

      <Dialog open={Boolean(editing)} fullWidth maxWidth="sm" onClose={() => setEditing(null)}>
        <Box component="form" onSubmit={save}>
          <DialogTitle>{editing === 'new' ? 'Add a new dish' : 'Edit this dish'}</DialogTitle>
          <DialogContent><Stack spacing={2.5} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField label="Dish name" required fullWidth value={form.name} onChange={updateForm('name')} inputProps={{ maxLength: 90 }} />
            <TextField label="Description" required fullWidth multiline rows={2} value={form.description} onChange={updateForm('description')} inputProps={{ maxLength: 260 }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Category" fullWidth value={form.category} onChange={updateForm('category')}>
                {categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
              <TextField type="number" label="Price ($)" fullWidth required value={form.price} onChange={updateForm('price')} inputProps={{ min: 0.01, max: 999, step: 0.01 }} />
            </Stack>
            <TextField select label="Dish illustration" fullWidth value={form.art} onChange={updateForm('art')}>
              {artworkOptions.map((key) => <MenuItem key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</MenuItem>)}
            </TextField>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControlLabel control={<Checkbox checked={Boolean(form.available)} onChange={(e) => setForm((old) => ({ ...old, available: e.target.checked }))} />} label="Available to order" />
              <FormControlLabel control={<Checkbox checked={Boolean(form.popular)} onChange={(e) => setForm((old) => ({ ...old, popular: e.target.checked }))} />} label="House favorite" />
            </Stack>
          </Stack></DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="contained" type="submit">Save dish</Button></DialogActions>
        </Box>
      </Dialog>
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove this dish?</DialogTitle>
        <DialogContent><Typography>You're about to remove <strong>{deleteTarget?.name}</strong> from the menu. This can't be undone.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setDeleteTarget(null)}>Keep it</Button>
          <Button color="error" variant="contained" onClick={() => { if (deleteTarget) deleteDish(deleteTarget.id); setDeleteTarget(null); }}>Delete dish</Button></DialogActions>
      </Dialog>
    </Container></section>
  );
}

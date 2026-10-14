import { useState } from 'react';
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DishArtwork from '../components/DishArtwork';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';
import { money } from '../utils/format';

export default function CartPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, changeQuantity, removeFromCart, placeOrder } = useRestaurant();
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ customer: '', phone: '', address: '', notes: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function openCheckout() {
    if (!user) return navigate('/login', { state: { from: '/cart' } });
    setForm({ customer: user.name, phone: '', address: '', notes: '' });
    setError('');
    setCheckout(true);
  }
  function submitOrder(event) {
    event.preventDefault();
    try {
      placeOrder({ user, ...form });
      setCheckout(false);
      navigate(user.role === 'admin' ? '/admin' : '/account');
    } catch (err) { setError(err.message); }
  }
  return (
    <>
      <section className="page-intro compact"><Container maxWidth="lg">
        <Typography className="eyebrow">JUST ONE MORE THING</Typography>
        <Typography variant="h1" className="page-title">Your bag.</Typography>
      </Container></section>
      <section className="section-pad"><Container maxWidth="lg">
        {cartItems.length === 0 ? <div className="empty-cart">
          <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4">Your bag is waiting.</Typography>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>Something delicious belongs here, don't you think?</Typography>
          <Button component={RouterLink} to="/menu" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>Browse the menu</Button>
        </div> : <div className="cart-grid">
          <div><Typography variant="h5" sx={{ mb: 3 }}>Your picks ({cartItems.length})</Typography>
            <Stack spacing={2}>
              {cartItems.map((item) => <div key={item.id} className="cart-item">
                <DishArtwork type={item.art} name={item.name} className="cart-item-art" />
                <div className="cart-item-info"><Typography variant="h6">{item.name}</Typography><Typography color="text.secondary">{money(item.price)} each</Typography>
                  <div className="quantity-control"><IconButton size="small" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item.id, -1)}><RemoveRoundedIcon fontSize="small" /></IconButton><span>{item.quantity}</span><IconButton size="small" aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item.id, 1)}><AddRoundedIcon fontSize="small" /></IconButton></div>
                </div>
                <div className="cart-item-end"><Typography fontWeight="bold">{money(item.price * item.quantity)}</Typography>
                  <IconButton aria-label={`Remove ${item.name} from bag`} size="small" onClick={() => removeFromCart(item.id)}><DeleteOutlineRoundedIcon /></IconButton></div>
              </div>)}
            </Stack>
          </div>
          <aside className="order-summary"><Typography variant="h5" sx={{ mb: 3 }}>Order summary</Typography>
            <Stack spacing={2}><div className="summary-row"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><div className="summary-row"><span>Delivery</span><span>Free for this demo</span></div></Stack>
            <Divider sx={{ my: 3 }} /><div className="summary-row grand"><span>Total</span><strong>{money(cartTotal)}</strong></div>
            <Button fullWidth variant="contained" size="large" onClick={openCheckout} sx={{ mt: 3 }} endIcon={<ArrowForwardRoundedIcon />}>Continue to checkout</Button>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 2 }}>Demo checkout — no payment is collected.</Typography>
          </aside>
        </div>}
      </Container></section>
      <Dialog open={checkout} onClose={() => setCheckout(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitOrder}>
          <DialogTitle>Almost there!</DialogTitle>
          <DialogContent><Typography color="text.secondary" sx={{ mb: 3 }}>Where should we bring your delicious order?</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Stack spacing={2.5}>
              <TextField label="Full name" required fullWidth value={form.customer} onChange={(e) => setForm((old) => ({ ...old, customer: e.target.value }))} />
              <TextField label="Phone number" required fullWidth value={form.phone} onChange={(e) => setForm((old) => ({ ...old, phone: e.target.value }))} inputProps={{ minLength: 6, maxLength: 22 }} />
              <TextField label="Delivery address" required fullWidth value={form.address} onChange={(e) => setForm((old) => ({ ...old, address: e.target.value }))} inputProps={{ maxLength: 250 }} />
              <TextField label="Any special requests?" fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm((old) => ({ ...old, notes: e.target.value }))} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setCheckout(false)}>Cancel</Button><Button type="submit" variant="contained">Place order · {money(cartTotal)}</Button></DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

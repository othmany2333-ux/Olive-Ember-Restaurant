import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DishCard from '../components/DishCard';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';

// Home after sign-in is separate from the public landing page.
export default function DiscoverPage() {
  const { user } = useAuth();
  const { menu, orders } = useRestaurant();
  const myOrders = orders.filter((order) => order.userId === user.id);
  const selection = menu.filter((dish) => dish.available && dish.popular).slice(0, 4);
  return <Box className="dashboard-page"><Container maxWidth="lg">
    <Typography className="eyebrow">YOUR HOME</Typography>
    <Typography variant="h2" className="section-title" sx={{ mb: 1 }}>Good to see you, {user.name.split(' ')[0]}.</Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>Something delicious is always close by. Here's a little inspiration for your next order.</Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
      <Button component={RouterLink} to="/menu" variant="contained">Explore the menu</Button>
      <Button component={RouterLink} to="/account" variant="outlined">My orders ({myOrders.length})</Button>
      <Button component={RouterLink} to="/messages" variant="outlined">Share feedback</Button>
    </Box>
    <Typography variant="h5" sx={{ mb: 3 }}>From our kitchen</Typography>
    <div className="dish-grid">{selection.map((dish) => <DishCard key={dish.id} dish={dish} />)}</div>
  </Container></Box>;
}

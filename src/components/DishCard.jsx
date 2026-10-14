import { Box, Button, Chip, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DishArtwork from './DishArtwork';
import { money } from '../utils/format';
import { useRestaurant } from '../contexts/RestaurantContext';

export default function DishCard({ dish }) {
  const { addToCart } = useRestaurant();
  return (
    <article className="dish-card">
      <div className="dish-image-wrap">
        <DishArtwork type={dish.art} name={dish.name} className="dish-image" />
        {dish.popular && <Chip size="small" className="popular-label" label="House favorite" />}
        {!dish.available && <span className="sold-out-label">Currently unavailable</span>}
      </div>
      <Box className="dish-body">
        <Typography className="dish-category">{dish.category}</Typography>
        <Typography variant="h6" component="h3" sx={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: '1.36rem' }}>
          {dish.name}
        </Typography>
        <Typography color="text.secondary" className="dish-description">{dish.description}</Typography>
        <div className="dish-card-bottom">
          <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.12rem' }}>{money(dish.price)}</Typography>
          <Button onClick={() => addToCart(dish.id)} variant="contained" size="small" disabled={!dish.available} startIcon={<AddRoundedIcon />}>
            Add
          </Button>
        </div>
      </Box>
    </article>
  );
}

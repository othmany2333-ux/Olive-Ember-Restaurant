import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Container, InputAdornment, TextField, Typography, MenuItem } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DishCard from '../components/DishCard';
import { filterAndSortMenu, sortOptions } from '../utils/management';
import { useRestaurant } from '../contexts/RestaurantContext';

export default function MenuPage() {
  const { menu, categories } = useRestaurant();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  useEffect(() => {
    if (category !== 'All' && !categories.includes(category)) setCategory('All');
  }, [categories, category]);
  const filtered = useMemo(() => filterAndSortMenu(menu, category, search, sort), [menu, category, search, sort]);

  return (
    <>
      <section className="page-intro">
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography className="eyebrow">TAKE YOUR PICK</Typography>
          <Typography variant="h1" className="page-title">The good stuff.</Typography>
          <Typography className="intro-text">Comfort food, little treats, and everything in between. Made fresh, just for you.</Typography>
        </Container>
      </section>
      <section className="section-pad menu-section">
        <Container maxWidth="lg">
          <div className="menu-toolbar">
            <Box className="category-chips">
              {['All', ...categories].map((item) => <Chip key={item} clickable label={item} onClick={() => setCategory(item)}
                color={category === item ? 'primary' : 'default'} variant={category === item ? 'filled' : 'outlined'} />)}
            </Box>
            <TextField placeholder="Search dishes..." value={search} onChange={(event) => setSearch(event.target.value)}
              aria-label="Search dishes" sx={{ minWidth: { xs: '100%', md: 238 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment> }} />
            <TextField select label="Sort by" size="small" value={sort} onChange={(event) => setSort(event.target.value)} sx={{ minWidth: 190 }}>
              {sortOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
            </TextField>
          </div>
          <Typography color="text.secondary" sx={{ mb: 3 }}>{filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} to explore</Typography>
          {filtered.length ? <div className="dish-grid">{filtered.map((dish) => <DishCard key={dish.id} dish={dish} />)}</div>
            : <div className="empty-state"><Typography variant="h5">Nothing matches that search.</Typography><Typography color="text.secondary">Try another word or category.</Typography></div>}
        </Container>
      </section>
    </>
  );
}

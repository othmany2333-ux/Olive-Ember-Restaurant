import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DishArtwork from '../components/DishArtwork';

export default function AboutPage() {
  return (
    <>
      <section className="page-intro"><Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography className="eyebrow">THE STORY BEHIND THE PLATES</Typography>
        <Typography variant="h1" className="page-title">Made to feel like home.</Typography>
        <Typography className="intro-text">A place for long conversations, second helpings, and the people who make a meal worth sharing.</Typography>
      </Container></section>
      <section className="section-pad"><Container maxWidth="lg"><div className="about-grid">
        <div className="about-illustration"><DishArtwork type="salad" name="Fresh ingredients" /></div>
        <div>
          <Typography className="eyebrow">WHY WE DO WHAT WE DO</Typography>
          <Typography variant="h2" className="section-title">A simple idea, served with love.</Typography>
          <Typography color="text.secondary" sx={{ mt: 3, lineHeight: 2 }}>
            Olive & Ember began with a simple thought: great food doesn't have to be complicated. Just thoughtful ingredients, a kitchen that cares, and enough time to enjoy the people around you.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 2 }}>
            We make comforting favorites with small, seasonal touches. From the first slice of pizza to the last spoonful of dessert, we want every meal to feel like a little celebration.
          </Typography>
          <Button component={RouterLink} to="/menu" variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 4 }}>Find your favorite</Button>
        </div>
      </div></Container></section>
      <Box className="about-beliefs"><Container maxWidth="lg"><div className="beliefs-grid">
        <div><span className="belief-number">01</span><Typography variant="h5">Cook with care</Typography><Typography>Good meals start long before they reach the plate.</Typography></div>
        <div><span className="belief-number">02</span><Typography variant="h5">Keep it honest</Typography><Typography>Simple ingredients and flavors that speak for themselves.</Typography></div>
        <div><span className="belief-number">03</span><Typography variant="h5">Make room for everyone</Typography><Typography>The best table is one where everybody feels welcome.</Typography></div>
      </div></Container></Box>
    </>
  );
}

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import DishCard from '../components/DishCard';
import DishArtwork from '../components/DishArtwork';
import SectionHeading from '../components/SectionHeading';
import { useRestaurant } from '../contexts/RestaurantContext';

export default function HomePage() {
  const { menu, publicReviews } = useRestaurant();
  const featured = menu.filter((item) => item.popular && item.available).slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <Container maxWidth="lg">
          <div className="hero-grid">
            <div className="hero-copy">
              <Typography className="eyebrow">WELCOME TO YOUR NEW FAVORITE SPOT</Typography>
              <Typography component="h1" variant="h1" className="hero-title">
                Food tastes better <em>together.</em>
              </Typography>
              <Typography className="hero-description">
                Good ingredients, familiar flavors, and a table with your name on it. Come hungry. Leave happy.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
                <Button component={RouterLink} to="/menu" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>Explore the menu</Button>
                <Button component={RouterLink} to="/about" variant="outlined" size="large">Get to know us</Button>
              </Stack>
              <div className="hero-note"><span className="hero-note-star">✳</span> Prepared fresh, every day. No shortcuts.</div>
            </div>
            <div className="hero-art" aria-label="Our signature dishes">
              <div className="hero-art-bg" />
              <div className="hero-floating floating-top">A little love in every bite <span>♥</span></div>
              <DishArtwork type="pizza" name="Our signature Margherita pizza" className="hero-pizza" />
              <div className="hero-floating floating-bottom"><strong>Made with care</strong><small>From our kitchen to you</small></div>
              <span className="hero-sparkle one">✳</span><span className="hero-sparkle two">✳</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="values-section">
        <Container maxWidth="lg">
          <div className="values-grid">
            <div className="value-item"><RestaurantRoundedIcon /><div><strong>Fresh from the kitchen</strong><span>Made to order, always.</span></div></div>
            <div className="value-item"><SpaOutlinedIcon /><div><strong>Real ingredients</strong><span>Simple things done well.</span></div></div>
            <div className="value-item"><FavoriteBorderRoundedIcon /><div><strong>Good food, good mood</strong><span>Comfort in every bite.</span></div></div>
          </div>
        </Container>
      </section>

      <section className="section-pad">
        <Container maxWidth="lg">
          <div className="section-row">
            <SectionHeading eyebrow="THE CROWD PLEASERS" title="A few things we love making" description="The dishes that bring people back. Try one, or make a feast of it." />
            <Button component={RouterLink} to="/menu" endIcon={<ArrowForwardRoundedIcon />}>See full menu</Button>
          </div>
          <div className="dish-grid">
            {featured.length ? featured.map((dish) => <DishCard key={dish.id} dish={dish} />)
              : <Typography color="text.secondary">Our kitchen is putting together new favorites. Check back soon!</Typography>}
          </div>
        </Container>
      </section>

      <section className="story-band">
        <Container maxWidth="lg">
          <div className="story-grid">
            <div className="story-visual">
              <div className="story-dish"><DishArtwork type="pasta" name="Homemade pasta" /></div>
              <span className="story-tag">Since the first shared plate ♡</span>
            </div>
            <div>
              <Typography className="eyebrow light">A LITTLE ABOUT US</Typography>
              <Typography variant="h2" className="section-title light-title">Pull up a chair. There's room for you.</Typography>
              <Typography className="story-copy">
                We believe the best meals are the ones you slow down for. That's why we cook honest food, serve it with warmth, and always leave room for dessert.
              </Typography>
              <Button component={RouterLink} to="/about" variant="contained" color="secondary" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 3 }}>Read our story</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-pad" aria-label="Guest reviews"><Container maxWidth="lg">
        <SectionHeading eyebrow="GUEST NOTES" title="Words from our table" description="Reviews are shared here only after our manager approves them." />
        {publicReviews.length ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5, mt: 3 }}>
          {publicReviews.slice(0, 6).map((review) => <Box key={review.id} className="order-card">
            <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', mb: 2 }}>“{review.content}”</Typography>
            <Typography fontWeight={700}>{review.name}</Typography>
          </Box>)}
        </Box> : <Typography color="text.secondary" sx={{ mt: 2 }}>There are no published reviews yet. Registered customers can send one through their Messages page.</Typography>}
      </Container></section>

      <Box className="home-bottom-cta">
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography className="eyebrow">HUNGRY YET?</Typography>
          <Typography variant="h2" className="section-title">Let's make today delicious.</Typography>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>Your next favorite meal is a few clicks away.</Typography>
          <Button component={RouterLink} to="/menu" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>Order something good</Button>
        </Container>
      </Box>
    </>
  );
}

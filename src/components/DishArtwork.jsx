import pizza from '../assets/pizza.svg';
import pasta from '../assets/pasta.svg';
import burger from '../assets/burger.svg';
import salad from '../assets/salad.svg';
import chicken from '../assets/chicken.svg';
import dessert from '../assets/dessert.svg';
import pasta2 from '../assets/pasta2.svg';
import drink from '../assets/drink.svg';

const images = { pizza, pasta, burger, salad, chicken, dessert, pasta2, drink };

export default function DishArtwork({ type, name, className = '' }) {
  return <img src={images[type] || images.pizza} alt={name || 'Freshly prepared food'} className={className} loading="lazy" />;
}

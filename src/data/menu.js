// Starter dishes. Any changes the admin makes are saved in the browser.
export const starterMenu = [
  {
    id: 'dish-1', name: 'Garden Margherita', category: 'Pizza',
    description: 'Tomato, creamy mozzarella, basil, and a good olive oil finish.',
    price: 12.5, art: 'pizza', popular: true, available: true,
  },
  {
    id: 'dish-2', name: 'Sunday Rigatoni', category: 'Pasta',
    description: 'Slow-cooked tomato sauce, parmesan, and a little fresh basil.',
    price: 14.0, art: 'pasta', popular: true, available: true,
  },
  {
    id: 'dish-3', name: 'The Ember Burger', category: 'Mains',
    description: 'Grilled beef, melted cheddar, lettuce, and our house sauce.',
    price: 15.5, art: 'burger', popular: true, available: true,
  },
  {
    id: 'dish-4', name: 'Little Green Bowl', category: 'Salads',
    description: 'Crunchy greens, cucumber, avocado, and lemon-herb dressing.',
    price: 10.5, art: 'salad', popular: false, available: true,
  },
  {
    id: 'dish-5', name: 'Fire-Roasted Chicken', category: 'Mains',
    description: 'Herb-marinated chicken with golden potatoes and pan juices.',
    price: 18, art: 'chicken', popular: false, available: true,
  },
  {
    id: 'dish-6', name: 'Cloud Nine Tiramisu', category: 'Desserts',
    description: 'Espresso-soaked layers and a generous dusting of cocoa.',
    price: 7.5, art: 'dessert', popular: false, available: true,
  },
  {
    id: 'dish-7', name: 'Basil Pesto Pasta', category: 'Pasta',
    description: 'Fresh basil pesto, toasted pine nuts, and shaved parmesan.',
    price: 14.5, art: 'pasta2', popular: false, available: true,
  },
  {
    id: 'dish-8', name: 'Pink Lemonade', category: 'Drinks',
    description: 'Fresh lemon, a hint of berry, and lots of ice.',
    price: 5, art: 'drink', popular: false, available: true,
  },
];

export const menuCategories = ['All', 'Pizza', 'Pasta', 'Mains', 'Salads', 'Desserts', 'Drinks'];
export const artworkOptions = ['pizza', 'pasta', 'burger', 'salad', 'chicken', 'dessert', 'pasta2', 'drink'];

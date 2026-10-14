import { makeId } from './format.js';

// Data operations are kept separate from React so they can be tested easily.
export function getCartItems(cart, menu) {
  return cart.map(({ id, quantity }) => {
    const dish = menu.find((item) => item.id === id);
    return dish && dish.available && Number.isInteger(quantity) && quantity > 0
      ? { ...dish, quantity }
      : null;
  }).filter(Boolean);
}

export function cartTotalFor(items) {
  return Number(items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));
}

export function createOrder({ user, customer, phone, address, notes = '' }, items, total, options = {}) {
  if (!user || !user.id || !user.email) throw new Error('Please sign in first.');
  if (!items.length) throw new Error('Your bag is empty.');
  if (![customer, phone, address].every((value) => typeof value === 'string' && value.trim())) {
    throw new Error('Please fill in your name, phone number and delivery address.');
  }
  return {
    id: options.id || makeId(),
    userId: user.id,
    customer: customer.trim(),
    email: user.email,
    phone: phone.trim(),
    address: address.trim(),
    notes: typeof notes === 'string' ? notes.trim() : '',
    items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
    total: Number(total.toFixed(2)),
    status: 'Received',
    createdAt: options.createdAt || new Date().toISOString(),
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { starterMenu, menuCategories } from '../src/data/menu.js';
import { money, shortDate, makeId } from '../src/utils/format.js';
import { getCartItems, cartTotalFor, createOrder } from '../src/utils/orders.js';

const user = { id: 'test-123', name: 'Test User', email: 'test@example.test', role: 'user' };
const items = getCartItems([{ id: 'dish-1', quantity: 2 }, { id: 'dish-8', quantity: 1 }], starterMenu);

test('starter dishes have consistent IDs, categories and prices', () => {
  assert.equal(starterMenu.length, 8);
  assert.equal(new Set(starterMenu.map((dish) => dish.id)).size, starterMenu.length);
  for (const dish of starterMenu) {
    assert.ok(menuCategories.includes(dish.category));
    assert.ok(dish.price > 0);
    assert.ok(dish.name);
  }
});

test('cart uses dishes from the menu and includes quantities', () => {
  assert.equal(items.length, 2);
  assert.equal(items[0].quantity, 2);
  assert.equal(items[0].name, 'Garden Margherita');
});

test('cart ignores removed, unavailable, and invalid-quantity dishes', () => {
  const menu = starterMenu.map((dish) => dish.id === 'dish-1' ? { ...dish, available: false } : dish);
  const cart = [
    { id: 'missing', quantity: 1 },
    { id: 'dish-1', quantity: 2 },
    { id: 'dish-2', quantity: -1 },
    { id: 'dish-8', quantity: 1 },
  ];
  assert.deepEqual(getCartItems(cart, menu).map((dish) => dish.id), ['dish-8']);
});

test('cart total is a two-decimal currency amount', () => {
  assert.equal(cartTotalFor(items), 30);
  assert.equal(money(cartTotalFor(items)), '$30.00');
  assert.equal(cartTotalFor([]), 0);
});

test('checkout snapshots items, trims form fields, and records ownership', () => {
  const order = createOrder({ user, customer: '  Test User  ', phone: '  55512345 ', address: '  Main street  ', notes: '  No spice ' }, items, 30, {
    id: 'order-1', createdAt: '2026-10-13T12:00:00.000Z',
  });
  assert.equal(order.id, 'order-1');
  assert.equal(order.userId, 'test-123');
  assert.equal(order.customer, 'Test User');
  assert.equal(order.address, 'Main street');
  assert.equal(order.notes, 'No spice');
  assert.equal(order.total, 30);
  assert.equal(order.status, 'Received');
  assert.equal(order.items.length, 2);
  assert.deepEqual(Object.keys(order.items[0]), ['id', 'name', 'price', 'quantity']);
});

test('checkout blocks anonymous users and empty bags', () => {
  const details = { user, customer: 'Jane', phone: '1234567', address: 'Street' };
  assert.throws(() => createOrder({ ...details, user: null }, items, 30), /sign in/);
  assert.throws(() => createOrder(details, [], 0), /empty/);
});

test('checkout rejects missing customer information', () => {
  assert.throws(() => createOrder({ user, customer: '', phone: '1234567', address: 'Street' }, items, 30), /fill in/);
});

test('format helpers return usable values', () => {
  assert.match(makeId(), /^.+$/);
  assert.equal(shortDate('2026-10-13T12:00:00.000Z'), 'Oct 13, 2026');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { starterMenu } from '../src/data/menu.js';
import { filterAndSortMenu, reviewIsPublic, canChangeRole, summarizeOrders, categoryCount } from '../src/utils/management.js';

test('search and category filtering are case-insensitive', () => {
  assert.equal(filterAndSortMenu(starterMenu, 'Pizza', 'mARGHERITA').length, 1);
  assert.deepEqual(filterAndSortMenu(starterMenu, 'All', 'xx-no-such-dish'), []);
});

test('menu sorting does not mutate original menu and sorts prices', () => {
  const before = starterMenu.map((dish) => dish.id);
  const asc = filterAndSortMenu(starterMenu, 'All', '', 'price-asc');
  const desc = filterAndSortMenu(starterMenu, 'All', '', 'price-desc');
  assert.ok(asc[0].price <= asc.at(-1).price);
  assert.ok(desc[0].price >= desc.at(-1).price);
  assert.deepEqual(starterMenu.map((dish) => dish.id), before);
});

test('only approved reviews become public', () => {
  assert.equal(reviewIsPublic({ type: 'review', status: 'Approved' }), true);
  assert.equal(reviewIsPublic({ type: 'review', status: 'Pending' }), false);
  assert.equal(reviewIsPublic({ type: 'message', status: 'Approved' }), false);
});

test('role management protects the last manager', () => {
  const users = [{ id: '1', role: 'admin' }, { id: '2', role: 'user' }];
  assert.equal(canChangeRole(users, '1', 'user'), false);
  assert.equal(canChangeRole(users, '2', 'admin'), true);
  assert.equal(canChangeRole(users, 'none', 'admin'), false);
  assert.equal(canChangeRole(users, '2', 'unknown'), false);
  assert.equal(canChangeRole([...users, { id: '3', role: 'admin' }], '1', 'user'), true);
});

test('reports exclude cancelled orders from sales total and average', () => {
  const report = summarizeOrders([
    { status: 'Delivered', total: 40 },
    { status: 'Received', total: 20 },
    { status: 'Cancelled', total: 90 },
  ]);
  assert.deepEqual(report, { total: 3, pending: 1, delivered: 1, orderValue: 60, average: 30 });
});

test('categories count dishes accurately', () => {
  assert.equal(categoryCount(starterMenu, 'Pizza'), starterMenu.filter((dish) => dish.category === 'Pizza').length);
  assert.equal(categoryCount(starterMenu, 'Nonexistent'), 0);
});

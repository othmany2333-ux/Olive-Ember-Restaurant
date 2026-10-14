// Pure helpers keep the interface logic small and easy to test.
export const messageStatuses = ['Pending', 'Approved', 'Rejected'];
export const orderStatuses = ['Received', 'Preparing', 'On the way', 'Delivered', 'Cancelled'];
export const sortOptions = [
  { value: 'featured', label: 'Featured first' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'price-asc', label: 'Price (low to high)' },
  { value: 'price-desc', label: 'Price (high to low)' },
];

export function filterAndSortMenu(menu, category = 'All', search = '', sort = 'featured') {
  const term = search.trim().toLowerCase();
  const result = menu.filter((dish) =>
    (category === 'All' || dish.category === category) &&
    `${dish.name} ${dish.description} ${dish.category}`.toLowerCase().includes(term)
  );
  return [...result].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price || a.name.localeCompare(b.name);
    if (sort === 'price-desc') return b.price - a.price || a.name.localeCompare(b.name);
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    return Number(Boolean(b.popular)) - Number(Boolean(a.popular)) || a.name.localeCompare(b.name);
  });
}

export function reviewIsPublic(message) {
  return message.type === 'review' && message.status === 'Approved';
}

export function canChangeRole(accounts, targetId, newRole) {
  if (!['admin', 'user'].includes(newRole)) return false;
  const target = accounts.find((account) => account.id === targetId);
  if (!target) return false;
  if (target.role === 'admin' && newRole === 'user') {
    return accounts.filter((account) => account.role === 'admin').length > 1;
  }
  return true;
}

export function summarizeOrders(orders) {
  const active = orders.filter((order) => order.status !== 'Cancelled');
  return {
    total: orders.length,
    pending: orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length,
    orderValue: active.reduce((sum, order) => sum + Number(order.total || 0), 0),
    average: active.length ? active.reduce((sum, order) => sum + Number(order.total || 0), 0) / active.length : 0,
    delivered: orders.filter((order) => order.status === 'Delivered').length,
  };
}

export function categoryCount(menu, category) {
  return menu.filter((dish) => dish.category === category).length;
}

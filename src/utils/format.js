export const money = (value) => `$${Number(value || 0).toFixed(2)}`;
export const shortDate = (date) => new Date(date).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
});
export const makeId = () => (typeof crypto !== 'undefined' && crypto.randomUUID)
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

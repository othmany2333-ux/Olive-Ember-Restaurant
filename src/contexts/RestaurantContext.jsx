import { createContext, useContext, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { starterMenu, menuCategories } from '../data/menu';
import { makeId } from '../utils/format';
import { getCartItems, cartTotalFor, createOrder } from '../utils/orders';
import { messageStatuses, orderStatuses, reviewIsPublic } from '../utils/management';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [menu, setMenu] = useLocalStorage('oe_menu', starterMenu);
  const [categories, setCategories] = useLocalStorage('oe_categories', menuCategories.filter((name) => name !== 'All'));
  const [cart, setCart] = useLocalStorage('oe_cart', []);
  const [orders, setOrders] = useLocalStorage('oe_orders', []);
  const [messages, setMessages] = useLocalStorage('oe_messages', []);
  const [notice, setNotice] = useState('');
  const cartItems = useMemo(() => getCartItems(cart, menu), [cart, menu]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartTotalFor(cartItems);
  const publicReviews = useMemo(() => messages.filter(reviewIsPublic), [messages]);

  function addToCart(id) {
    const dish = menu.find((item) => item.id === id);
    if (!dish || !dish.available) return;
    setCart((previous) => previous.some((item) => item.id === id)
      ? previous.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...previous, { id, quantity: 1 }]);
    setNotice(`${dish.name} added to your bag`);
  }
  function changeQuantity(id, change) {
    setCart((previous) => previous.map((item) => item.id === id
      ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0));
  }
  function removeFromCart(id) { setCart((previous) => previous.filter((item) => item.id !== id)); }

  function saveDish(dish) {
    if (!categories.includes(dish.category)) throw new Error('Please choose an existing category.');
    if (typeof dish.name !== 'string' || !dish.name.trim() ||
        typeof dish.description !== 'string' || !dish.description.trim() ||
        !Number.isFinite(dish.price) || dish.price <= 0 || dish.price > 999) {
      throw new Error('Enter a name, description and a valid price between $0.01 and $999.');
    }
    if (dish.id) {
      setMenu((previous) => previous.map((item) => item.id === dish.id ? { ...item, ...dish } : item));
      setNotice('Dish updated successfully');
    } else {
      setMenu((previous) => [{ ...dish, id: makeId() }, ...previous]);
      setNotice('New dish added to the menu');
    }
  }
  function deleteDish(id) {
    setMenu((previous) => previous.filter((item) => item.id !== id));
    setCart((previous) => previous.filter((item) => item.id !== id));
    setNotice('Dish removed from the menu');
  }
  function addCategory(raw) {
    const name = raw.trim();
    if (!name || name.length > 40) throw new Error('Enter a category name up to 40 characters.');
    if (categories.some((category) => category.toLowerCase() === name.toLowerCase())) throw new Error('This category already exists.');
    setCategories((old) => [...old, name]);
    setNotice('Category created');
  }
  function deleteCategory(name) {
    if (menu.some((dish) => dish.category === name)) throw new Error('Move or delete the dishes in this category first.');
    setCategories((old) => old.filter((category) => category !== name));
    setNotice('Category removed');
  }

  function placeOrder({ user, customer, phone, address, notes }) {
    const order = createOrder({ user, customer, phone, address, notes }, cartItems, cartTotal);
    setOrders((previous) => [order, ...previous]);
    setCart([]);
    setNotice('Your order is in! Thanks for choosing us.');
    return order;
  }
  function setOrderStatus(id, status) {
    if (!orderStatuses.includes(status)) throw new Error('Invalid order status.');
    setOrders((previous) => previous.map((order) => order.id === id ? { ...order, status } : order));
    setNotice('Order status updated');
  }
  function sendMessage({ user, name, email, content, type }) {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanContent = content.trim();
    if (!cleanName || !/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanContent.length < 10) {
      throw new Error('Please add your name, a valid email and at least ten characters.');
    }
    if (!['message', 'review'].includes(type)) throw new Error('Invalid message type.');
    const entry = {
      id: makeId(), userId: user?.id || null, name: cleanName, email: cleanEmail,
      content: cleanContent, type, status: 'Pending', createdAt: new Date().toISOString(),
    };
    setMessages((old) => [entry, ...old]);
    setNotice(type === 'review' ? 'Review received and awaiting approval.' : 'Your message was received.');
    return entry;
  }
  function setMessageStatus(id, status) {
    if (!messageStatuses.includes(status)) throw new Error('Invalid status.');
    setMessages((old) => old.map((message) => message.id === id ? { ...message, status } : message));
    setNotice('Message status updated');
  }
  return <RestaurantContext.Provider value={{
    menu, categories, cartItems, cartCount, cartTotal, orders, messages, publicReviews, notice, setNotice,
    addToCart, changeQuantity, removeFromCart, saveDish, deleteDish, addCategory, deleteCategory,
    placeOrder, setOrderStatus, sendMessage, setMessageStatus,
  }}>{children}</RestaurantContext.Provider>;
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used inside RestaurantProvider');
  return context;
}

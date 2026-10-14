import { Button, Container, Typography } from '@mui/material';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import CartPage from './pages/CartPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DiscoverPage from './pages/DiscoverPage';
import MessagesPage from './pages/MessagesPage';

function NotFoundPage() {
  return <Container maxWidth="sm" sx={{ textAlign: 'center', py: 15 }}>
    <Typography className="eyebrow">404 — WRONG TURN</Typography>
    <Typography variant="h2" sx={{ mb: 2 }}>This page isn't on the menu.</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>But there's plenty more to explore.</Typography>
    <Button component={RouterLink} variant="contained" to="/">Back to home</Button>
  </Container>;
}

export default function App() {
  return <Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="menu" element={<MenuPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route element={<ProtectedRoute role="user" />}>
        <Route path="account" element={<UserDashboard />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="messages" element={<MessagesPage />} />
      </Route>
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>;
}

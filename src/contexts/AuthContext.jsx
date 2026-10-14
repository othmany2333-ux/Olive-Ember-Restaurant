import { createContext, useContext, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { makeId } from '../utils/format';
import { canChangeRole } from '../utils/management';

const AuthContext = createContext(null);

// Demonstration only: credentials belong on a secure server in a real application.
const demoAccounts = [
  { id: 'admin-1', name: 'Alex Morgan', email: 'admin@oliveember.test', password: 'Admin123!', role: 'admin' },
  { id: 'guest-1', name: 'Sam Parker', email: 'guest@oliveember.test', password: 'Guest123!', role: 'user' },
];

function publicProfile(account) {
  const { id, name, email, role } = account;
  return { id, name, email, role };
}

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useLocalStorage('oe_accounts', demoAccounts);
  const [session, setSession] = useLocalStorage('oe_current_user', null);
  const user = useMemo(() => {
    if (!session?.id) return null;
    const account = accounts.find((entry) => entry.id === session.id);
    return account ? publicProfile(account) : null;
  }, [accounts, session]);
  const [busy, setBusy] = useState(false);

  function login(email, password) {
    setBusy(true);
    try {
      const found = accounts.find((account) =>
        account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password
      );
      if (!found) throw new Error('That email and password do not match. Please try again.');
      const profile = publicProfile(found);
      setSession(profile);
      return profile;
    } finally {
      setBusy(false);
    }
  }

  function register({ name, email, password }) {
    const cleanedEmail = email.trim().toLowerCase();
    if (name.trim().length < 2 || password.length < 8 || !/^\S+@\S+\.\S+$/.test(cleanedEmail)) {
      throw new Error('Use a valid name, email address and password of at least eight characters.');
    }
    if (accounts.some((account) => account.email.toLowerCase() === cleanedEmail)) {
      throw new Error('This email is already registered. Try logging in instead.');
    }
    const account = { id: makeId(), name: name.trim(), email: cleanedEmail, password, role: 'user' };
    setAccounts((previous) => [...previous, account]);
    const profile = publicProfile(account);
    setSession(profile);
    return profile;
  }

  function updateProfile({ name, email }) {
    if (!user) throw new Error('Please sign in.');
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2 || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      throw new Error('Enter a valid name and email address.');
    }
    if (accounts.some((account) => account.id !== user.id && account.email.toLowerCase() === cleanEmail)) {
      throw new Error('This email is already in use.');
    }
    const next = { ...user, name: cleanName, email: cleanEmail };
    setAccounts((old) => old.map((account) => account.id === user.id ? { ...account, ...next } : account));
    setSession(next);
  }

  function changeRole(id, role) {
    if (user?.role !== 'admin') throw new Error('Only managers can change roles.');
    if (user.id === id) throw new Error('You cannot change your own role while signed in.');
    if (!canChangeRole(accounts, id, role)) throw new Error('Keep at least one manager account.');
    setAccounts((old) => old.map((account) => account.id === id ? { ...account, role } : account));
  }

  function logout() { setSession(null); }

  return <AuthContext.Provider value={{ user, accounts: user?.role === 'admin' ? accounts.map(publicProfile) : [], busy, login, register, logout, updateProfile, changeRole }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

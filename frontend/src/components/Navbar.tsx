import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [altTheme, setAltTheme] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('altTheme') === '1';
    setAltTheme(saved);
    // Не применять тёмную тему на экране логина
    const isLogin = typeof window !== 'undefined' && window.location.pathname === '/login';
    document.body.classList.toggle('alt-theme', saved && !isLogin);
  }, []);

  const toggleTheme = () => {
    const next = !altTheme;
    setAltTheme(next);
    localStorage.setItem('altTheme', next ? '1' : '0');
    const isLogin = typeof window !== 'undefined' && window.location.pathname === '/login';
    document.body.classList.toggle('alt-theme', next && !isLogin);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <a href="/dashboard" className="navbar-brand">
        🏗️ Construction Defects System
      </a>
      <div className="navbar-user">
        <button className="btn btn-secondary btn-sm" onClick={toggleTheme} title="Сменить тему">
          {altTheme ? 'Светлая тема' : 'Тёмная тема'}
        </button>
        <div className="user-info">
          <div className="user-name">{user?.full_name || user?.username}</div>
          <div className="user-role">{user?.role}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
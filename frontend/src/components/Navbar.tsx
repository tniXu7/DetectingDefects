import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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
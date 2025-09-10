import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';

const Sidebar: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { path: '/dashboard', label: 'Дашборд', icon: '📊' },
    { path: '/projects', label: 'Проекты', icon: '🏗️' },
    { path: '/defects', label: 'Дефекты', icon: '🔧' },
    { path: '/reports', label: 'Отчеты', icon: '📈' },
    { path: '/users', label: 'Пользователи', icon: '👥', role: 'manager' },
    { path: '/profile', label: 'Профиль', icon: '👤' },
  ];

  // Фильтруем меню в зависимости от роли
  const filteredMenuItems = menuItems.filter(item => {
    if (item.path === '/projects' && user?.role === 'observer') {
      return false; // Наблюдатели не могут создавать проекты
    }
    if (item.role && user?.role !== item.role) {
      return false; // Показываем только для указанной роли
    }
    return true;
  });

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
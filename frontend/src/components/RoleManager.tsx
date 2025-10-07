import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addNotification } from '../store/notificationSlice';
import client from '../api/client';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface RoleManagerProps {
  users: User[];
  onUserUpdate: () => void;
}

const RoleManager: React.FC<RoleManagerProps> = ({ users, onUserUpdate }) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const handleRoleChange = async (userId: number, newRole: string) => {
    setLoading(userId);
    try {
      await client.put(`/users/${userId}/role`, { role: newRole });
      dispatch(addNotification({
        message: 'Роль пользователя успешно изменена',
        type: 'success',
      }));
      onUserUpdate();
    } catch (error: any) {
      dispatch(addNotification({
        message: error.response?.data?.detail || 'Ошибка изменения роли',
        type: 'error',
      }));
    } finally {
      setLoading(null);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      admin: 'Администратор',
      manager: 'Менеджер',
      engineer: 'Инженер',
      observer: 'Наблюдатель'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: '#dc3545',
      manager: '#007bff',
      engineer: '#28a745',
      observer: '#6c757d'
    };
    return colors[role] || '#6c757d';
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter(u => u.id !== currentUser?.id)
      .filter(u => !q ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      );
  }, [users, currentUser?.id, query]);

  return (
    <div className="role-manager">
      <div className="card" style={{ marginTop: 0 }}>
        <div className="card-header">
          <h2 className="card-title">Управление ролями пользователей</h2>
          <div className="role-search-wrap">
            <input
              type="text"
              placeholder="Поиск по имени, логину или email"
              className="form-input role-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="role-manager-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="role-manager-card">
              <div className="user-info">
                <div className="user-name">{user.full_name || user.username}</div>
                <div className="user-username">@{user.username}</div>
                <div className="user-email">{user.email || 'Email не указан'}</div>
              </div>

              <div className="role-section">
                <label className="role-label">Роль</label>
                <div className="role-select-row">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={loading === user.id}
                    className="role-select"
                  >
                    <option value="observer">Наблюдатель</option>
                    <option value="engineer">Инженер</option>
                    <option value="manager">Менеджер</option>
                    <option value="admin">Администратор</option>
                  </select>
                  <span
                    className="current-role-badge"
                    style={{ background: getRoleColor(user.role) }}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </div>

              {loading === user.id && (
                <div className="loading-inline">Сохраняем…</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleManager;

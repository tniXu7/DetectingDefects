import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addNotification } from '../store/notificationSlice';
import client from '../api/client';

interface User {
  id: number;
  username: string;
  full_name?: string;
  email?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface UserCreate {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  role: string;
}

const Users: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<UserCreate>({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'observer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await client.get('/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error('Ошибка загрузки пользователей:', error);
      dispatch(addNotification({
        message: error.response?.data?.detail || 'Ошибка загрузки пользователей',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/users/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        username: '',
        password: '',
        full_name: '',
        email: '',
        role: 'observer',
      });
      setShowForm(false);
      fetchUsers();
      dispatch(addNotification({
        message: 'Пользователь успешно создан!',
        type: 'success',
      }));
    } catch (error: any) {
      console.error('Ошибка создания пользователя:', error);
      dispatch(addNotification({
        message: error.response?.data?.detail || 'Ошибка создания пользователя',
        type: 'error',
      }));
    }
  };

  const canManageUsers = user?.role === 'manager';

  if (!canManageUsers) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="text-center">
            <h1 className="card-title">Доступ запрещен</h1>
            <p>У вас нет прав для управления пользователями</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="text-center">
            <span className="spinner"></span>
            <p className="mt-2">Загрузка пользователей...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Управление пользователями</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Отмена' : 'Добавить пользователя'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Имя пользователя</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Пароль</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Роль</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="observer">Наблюдатель</option>
                  <option value="engineer">Инженер</option>
                  <option value="manager">Менеджер</option>
                </select>
              </div>
            </div>
            <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Полное имя</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Создать пользователя
            </button>
          </form>
        )}

        {users.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: '#666' }}>
            <h3>Пользователи не найдены</h3>
            <p>Добавьте первого пользователя</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя пользователя</th>
                  <th>Полное имя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <strong>{user.username}</strong>
                    </td>
                    <td>{user.full_name || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'manager' ? 'Менеджер' : 
                         user.role === 'engineer' ? 'Инженер' : 'Наблюдатель'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`}>
                        {user.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;

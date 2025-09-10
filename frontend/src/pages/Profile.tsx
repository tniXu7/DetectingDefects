import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { addNotification } from '../store/notificationSlice';
import client from '../api/client';

const Profile: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await client.put('/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Профиль успешно обновлен!');
      dispatch(addNotification({
        message: 'Профиль успешно обновлен!',
        type: 'success',
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Ошибка обновления профиля';
      setMessage(errorMessage);
      dispatch(addNotification({
        message: errorMessage,
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Профиль пользователя</h1>
        </div>

        <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>👤 Информация о пользователе</h3>
            <div className="user-info">
              <div className="d-flex justify-content-between mb-2">
                <strong>Имя пользователя:</strong>
                <span>{user?.username}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>Роль:</strong>
                <span className="status-badge status-new">{user?.role}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>Полное имя:</strong>
                <span>{user?.full_name || 'Не указано'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>Email:</strong>
                <span>{user?.email || 'Не указан'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>✏️ Редактировать профиль</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Полное имя</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {message && (
                <div className={`mb-2 ${message.includes('успешно') ? 'text-success' : 'text-danger'}`}>
                  {message}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : 'Обновить профиль'}
              </button>
            </form>
          </div>
        </div>

        <div className="card mt-3">
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🔐 Безопасность</h3>
          <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-secondary">
              Изменить пароль
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Выйти из системы
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

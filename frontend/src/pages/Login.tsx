import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { loginSuccess } from '../store/authSlice';
import { addNotification } from '../store/notificationSlice';
import client from '../api/client';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Если уже авторизован, перенаправляем на дашборд
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);

      const response = await client.post('/auth/token', formDataToSend, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;

      // Получаем информацию о пользователе
      const userResponse = await client.get('/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      dispatch(loginSuccess({
        user: userResponse.data,
        token: access_token,
      }));

      dispatch(addNotification({
        message: 'Успешный вход в систему!',
        type: 'success',
      }));

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ошибка входа';
      setError(errorMessage);
      dispatch(addNotification({
        message: errorMessage,
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход в систему</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <div className="mb-2" style={{ color: '#dc3545', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Войти'}
          </button>
        </form>
        <div className="text-center mt-3">
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Тестовые аккаунты:
          </p>
          <p style={{ fontSize: '0.75rem', color: '#999' }}>
            manager/managerpass (Менеджер)<br />
            engineer/engineerpass (Инженер)<br />
            observer/observerpass (Наблюдатель)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
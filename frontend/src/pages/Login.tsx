import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { loginSuccess } from '../store/authSlice';
import { addNotification } from '../store/notificationSlice';
import client from '../api/client';
import { authApi } from '../api/auth';
import AnimatedCharacters from '../components/AnimatedCharacters';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'observer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loginState, setLoginState] = useState<'idle' | 'error' | 'success'>('idle');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Отслеживание позиции мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Если уже авторизован, перенаправляем на дашборд
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Сбрасываем ошибки при изменении полей
    if (error) {
      setError('');
      setLoginState('idle');
    }
    
    if (isRegisterMode) {
      setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        // Регистрация
        await client.post('/auth/register', registerData);
        setLoginState('success');
        dispatch(addNotification({
          message: 'Регистрация успешна! Теперь войдите в систему.',
          type: 'success',
        }));
        setIsRegisterMode(false);
        setRegisterData({
          username: '',
          password: '',
          full_name: '',
          email: '',
          role: 'observer'
        });
      } else {
        // Вход
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('password', formData.password);

        const response = await client.post('/auth/token', formDataToSend, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token } = response.data;

        // Получаем информацию о пользователе с токеном
        const userResponse = await client.get('/users/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userData = userResponse.data;

        setLoginState('success');
        dispatch(loginSuccess({
          user: userData,
          token: access_token,
        }));

        dispatch(addNotification({
          message: 'Успешный вход в систему!',
          type: 'success',
        }));

        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = 'Произошла ошибка';
      
      if (err.response) {
        // Сервер ответил с ошибкой
        if (err.response.status === 401) {
          errorMessage = 'Неверное имя пользователя или пароль';
        } else if (err.response.status === 422) {
          errorMessage = 'Проверьте правильность введенных данных';
        } else if (err.response.status === 400) {
          errorMessage = 'Некорректные данные';
        } else {
          errorMessage = err.response.data?.detail || 'Ошибка сервера';
        }
      } else if (err.request) {
        // Запрос был отправлен, но ответа не получено
        errorMessage = 'Ошибка соединения с сервером';
      } else {
        // Что-то другое
        errorMessage = err.message || 'Неизвестная ошибка';
      }
      
      setError(errorMessage);
      setLoginState('error');
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
      <div className="login-layout">
        <div className="login-left">
          <AnimatedCharacters 
            mousePosition={mousePosition} 
            loginState={loginState} 
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-title">
              {isRegisterMode ? 'Регистрация' : 'Вход в систему'}
            </h1>
        <form onSubmit={handleSubmit}>
          {isRegisterMode ? (
            <>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={registerData.username}
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
                  value={registerData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="full_name" className="form-label">
                  Полное имя
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className="form-input"
                  value={registerData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={registerData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Роль
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={registerData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="observer">Наблюдатель</option>
                  <option value="engineer">Инженер</option>
                  <option value="manager">Менеджер</option>
                </select>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            {loading ? <span className="spinner"></span> : (isRegisterMode ? 'Зарегистрироваться' : 'Войти')}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            style={{ fontSize: '0.875rem', color: '#007bff', textDecoration: 'none' }}
          >
            {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>

        {!isRegisterMode && (
          <div className="text-center mt-3">
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Демо-аккаунты:
            </p>
            <p style={{ fontSize: '0.75rem', color: '#999' }}>
              manager/admin123 (Менеджер)<br />
              engineer/user123 (Инженер)<br />
              observer/view123 (Наблюдатель)
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
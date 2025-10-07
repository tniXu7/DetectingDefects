import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout, setLoading } from '../store/authSlice';
import { authApi } from '../api/auth';

export const useAuthRestore = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Проверяем токен, получая данные пользователя
          const response = await authApi.getCurrentUser();
          if (response.data) {
            dispatch(loginSuccess({
              user: response.data,
              token: token
            }));
          }
        } catch (error) {
          // Токен недействителен, удаляем его
          localStorage.removeItem('token');
          dispatch(logout());
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    restoreAuth();
  }, [dispatch]);
};

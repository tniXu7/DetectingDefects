import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000",
});

// Добавляем интерцептор для автоматической передачи токена
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем интерцептор для обработки ошибок авторизации
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Не перенаправляем для запросов аутентификации, чтобы показать ошибку в форме
    const url: string | undefined = error?.config?.url;
    const isAuthEndpoint = url?.includes('/auth/token') || url?.includes('/auth/register');
    const isAlreadyOnLogin = typeof window !== 'undefined' && window.location.pathname === '/login';

    if (!isAuthEndpoint && error.response?.status === 401 && !isAlreadyOnLogin) {
      // Токен истёк или недействителен – очищаем и отправляем на логин
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;

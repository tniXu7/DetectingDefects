import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="main-content">
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '6rem', marginBottom: '2rem' }}>🚫</div>
        <h1 style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}>
          404
        </h1>
        <h2 style={{ color: '#333', marginBottom: '2rem' }}>
          Страница не найдена
        </h2>
        <p style={{ color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="d-flex gap-2 justify-content-center" style={{ flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">
            🏠 На главную
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            🏗️ Проекты
          </Link>
          <Link to="/defects" className="btn btn-success">
            🔧 Дефекты
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

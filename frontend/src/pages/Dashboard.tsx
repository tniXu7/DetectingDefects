import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import client from '../api/client';

interface Stats {
  totalProjects: number;
  totalDefects: number;
  defectsByStatus: Record<string, number>;
  defectsByPriority: Record<string, number>;
}

const Dashboard: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalDefects: 0,
    defectsByStatus: {},
    defectsByPriority: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Получаем проекты
        const projectsResponse = await client.get('/projects/', { headers });
        const totalProjects = projectsResponse.data.length;

        // Получаем дефекты
        const defectsResponse = await client.get('/defects/', { headers });
        const defects = defectsResponse.data;
        const totalDefects = defects.length;

        // Группируем по статусам
        const defectsByStatus = defects.reduce((acc: Record<string, number>, defect: any) => {
          acc[defect.status] = (acc[defect.status] || 0) + 1;
          return acc;
        }, {});

        // Группируем по приоритетам
        const defectsByPriority = defects.reduce((acc: Record<string, number>, defect: any) => {
          acc[`priority-${defect.priority}`] = (acc[`priority-${defect.priority}`] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalProjects,
          totalDefects,
          defectsByStatus,
          defectsByPriority,
        });
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="text-center">
            <span className="spinner"></span>
            <p className="mt-2">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Добро пожаловать, {user?.full_name || user?.username}!</h1>
        </div>
        
        <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1', minWidth: '200px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>📊 Общая статистика</h3>
            <div className="d-flex justify-content-between">
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                  {stats.totalProjects}
                </div>
                <div style={{ color: '#666' }}>Проектов</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                  {stats.totalDefects}
                </div>
                <div style={{ color: '#666' }}>Дефектов</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: '1', minWidth: '200px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🔧 Статусы дефектов</h3>
            {Object.entries(stats.defectsByStatus).map(([status, count]) => (
              <div key={status} className="d-flex justify-content-between mb-1">
                <span className={`status-badge status-${status.replace('_', '-')}`}>
                  {status.replace('_', ' ')}
                </span>
                <span style={{ fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ flex: '1', minWidth: '200px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>⚡ Приоритеты</h3>
            {Object.entries(stats.defectsByPriority).map(([priority, count]) => (
              <div key={priority} className="d-flex justify-content-between mb-1">
                <span className={`priority-badge priority-${priority.split('-')[1]}`}>
                  Приоритет {priority.split('-')[1]}
                </span>
                <span style={{ fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-3">
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 Быстрые действия</h3>
          <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
            <a href="/projects" className="btn btn-primary">
              Создать проект
            </a>
            <a href="/defects" className="btn btn-success">
              Добавить дефект
            </a>
            <a href="/reports" className="btn btn-secondary">
              Создать отчет
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
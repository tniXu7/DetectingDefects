import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import client from '../api/client';

interface Project {
  id: number;
  name: string;
}

const Reports: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await client.get('/projects/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const url = selectedProject 
        ? `/reports/defects/csv?project_id=${selectedProject}`
        : '/reports/defects/csv';
      
      const response = await client.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      // Создаем ссылку для скачивания
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url_blob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_blob;
      link.download = `defects_report_${selectedProject ? `project_${selectedProject}` : 'all'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_blob);
    } catch (error) {
      console.error('Ошибка скачивания отчета:', error);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="text-center">
            <span className="spinner"></span>
            <p className="mt-2">Загрузка проектов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Отчеты</h1>
        </div>

        <div className="mb-3">
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>📊 Экспорт дефектов в CSV</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Выберите проект для создания отчета или экспортируйте все дефекты
          </p>
          
          <div className="form-group">
            <label className="form-label">Выберите проект (опционально)</label>
            <select
              className="form-select"
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Все проекты</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-success"
            onClick={downloadCSV}
            disabled={projects.length === 0}
          >
            📥 Скачать CSV отчет
          </button>
        </div>

        <div className="card" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>ℹ️ Информация об отчете</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            CSV файл будет содержать следующую информацию:
          </p>
          <ul style={{ color: '#666', paddingLeft: '1.5rem' }}>
            <li>ID дефекта</li>
            <li>Название дефекта</li>
            <li>Описание</li>
            <li>Статус</li>
            <li>Приоритет</li>
            <li>ID проекта</li>
            <li>Ответственный</li>
            <li>Дата создания</li>
            <li>Дата обновления</li>
          </ul>
        </div>

        {projects.length === 0 && (
          <div className="card" style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)' }}>
            <h3 style={{ color: '#856404', marginBottom: '1rem' }}>⚠️ Нет доступных проектов</h3>
            <p style={{ color: '#856404' }}>
              Для создания отчетов необходимо сначала создать проекты. 
              Перейдите в раздел "Проекты" для создания нового проекта.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
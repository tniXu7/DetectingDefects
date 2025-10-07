import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addNotification } from '../store/notificationSlice';
import { listProjects, createProject, Project } from '../api/projects';

// Project interface imported from API

const Projects: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const projectsData = await listProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      dispatch(addNotification({
        message: 'Ошибка загрузки проектов',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
      dispatch(addNotification({
        message: 'Проект успешно создан!',
        type: 'success',
      }));
    } catch (error: any) {
      console.error('Ошибка создания проекта:', error);
      dispatch(addNotification({
        message: error.response?.data?.detail || 'Ошибка создания проекта',
        type: 'error',
      }));
    }
  };

  const canCreateProjects = user?.role === 'manager';

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
          <h1 className="card-title">Проекты</h1>
          {canCreateProjects && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Отмена' : 'Создать проект'}
            </button>
          )}
        </div>

        {showForm && canCreateProjects && (
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="form-group">
              <label className="form-label">Название проекта</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Описание</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Создать проект
            </button>
          </form>
        )}

        {projects.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: '#666' }}>
            <h3>Проекты не найдены</h3>
            <p>Создайте первый проект, чтобы начать работу</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>
                      <strong>{project.name}</strong>
                    </td>
                    <td>{project.description || '-'}</td>
                    <td>
                      {new Date(project.created_at).toLocaleDateString('ru-RU')}
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

export default Projects;
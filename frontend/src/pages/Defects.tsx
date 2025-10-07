import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addNotification } from '../store/notificationSlice';
import { listDefects, createDefect, updateDefect, Defect, DefectCreate } from '../api/defects';
import { listProjects, Project } from '../api/projects';

// Interfaces imported from API modules

const Defects: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [defects, setDefects] = useState<Defect[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 3,
    project_id: 0,
    assigned_to: undefined as number | undefined,
  });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [defectsData, projectsData] = await Promise.all([
        listDefects(),
        listProjects(),
      ]);
      
      setDefects(defectsData);
      setProjects(projectsData);
      
      if (projectsData.length > 0 && formData.project_id === 0) {
        setFormData(prev => ({ ...prev, project_id: projectsData[0].id }));
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      dispatch(addNotification({
        message: 'Ошибка загрузки данных',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDefect(formData as DefectCreate);
      setFormData({
        title: '',
        description: '',
        priority: 3,
        project_id: projects[0]?.id || 0,
        assigned_to: undefined,
      });
      setShowForm(false);
      fetchData();
      dispatch(addNotification({
        message: 'Дефект успешно создан!',
        type: 'success',
      }));
    } catch (error: any) {
      console.error('Ошибка создания дефекта:', error);
      dispatch(addNotification({
        message: error.response?.data?.detail || 'Ошибка создания дефекта',
        type: 'error',
      }));
    }
  };

  const handleStatusUpdate = async (defectId: number, newStatus: string) => {
    try {
      await updateDefect(defectId, { status: newStatus });
      fetchData();
      dispatch(addNotification({
        message: 'Статус дефекта обновлен!',
        type: 'success',
      }));
    } catch (error: any) {
      console.error('Ошибка обновления статуса:', error);
      dispatch(addNotification({
        message: error.response?.data?.detail || 'Ошибка обновления статуса',
        type: 'error',
      }));
    }
  };

  const canUpdateDefects = user?.role === 'engineer' || user?.role === 'manager';

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="text-center">
            <span className="spinner"></span>
            <p className="mt-2">Загрузка дефектов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Дефекты</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Отмена' : 'Добавить дефект'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Название дефекта</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Проект</label>
                <select
                  className="form-select"
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: Number(e.target.value) })}
                  required
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                <label className="form-label">Приоритет</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                >
                  <option value={1}>1 - Критический</option>
                  <option value={2}>2 - Высокий</option>
                  <option value={3}>3 - Средний</option>
                  <option value={4}>4 - Низкий</option>
                  <option value={5}>5 - Очень низкий</option>
                </select>
              </div>
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
              Создать дефект
            </button>
          </form>
        )}

        {defects.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: '#666' }}>
            <h3>Дефекты не найдены</h3>
            <p>Добавьте первый дефект, чтобы начать работу</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Проект</th>
                  <th>Статус</th>
                  <th>Приоритет</th>
                  <th>Дата создания</th>
                  {canUpdateDefects && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {defects.map((defect) => {
                  const project = projects.find(p => p.id === defect.project_id);
                  return (
                    <tr key={defect.id}>
                      <td>{defect.id}</td>
                      <td>
                        <strong>{defect.title}</strong>
                        {defect.description && (
                          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                            {defect.description}
                          </div>
                        )}
                      </td>
                      <td>{project?.name || 'Неизвестный проект'}</td>
                      <td>
                        <span className={`status-badge status-${defect.status.replace('_', '-')}`}>
                          {defect.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge priority-${defect.priority}`}>
                          {defect.priority}
                        </span>
                      </td>
                      <td>
                        {new Date(defect.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      {canUpdateDefects && (
                        <td>
                          <select
                            className="form-select btn-sm"
                            value={defect.status}
                            onChange={(e) => handleStatusUpdate(defect.id, e.target.value)}
                            style={{ width: 'auto', minWidth: '120px' }}
                          >
                            <option value="new">Новый</option>
                            <option value="in_progress">В работе</option>
                            <option value="review">На проверке</option>
                            <option value="closed">Закрыт</option>
                            <option value="canceled">Отменен</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Defects;
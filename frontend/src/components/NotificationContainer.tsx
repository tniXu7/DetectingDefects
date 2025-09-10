import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeNotification } from '../store/notificationSlice';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;

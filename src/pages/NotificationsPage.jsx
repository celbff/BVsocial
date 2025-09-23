import React, { useEffect } from 'react';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'like': return <Heart className="w-full h-full text-red-500" />;
    case 'comment': return <MessageCircle className="w-full h-full text-blue-500" />;
    case 'follow': return <UserPlus className="w-full h-full text-green-500" />;
    default: return null;
  }
};

const NotificationText = ({ notification }) => {
  const baseText = <span className="font-semibold">{notification.sender.username}</span>;
  switch (notification.type) {
    case 'like': return <>{baseText} curtiu sua foto.</>;
    case 'comment': return <>{baseText} comentou sua foto.</>;
    case 'follow': return <>{baseText} começou a seguir você.</>;
    default: return 'Nova notificação.';
  }
};

const NotificationsPage = () => {
  const { notifications, markAllAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
    return () => {
      markAllAsRead();
    };
  }, []);

  const getTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}a`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}min`;
    return `${Math.floor(seconds)}s`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-6"><h1 className="text-2xl font-semibold">Notificações</h1></div>
          <div className="space-y-1">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center p-4 hover:bg-gray-50 transition-colors rounded-lg ${!notification.is_read ? 'bg-blue-50' : ''}`}
              >
                <Link to={`/profile/${notification.sender.username}`} className="flex-shrink-0">
                  <img src={notification.sender.avatar_url} alt={notification.sender.username} className="w-10 h-10 rounded-full mr-3"/>
                </Link>
                <div className="w-6 h-6 mr-3 flex-shrink-0"><NotificationIcon type={notification.type} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><NotificationText notification={notification} /></p>
                  <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notification.created_at)}</p>
                </div>
                {notification.post_id && notification.post?.image_url && (
                  <img src={notification.post.image_url} alt="Post" className="w-12 h-12 rounded object-cover ml-3"/>
                )}
                {!notification.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-3 flex-shrink-0"></div>}
              </motion.div>
            ))}
          </div>
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma notificação por aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

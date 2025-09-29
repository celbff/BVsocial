// src/pages/NotificationsPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (unreadCount > 0 && markAllAsRead) {
      markAllAsRead();
    }
  }, [markAllAsRead]); // ✅ Removido 'unreadCount' para evitar chamadas repetidas

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👥';
      case 'message':
        return '📩';
      default:
        return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 text-xl">
              ←
            </button>
            <h1 className="text-lg font-semibold">Notificações</h1>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-emerald-600 text-sm font-medium"
            >
              Marcar tudo como lido
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔕</div>
            <h2 className="text-lg font-medium text-gray-800">Nenhuma notificação</h2>
            <p className="text-gray-500 mt-2">
              Você será notificado quando alguém interagir com você.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border ${
                  notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{getIcon(notification.type)}</span>
                  <div className="flex-1">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.created_at}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
// src/components/Navbar.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { User, Bell, Home, Search, MessageCircle, Bookmark } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth(); // ✅ usar signOut em vez de logout
  const { unreadCount } = useNotifications();

  const navItems = [
    { icon: Home, path: '/', label: 'Início' },
    { icon: Search, path: '/explore', label: 'Explorar' },
    { icon: MessageCircle, path: '/messages', label: 'Mensagens' },
    { icon: Bookmark, path: '/saved', label: 'Salvos' },
  ];

  // ✅ Obter username do perfil (não do auth.user)
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'usuario';

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md mx-auto">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center text-gray-500 hover:text-emerald-600"
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => navigate(`/profile/${username}`)}
          className="flex flex-col items-center text-gray-500 hover:text-emerald-600"
        >
          <User size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
        
        <button
          onClick={() => navigate('/notifications')}
          className="relative flex flex-col items-center text-gray-500 hover:text-emerald-600"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="text-xs mt-1">Notif.</span>
        </button>
        
        <button
          onClick={signOut}
          className="flex flex-col items-center text-gray-500 hover:text-red-500"
        >
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">S</span>
          </div>
          <span className="text-xs mt-1">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
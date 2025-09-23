import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, MessageCircle, User, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Início' },
    { icon: Search, path: '/explore', label: 'Explorar' },
    { icon: PlusSquare, path: '/create', label: 'Criar' },
    { icon: MessageCircle, path: '/messages', label: 'Mensagens' },
    { icon: Heart, path: '/notifications', label: 'Notificações', notificationCount: unreadCount },
    { icon: MapPin, path: '/map', label: 'Mapa' },
    { icon: User, path: `/profile/${user?.username}`, label: 'Perfil' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:z-50">
        <div className="p-6">
          <Link to="/" className="text-xl font-serif font-bold text-gray-900">
            Bella Vitta
          </Link>
        </div>
        
        <nav className="flex-1 px-4">
          {navItems.map(({ icon: Icon, path, label, notificationCount }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors relative ${
                location.pathname === path
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6 mr-4" />
              <span>{label}</span>
              {notificationCount > 0 && (
                 <span className="absolute left-8 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6 mr-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map(({ icon: Icon, path, notificationCount }) => (
            <Link
              key={path}
              to={path}
              className={`p-3 relative ${
                location.pathname === path ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Icon className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
                {location.pathname === path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;

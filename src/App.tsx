// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import MapPage from './pages/MapPage';
import CreatePostPage from './pages/CreatePostPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SavedPostsPage from './pages/SavedPostsPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/map" element={<MapPage />} />
              
              {/* Rotas protegidas usando layout wrapper */}
              <Route element={<ProtectedRoute />}>
                <Route index element={<HomePage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/messages/*" element={<MessagesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/saved" element={<SavedPostsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
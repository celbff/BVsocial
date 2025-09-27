// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { usePosts } from '../hooks/usePosts';
import { usePWAInstall } from '../hooks/usePWAInstall';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading } = usePosts();
  const { isInstallable, install } = usePWAInstall();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Carregando posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-800">Bella Vitta</h1>
          {user && (
            <button
              onClick={() => navigate('/create')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700"
            >
              Novo Post
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            {user ? 'Nenhum post ainda.' : 'Faça login para ver os posts da comunidade.'}
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>

      {/* Botão flutuante de instalação PWA */}
      {isInstallable && user && (
        <button
          onClick={install}
          className="fixed bottom-20 right-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-emerald-700 transition"
          aria-label="Instalar aplicativo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      )}

      {/* Navbar no rodapé */}
      <Navbar />
    </div>
  );
};

export default HomePage;
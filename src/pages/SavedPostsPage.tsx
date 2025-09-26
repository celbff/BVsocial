// src/pages/SavedPostsPage.tsx
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useSavedPosts } from '../hooks/useSavedPosts';

const SavedPostsPage = () => {
  const navigate = useNavigate();
  const { posts, loading } = useSavedPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 text-xl"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold">Posts Salvos</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Carregando...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📌</div>
            <h2 className="text-lg font-medium text-gray-800">Nenhum post salvo</h2>
            <p className="text-gray-500 mt-2">
              Salve posts que você quer ver depois clicando no ícone de marcador.
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
};

export default SavedPostsPage;
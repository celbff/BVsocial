// src/pages/ExplorePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';

const ExplorePage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            image_url,
            created_at,
            user_id,
            profiles (
              username,
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted = data.map((post: any) => ({
            id: post.id,
            user_id: post.user_id,
            author: post.profiles?.full_name || post.profiles?.username || 'Usuário',
            username: post.profiles?.username || 'usuario',
            avatar: post.profiles?.avatar_url || `https://placehold.co/100x100/10b981/white?text=${(post.profiles?.username || 'U')[0]}`,
            content: post.content,
            image: post.image_url || undefined,
            timestamp: new Date(post.created_at).toLocaleDateString('pt-BR'),
            likes: 0,
            liked: false,
            saved: false,
            comments: [],
          }));
          setPosts(formatted);
        }
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">←</button>
          <h1 className="text-lg font-semibold">Explorar</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Nenhum post encontrado.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
};

export default ExplorePage;
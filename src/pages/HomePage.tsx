// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface Story {
  id: string;
  username: string;
  avatar_url: string;
  isOwn: boolean;
  hasNew: boolean; // Pode vir de uma tabela de "story_views"
}

interface Comment {
  username: string;
  content: string;
}

interface Post {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  liked_by_user: boolean;
  saved_by_user: boolean;
  comments: Comment[];
  location: string | null;
  is_verified: boolean;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca stories (simplificado: apenas perfis públicos)
  const fetchStories = async () => {
    if (!user) return;

    try {
      // Seu próprio perfil
      const { data: ownProfile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      // Outros perfis (ex: seguidos)
      const { data: otherProfiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .neq('id', user.id)
        .limit(4);

      const ownStory: Story = {
        id: user.id,
        username: 'Sua história',
        avatar_url: ownProfile?.avatar_url || '/default-avatar.png',
        isOwn: true,
        hasNew: false, // Pode ser calculado depois
      };

      const otherStories: Story[] = (otherProfiles || []).map(profile => ({
        id: profile.id,
        username: profile.username || 'usuário',
        avatar_url: profile.avatar_url || '/default-avatar.png',
        isOwn: false,
        hasNew: Math.random() > 0.5, // Simulação temporária
      }));

      setStories([ownStory, ...otherStories]);
    } catch (err) {
      console.error('Erro ao buscar stories:', err);
    }
  };

  // Busca posts com likes, saves e comentários
  const fetchPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner(username, avatar_url, is_verified),
          likes_count:likes(count),
          liked_by_user:likes!inner(user_id),
          saved_by_user:saves!inner(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Formata os posts
      const formattedPosts = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        username: post.profiles.username,
        avatar_url: post.profiles.avatar_url || '/default-avatar.png',
        content: post.content,
        image_url: post.image_url,
        created_at: new Date(post.created_at).toLocaleDateString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        likes_count: post.likes_count?.count || 0,
        liked_by_user: post.liked_by_user.length > 0,
        saved_by_user: post.saved_by_user.length > 0,
        comments: [], // Para simplificar; pode buscar separadamente
        location: null,
        is_verified: post.profiles.is_verified || false,
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStories();
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ post_id: postId, user_id: user.id });
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });
      }
      // Atualiza localmente
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked_by_user: !currentlyLiked,
              likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (err) {
      console.error('Erro ao curtir:', err);
    }
  };

  const handleSave = async (postId: string, currentlySaved: boolean) => {
    if (!user) return;

    try {
      if (currentlySaved) {
        await supabase
          .from('saves')
          .delete()
          .match({ post_id: postId, user_id: user.id });
      } else {
        await supabase
          .from('saves')
          .insert({ post_id: postId, user_id: user.id });
      }
      // Atualiza localmente
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, saved_by_user: !currentlySaved }
          : post
      ));
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const MenuFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around py-2 px-4">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center p-2 text-black"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 23H2V9c0-1.1.9-2 2-2h1.3l1.26-2.18c.13-.23.37-.38.64-.38h6.6c.27 0 .51.15.64.38L15.7 7H17c1.1 0 2 .9 2 2v14z" stroke="none"/>
          </svg>
        </button>
        <button
          onClick={() => navigate('/explore')}
          className="flex flex-col items-center justify-center p-2 text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button
          onClick={() => navigate('/create')}
          className="flex flex-col items-center justify-center p-2 text-gray-700"
        >
          <div className="w-6 h-6 border-2 border-gray-700 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 border border-gray-700 rounded-sm"></div>
          </div>
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="flex flex-col items-center justify-center p-2 text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
        <button
          onClick={() => navigate('/profile/me')}
          className="flex flex-col items-center justify-center p-2 text-gray-700"
        >
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </button>
      </div>
    </div>
  );

  const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white border-b-8 border-gray-100 md:border md:border-gray-200 md:rounded-lg md:mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.avatar_url}
              alt={post.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{post.username}</span>
              {post.is_verified && (
                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {post.location && (
              <span className="text-xs text-gray-500">{post.location}</span>
            )}
          </div>
        </div>
        <button className="p-1">
          <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      {/* Post Image */}
      {post.image_url && (
        <div className="w-full aspect-square bg-gray-100">
          <img
            src={post.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
            <button onClick={() => handleLike(post.id, post.liked_by_user)}>
              <svg 
                className={`w-6 h-6 ${post.liked_by_user ? 'text-red-500 fill-current' : 'text-gray-900'}`} 
                fill={post.liked_by_user ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button onClick={() => navigate(`/posts/${post.id}`)}>
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </button>
            <button onClick={() => {
              const url = `${window.location.origin}/posts/${post.id}`;
              navigator.clipboard.writeText(url);
              alert('Link copiado!');
            }}>
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          <button onClick={() => handleSave(post.id, post.saved_by_user)}>
            <svg 
              className={`w-6 h-6 ${post.saved_by_user ? 'text-gray-900 fill-current' : 'text-gray-900'}`} 
              fill={post.saved_by_user ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">{post.likes_count.toLocaleString()} curtidas</span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.username}</span>
          <span className="text-sm">{post.content}</span>
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <div className="mb-2">
            <button 
              onClick={() => navigate(`/posts/${post.id}`)}
              className="text-gray-500 text-sm mb-1"
            >
              Ver todos os {post.comments.length} comentários
            </button>
            {post.comments.slice(0, 2).map((comment, index) => (
              <div key={index} className="mb-1">
                <span className="font-semibold text-sm mr-2">{comment.username}</span>
                <span className="text-sm">{comment.content}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {post.created_at}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
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

      <main className="max-w-md mx-auto md:max-w-2xl">
        {/* Stories Section */}
        <div className="bg-white border-b-8 border-gray-100 md:border-none p-4 md:py-6">
          <div className="flex gap-4 overflow-x-auto">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-16 h-16 rounded-full p-0.5 ${
                  story.hasNew 
                    ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' 
                    : 'bg-gray-300'
                } ${story.isOwn ? 'bg-gray-300' : ''}`}>
                  <div className="w-full h-full rounded-full bg-white p-0.5 relative">
                    <img
                      src={story.avatar_url}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {story.isOwn && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-900 text-center max-w-[60px] truncate">
                  {story.isOwn ? 'Sua história' : story.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="md:mt-6">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Nenhum post ainda</p>
              <p className="text-gray-400 text-sm mt-2">Siga pessoas para ver as publicações delas aqui</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>

      <MenuFooter />
      <Navbar />
    </div>
  );
};

export default HomePage;
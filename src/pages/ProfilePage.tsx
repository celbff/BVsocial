// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  is_verified: boolean;
  is_private: boolean;
  is_own: boolean;
}

interface Post {
  id: string;
  image_url: string;
  likes: number;
  comments: number;
  type: 'image' | 'carousel' | 'video';
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'tagged'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Busca perfil do usuário
  const fetchProfile = async () => {
    if (!username) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          bio,
          website,
          is_verified,
          is_private
        `)
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      // Contagem de posts
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profileData.id);

      // Contagem de seguidores
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileData.id);

      // Contagem de seguindo
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileData.id);

      const isOwn = user?.id === profileData.id;

      // Verifica se o usuário logado segue este perfil
      let followingStatus = false;
      if (user && !isOwn) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', profileData.id)
          .single();

        followingStatus = !!followData;
      }

      setProfile({
        id: profileData.id,
        username: profileData.username,
        full_name: profileData.full_name || profileData.username,
        avatar_url: profileData.avatar_url || '/default-avatar.png',
        bio: profileData.bio || '',
        website: profileData.website || '',
        posts_count: postsCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
        is_verified: profileData.is_verified || false,
        is_private: profileData.is_private || false,
        is_own: isOwn,
      });

      setIsFollowing(followingStatus);
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  };

  // Busca posts do usuário
  const fetchPosts = async () => {
    if (!profile) return;

    try {
      // ✅ CORREÇÃO 1: 'postData' → 'data'
      const { data, error: postError } = await supabase
        .from('posts')
        .select('id, image_url')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (postError) throw postError;

      // Para simplificar, assumimos que todos são 'image'
      // Em produção, você pode ter um campo 'type' na tabela
      // ✅ CORREÇÃO 2: adicionar tipagem explícita a 'post'
      const formattedPosts: Post[] = (data || []).map((post: any) => ({
        id: post.id,
        image_url: post.image_url || '/default-post.png',
        likes: 0, // Pode buscar de uma tabela de likes
        comments: 0, // Pode buscar de uma tabela de comments
        type: 'image',
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, user]);

  useEffect(() => {
    if (profile) {
      fetchPosts();
    }
  }, [profile]);

  const handleFollow = async () => {
    if (!user || !profile || profile.is_own) return;

    try {
      if (isFollowing) {
        // Deixar de seguir
        await supabase
          .from('follows')
          .delete()
          .match({ follower_id: user.id, following_id: profile.id });
      } else {
        // Seguir
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: profile.id });
      }

      // Atualiza localmente
      setIsFollowing(!isFollowing);
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          followers_count: isFollowing 
            ? prev.followers_count - 1 
            : prev.followers_count + 1
        };
      });
    } catch (err) {
      console.error('Erro ao seguir/deixar de seguir:', err);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const MenuFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around py-2 px-4">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center p-2 text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
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
          className="flex flex-col items-center justify-center p-2 text-black"
        >
          <div className="w-6 h-6 rounded-full bg-black"></div>
        </button>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Perfil não encontrado</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-500"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto md:max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Voltar"
              >
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">{profile.username}</h1>
                {profile.is_verified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setShowOptionsModal(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Opções"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-4xl">
        {/* Profile Info */}
        <div className="px-4 py-6">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
              />
            </div>

            {/* Stats & Actions */}
            <div className="flex-1">
              {/* Stats */}
              <div className="flex justify-around mb-4 md:justify-start md:gap-8">
                <div className="text-center md:text-left">
                  <div className="font-semibold text-lg">{formatNumber(profile.posts_count)}</div>
                  <div className="text-gray-600 text-sm">publicações</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-semibold text-lg">{formatNumber(profile.followers_count)}</div>
                  <div className="text-gray-600 text-sm">seguidores</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-semibold text-lg">{formatNumber(profile.following_count)}</div>
                  <div className="text-gray-600 text-sm">seguindo</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {profile.is_own ? (
                  <>
                    <button 
                      onClick={() => navigate('/profile/edit')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Editar perfil
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.username}`);
                        alert('Link copiado!');
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Compartilhar perfil
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleFollow}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                        isFollowing 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-900' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                    <button 
                      onClick={() => navigate(`/messages/${profile.username}`)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Mensagem
                    </button>
                    <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-1">{profile.full_name}</h2>
            <div className="text-gray-900 text-sm whitespace-pre-line mb-2">{profile.bio}</div>
            {profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>

        {/* Highlights Placeholder */}
        <div className="px-4 mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <span className="text-xs text-gray-600">Novo</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 flex items-center justify-center gap-1 ${
                activeTab === 'posts' 
                  ? 'border-t-2 border-gray-900' 
                  : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4zm0 9h7v7H4zm9-9h7v7h-7zm0 9h7v7h-7z"/>
              </svg>
            </button>
            <button 
              onClick={() => setActiveTab('tagged')}
              className={`flex-1 py-3 flex items-center justify-center gap-1 ${
                activeTab === 'tagged' 
                  ? 'border-t-2 border-gray-900' 
                  : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="p-1">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-gray-100 relative cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-6 text-white">
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="font-semibold">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M21,6H3A1,1 0 0,0 2,7V17A1,1 0 0,0 3,18H8.5L12,21.5L15.5,18H21A1,1 0 0,0 22,17V7A1,1 0 0,0 21,6M21,16H14.5L12,18.5L9.5,16H3V8H21V16Z"/>
                        </svg>
                        <span className="font-semibold">{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post type indicators */}
                  {post.type === 'carousel' && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-6L8 13h12l-3.5-5-2.5 3.01L10.5 10z"/>
                        <path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                      </svg>
                    </div>
                  )}
                  
                  {post.type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tagged' && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Nenhuma foto</p>
              <p className="text-gray-400 text-sm mt-2">As fotos em que {profile.username} foi marcado aparecerão aqui</p>
            </div>
          )}
        </div>
      </main>

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
          <div className="bg-white rounded-t-xl md:rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <div className="w-12 h-1 bg-gray-300 rounded mx-auto md:hidden"></div>
            </div>
            <div className="py-2">
              <button 
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.username}`);
                  alert('Link copiado!');
                  setShowOptionsModal(false);
                }}
              >
                <span className="text-gray-900">Copiar link do perfil</span>
              </button>
              <button 
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Perfil de ${profile.username}`,
                      url: `${window.location.origin}/profile/${profile.username}`
                    });
                  }
                  setShowOptionsModal(false);
                }}
              >
                <span className="text-gray-900">Compartilhar perfil</span>
              </button>
              <button className="w-full p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-red-500">Bloquear</span>
              </button>
              <button className="w-full p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-red-500">Denunciar</span>
              </button>
            </div>
            <div className="border-t border-gray-200">
              <button 
                onClick={() => setShowOptionsModal(false)}
                className="w-full p-4 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuFooter />
    </div>
  );
};

export default ProfilePage;
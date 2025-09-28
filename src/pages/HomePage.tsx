import { useState, useEffect } from 'react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);

  // Dados simulados de stories
  const mockStories = [
    {
      id: '1',
      username: 'Sua história',
      avatar: 'keys/user-avatar?prompt=user profile photo instagram style',
      isOwn: true,
      hasNew: false
    },
    {
      id: '2',
      username: 'maria_silva',
      avatar: 'keys/story1?prompt=young woman profile photo instagram story',
      isOwn: false,
      hasNew: true
    },
    {
      id: '3',
      username: 'joao_santos',
      avatar: 'keys/story2?prompt=young man profile photo instagram story',
      isOwn: false,
      hasNew: true
    },
    {
      id: '4',
      username: 'ana_costa',
      avatar: 'keys/story3?prompt=young woman profile photo instagram story',
      isOwn: false,
      hasNew: false
    },
    {
      id: '5',
      username: 'pedro_lima',
      avatar: 'keys/story4?prompt=young man profile photo instagram story',
      isOwn: false,
      hasNew: true
    }
  ];

  // Dados simulados de posts
  const mockPosts = [
    {
      id: '1',
      user_id: '1',
      author: 'Maria Silva',
      username: 'maria_silva',
      avatar: 'keys/avatar1?prompt=young woman profile photo instagram style',
      content: 'Aproveitando esse domingo lindo! ☀️ Nada melhor que um dia na natureza para recarregar as energias. #domingoperfeito #natureza #energia',
      image: 'keys/feed1?prompt=sunny day outdoor lifestyle photo instagram style nature',
      timestamp: '2h',
      likes: 342,
      liked: false,
      saved: false,
      comments: [
        { username: 'joao_santos', comment: 'Que foto linda! 😍' },
        { username: 'ana_costa', comment: 'Lugar incrível! Onde é?' }
      ],
      location: 'Parque Nacional',
      isVerified: false
    },
    {
      id: '2',
      user_id: '2',
      author: 'João Santos',
      username: 'joao_santos',
      avatar: 'keys/avatar2?prompt=young man profile photo instagram style',
      content: 'Finalmente terminei esse projeto que estava trabalhando há semanas! 🎨✨ Cada detalhe foi pensado com muito carinho. O que vocês acham?',
      image: 'keys/feed2?prompt=creative workspace art project instagram style modern design',
      timestamp: '4h',
      likes: 186,
      liked: true,
      saved: false,
      comments: [
        { username: 'maria_silva', comment: 'Ficou perfeito! Parabéns 👏' },
        { username: 'camila_rocha', comment: 'Amei as cores!' }
      ],
      location: null,
      isVerified: true
    },
    {
      id: '3',
      user_id: '3',
      author: 'Ana Costa',
      username: 'ana_costa',
      avatar: 'keys/avatar3?prompt=young woman profile photo instagram style',
      content: 'Começando o dia com essa delícia! ☕️🥐 Café da manhã é sagrado na minha rotina. Quem mais é team café?',
      image: 'keys/feed3?prompt=aesthetic breakfast coffee instagram style cozy morning',
      timestamp: '6h',
      likes: 521,
      liked: false,
      saved: true,
      comments: [
        { username: 'pedro_lima', comment: 'Que delícia! Onde é esse café?' },
        { username: 'rafael_alves', comment: 'Team café sempre! ☕️' }
      ],
      location: 'Café do Centro',
      isVerified: false
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStories(mockStories);
      setPosts(mockPosts);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved }
        : post
    ));
  };

  const MenuFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around py-2 px-4">
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 23H2V9c0-1.1.9-2 2-2h1.3l1.26-2.18c.13-.23.37-.38.64-.38h6.6c.27 0 .51.15.64.38L15.7 7H17c1.1 0 2 .9 2 2v14z" stroke="none"/>
            <path d="M20 7h-3L15.3 4.5C15.17 4.19 14.86 4 14.5 4h-5c-.36 0-.67.19-.8.5L7 7H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <div className="w-6 h-6 border-2 border-gray-700 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 border border-gray-700 rounded-sm"></div>
          </div>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </button>
      </div>
    </div>
  );

  const PostCard = ({ post }) => (
    <div className="bg-white border-b-8 border-gray-100 md:border md:border-gray-200 md:rounded-lg md:mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.avatar}
              alt={post.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{post.username}</span>
              {post.isVerified && (
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
      <div className="w-full aspect-square bg-gray-100">
        <img
          src={post.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
            <button onClick={() => handleLike(post.id)}>
              <svg 
                className={`w-6 h-6 ${post.liked ? 'text-red-500 fill-current' : 'text-gray-900'}`} 
                fill={post.liked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button>
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </button>
            <button>
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          <button onClick={() => handleSave(post.id)}>
            <svg 
              className={`w-6 h-6 ${post.saved ? 'text-gray-900 fill-current' : 'text-gray-900'}`} 
              fill={post.saved ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">{post.likes.toLocaleString()} curtidas</span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.username}</span>
          <span className="text-sm">{post.content}</span>
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <div className="mb-2">
            <button className="text-gray-500 text-sm mb-1">
              Ver todos os {post.comments.length} comentários
            </button>
            {post.comments.slice(0, 2).map((comment, index) => (
              <div key={index} className="mb-1">
                <span className="font-semibold text-sm mr-2">{comment.username}</span>
                <span className="text-sm">{comment.comment}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {post.timestamp}
        </div>
      </div>
    </div>
  );
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:bg-white pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto md:max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => console.log('Voltar')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors md:hidden"
              >
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-emerald-800 md:text-xl">Bella Vitta</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </button>
            </div>
          </div>
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
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img
                      src={story.avatar}
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
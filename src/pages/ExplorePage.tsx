import { useState, useEffect } from 'react';  // Removido 'React' da importação

interface Post {
  id: string;
  user_id: string;
  author: string;
  username: string;
  avatar: string;
  content: string;
  image: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: number;
  views: number;
}

const ExplorePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Simular dados de posts com imagens
  const mockPosts: Post[] = [
    {
      id: '1',
      user_id: '1',
      author: 'Maria Silva',
      username: 'maria_silva',
      avatar: 'keys/avatar1?prompt=young woman profile photo instagram style',
      content: 'Aproveitando o dia ensolarado! ☀️',
      image: 'keys/explore1?prompt=sunny day outdoor lifestyle photo instagram style',
      timestamp: '2024-01-15',
      likes: 342,
      liked: false,
      saved: false,
      comments: 12,
      views: 1250
    },
    {
      id: '2',
      user_id: '2',
      author: 'João Santos',
      username: 'joao_santos',
      avatar: 'keys/avatar2?prompt=young man profile photo instagram style',
      content: 'Novo projeto concluído! 🎨',
      image: 'keys/explore2?prompt=creative workspace art project instagram style',
      timestamp: '2024-01-14',
      likes: 186,
      liked: true,
      saved: false,
      comments: 8,
      views: 890
    },
    {
      id: '3',
      user_id: '3',
      author: 'Ana Costa',
      username: 'ana_costa',
      avatar: 'keys/avatar3?prompt=young woman profile photo instagram style',
      content: 'Café da manhã perfeito! ☕',
      image: 'keys/explore3?prompt=aesthetic breakfast coffee instagram style',
      timestamp: '2024-01-13',
      likes: 521,
      liked: false,
      saved: true,
      comments: 23,
      views: 2100
    },
    {
      id: '4',
      user_id: '4',
      author: 'Pedro Lima',
      username: 'pedro_lima',
      avatar: 'keys/avatar4?prompt=young man profile photo instagram style',
      content: 'Vista incrível da cidade 🏙️',
      image: 'keys/explore4?prompt=city skyline view instagram style',
      timestamp: '2024-01-12',
      likes: 765,
      liked: false,
      saved: false,
      comments: 31,
      views: 3200
    },
    {
      id: '5',
      user_id: '5',
      author: 'Camila Rocha',
      username: 'camila_rocha',
      avatar: 'keys/avatar5?prompt=young woman profile photo instagram style',
      content: 'Momento de relaxamento 🧘‍♀️',
      image: 'keys/explore5?prompt=yoga meditation wellness instagram style',
      timestamp: '2024-01-11',
      likes: 294,
      liked: true,
      saved: true,
      comments: 15,
      views: 980
    },
    {
      id: '6',
      user_id: '6',
      author: 'Rafael Alves',
      username: 'rafael_alves',
      avatar: 'keys/avatar6?prompt=young man profile photo instagram style',
      content: 'Treino concluído! 💪',
      image: 'keys/explore6?prompt=fitness gym workout instagram style',
      timestamp: '2024-01-10',
      likes: 445,
      liked: false,
      saved: false,
      comments: 18,
      views: 1560
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
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
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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

  const PostModal = ({ post, onClose }: { post: Post | null; onClose: () => void }) => {
    if (!post) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-2/3 bg-black flex items-center justify-center">
            <img
              src={post.image}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Content Section */}
          <div className="md:w-1/3 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-sm">{post.username}</span>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Caption */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex gap-3 mb-4">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <span className="font-semibold text-sm">{post.username}</span>
                  <span className="text-sm ml-2">{post.content}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4">
                  <button onClick={() => handleLike(post.id)}>
                    <svg 
                      className={`w-6 h-6 ${post.liked ? 'text-red-500 fill-current' : 'text-gray-700'}`} 
                      fill={post.liked ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                  <button>
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </button>
                  <button>
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
                <button onClick={() => handleSave(post.id)}>
                  <svg 
                    className={`w-6 h-6 ${post.saved ? 'text-gray-900 fill-current' : 'text-gray-700'}`} 
                    fill={post.saved ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="text-sm font-semibold mb-1">
                {post.likes.toLocaleString()} curtidas
              </div>
              
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {post.timestamp}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto md:max-w-6xl px-4 py-3">
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
              <h1 className="text-lg font-semibold text-gray-900">Explorar</h1>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none text-sm placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-6xl px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Nenhum post encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente pesquisar por algo diferente</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-gray-100 relative cursor-pointer group overflow-hidden"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.image}
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
                
                {/* Multiple images indicator */}
                {post.id === '1' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-6L8 13h12l-3.5-5-2.5 3.01L10.5 10z"/>
                      <path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                    </svg>
                  </div>
                )}
                
                {/* Video indicator */}
                {post.id === '4' && (
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
      </main>

      <MenuFooter />
      <PostModal post={selectedPost} onClose={handleCloseModal} />
    </div>
  );
};

import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  user_id: string;
  author: string;
  username: string;
  avatar: string;
  content: string;
  image: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: number;
  views: number;
}

const ExplorePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Simular dados de posts com imagens
  const mockPosts: Post[] = [
    {
      id: '1',
      user_id: '1',
      author: 'Maria Silva',
      username: 'maria_silva',
      avatar: 'keys/avatar1?prompt=young woman profile photo instagram style',
      content: 'Aproveitando o dia ensolarado! ☀️',
      image: 'keys/explore1?prompt=sunny day outdoor lifestyle photo instagram style',
      timestamp: '2024-01-15',
      likes: 342,
      liked: false,
      saved: false,
      comments: 12,
      views: 1250
    },
    {
      id: '2',
      user_id: '2',
      author: 'João Santos',
      username: 'joao_santos',
      avatar: 'keys/avatar2?prompt=young man profile photo instagram style',
      content: 'Novo projeto concluído! 🎨',
      image: 'keys/explore2?prompt=creative workspace art project instagram style',
      timestamp: '2024-01-14',
      likes: 186,
      liked: true,
      saved: false,
      comments: 8,
      views: 890
    },
    {
      id: '3',
      user_id: '3',
      author: 'Ana Costa',
      username: 'ana_costa',
      avatar: 'keys/avatar3?prompt=young woman profile photo instagram style',
      content: 'Café da manhã perfeito! ☕',
      image: 'keys/explore3?prompt=aesthetic breakfast coffee instagram style',
      timestamp: '2024-01-13',
      likes: 521,
      liked: false,
      saved: true,
      comments: 23,
      views: 2100
    },
    {
      id: '4',
      user_id: '4',
      author: 'Pedro Lima',
      username: 'pedro_lima',
      avatar: 'keys/avatar4?prompt=young man profile photo instagram style',
      content: 'Vista incrível da cidade 🏙️',
      image: 'keys/explore4?prompt=city skyline view instagram style',
      timestamp: '2024-01-12',
      likes: 765,
      liked: false,
      saved: false,
      comments: 31,
      views: 3200
    },
    {
      id: '5',
      user_id: '5',
      author: 'Camila Rocha',
      username: 'camila_rocha',
      avatar: 'keys/avatar5?prompt=young woman profile photo instagram style',
      content: 'Momento de relaxamento 🧘‍♀️',
      image: 'keys/explore5?prompt=yoga meditation wellness instagram style',
      timestamp: '2024-01-11',
      likes: 294,
      liked: true,
      saved: true,
      comments: 15,
      views: 980
    },
    {
      id: '6',
      user_id: '6',
      author: 'Rafael Alves',
      username: 'rafael_alves',
      avatar: 'keys/avatar6?prompt=young man profile photo instagram style',
      content: 'Treino concluído! 💪',
      image: 'keys/explore6?prompt=fitness gym workout instagram style',
      timestamp: '2024-01-10',
      likes: 445,
      liked: false,
      saved: false,
      comments: 18,
      views: 1560
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
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
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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

  const PostModal = ({ post, onClose }: { post: Post | null; onClose: () => void }) => {
    if (!post) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-2/3 bg-black flex items-center justify-center">
            <img
              src={post.image}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Content Section */}
          <div className="md:w-1/3 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-sm">{post.username}</span>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Caption */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex gap-3 mb-4">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <span className="font-semibold text-sm">{post.username}</span>
                  <span className="text-sm ml-2">{post.content}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4">
                  <button onClick={() => handleLike(post.id)}>
                    <svg 
                      className={`w-6 h-6 ${post.liked ? 'text-red-500 fill-current' : 'text-gray-700'}`} 
                      fill={post.liked ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                  <button>
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </button>
                  <button>
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
                <button onClick={() => handleSave(post.id)}>
                  <svg 
                    className={`w-6 h-6 ${post.saved ? 'text-gray-900 fill-current' : 'text-gray-700'}`} 
                    fill={post.saved ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="text-sm font-semibold mb-1">
                {post.likes.toLocaleString()} curtidas
              </div>
              
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {post.timestamp}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto md:max-w-6xl px-4 py-3">
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
              <h1 className="text-lg font-semibold text-gray-900">Explorar</h1>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none text-sm placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-6xl px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Nenhum post encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente pesquisar por algo diferente</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-gray-100 relative cursor-pointer group overflow-hidden"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.image}
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
                
                {/* Multiple images indicator */}
                {post.id === '1' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-6L8 13h12l-3.5-5-2.5 3.01L10.5 10z"/>
                      <path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                    </svg>
                  </div>
                )}
                
                {/* Video indicator */}
                {post.id === '4' && (
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
      </main>

      <MenuFooter />
      <PostModal post={selectedPost} onClose={handleCloseModal} />
    </div>
  );
};

export default ExplorePage;
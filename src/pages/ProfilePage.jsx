import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Bookmark, Tag, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

  const fetchProfileData = async () => {
    if (!username || !currentUser) return;
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching profile:', profileError);
      setProfile(null);
      setLoading(false);
      return;
    }
    
    setProfile({
      ...profileData,
      name: profileData.full_name,
      avatar: profileData.avatar_url,
      bio: profileData.website || 'Bem-vindo ao meu perfil!',
    });

    const { data: postsData } = await supabase
      .from('posts')
      .select('*, likes(count), comments(count)')
      .eq('user_id', profileData.id)
      .order('created_at', { ascending: false });
    setPosts(postsData || []);

    const { data: followersCount } = await supabase.rpc('get_followers_count', { p_user_id: profileData.id });
    const { data: followingCount } = await supabase.rpc('get_following_count', { p_user_id: profileData.id });
    
    setStats({
      posts: postsData?.length || 0,
      followers: followersCount || 0,
      following: followingCount || 0,
    });

    if (profileData.id !== currentUser.id) {
      const { data: followCheck, error: followCheckError } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', currentUser.id)
        .eq('following_id', profileData.id)
        .single();
      setIsFollowing(!!followCheck);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!profile || profile.id === currentUser.id) return;

    const currentlyFollowing = isFollowing;
    setIsFollowing(!currentlyFollowing);
    setStats(prev => ({ ...prev, followers: prev.followers + (currentlyFollowing ? -1 : 1) }));

    if (currentlyFollowing) {
      await supabase.from('followers').delete().match({ follower_id: currentUser.id, following_id: profile.id });
    } else {
      await supabase.from('followers').insert({ follower_id: currentUser.id, following_id: profile.id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Navbar />
        <div className="lg:ml-64 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Navbar />
        <div className="lg:ml-64 flex-1 flex items-center justify-center">
            <p className="text-gray-500">Perfil não encontrado.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = profile.id === currentUser?.id;

  const tabs = [
    { id: 'posts', icon: Grid, label: 'Posts' },
    { id: 'saved', icon: Bookmark, label: 'Salvos' },
    { id: 'tagged', icon: Tag, label: 'Marcações' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-8">
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <img src={profile.avatar} alt={profile.username} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover bg-gray-200" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                <h1 className="text-2xl font-light">{profile.username}</h1>
                
                {isOwnProfile ? (
                  <div className="flex space-x-2 mt-2 md:mt-0 justify-center">
                    <button className="bg-gray-100 text-black px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">Editar perfil</button>
                  </div>
                ) : (
                  <div className="flex space-x-2 mt-2 md:mt-0 justify-center">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleFollow}
                      className={`px-8 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        isFollowing ? 'bg-gray-100 text-black hover:bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}>
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </motion.button>
                    <button className="bg-gray-100 text-black px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">Mensagem</button>
                  </div>
                )}
              </div>

              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <span><strong>{stats.posts}</strong> publicações</span>
                <span><strong>{stats.followers}</strong> seguidores</span>
                <span><strong>{stats.following}</strong> seguindo</span>
              </div>

              <div className="text-sm">
                <p className="font-semibold">{profile.name}</p>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="flex justify-center space-x-16">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-1 py-4 text-xs font-semibold uppercase tracking-wider border-t-2 transition-colors ${
                    activeTab === id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 md:gap-4 mt-4">
            {posts.map((post) => (
              <motion.div key={post.id} whileHover={{ scale: 1.05 }} className="aspect-square bg-gray-200 cursor-pointer relative group">
                <img src={post.image_url} alt="Post" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity flex space-x-4">
                    <span className="flex items-center">
                      <span className="mr-1">❤️</span> {post.likes[0]?.count || 0}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">💬</span> {post.comments[0]?.count || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {activeTab === 'posts' && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="border-2 border-dashed rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold">Nenhuma Publicação</h3>
              {isOwnProfile && <p className="text-gray-500 mt-2">Compartilhe sua primeira foto.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

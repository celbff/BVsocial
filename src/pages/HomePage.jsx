import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Stories from '../components/Stories';
import Post from '../components/Post';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { faker } from '@faker-js/faker/locale/pt_BR';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);

    // 1. Obter a lista de IDs de usuários que o usuário atual segue
    const { data: followingData, error: followingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', user.id);

    if (followingError) {
      console.error('Error fetching following list:', followingError);
      setLoading(false);
      return;
    }

    const followingIds = followingData.map(f => f.following_id);
    // Incluir o próprio usuário no feed
    followingIds.push(user.id);

    // 2. Buscar posts desses usuários
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, created_at, image_url, caption, location, user_id,
        profiles ( id, username, avatar_url ),
        likes ( count ),
        comments ( id, text, created_at, profiles ( username, avatar_url ) )
      `)
      .in('user_id', followingIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    // Gerar dados fake para stories (será substituído no futuro)
    const generateStories = () => {
      const fakeStories = Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        user: {
          username: faker.internet.userName(),
          avatar: `https://images.unsplash.com/photo-${faker.number.int({ min: 1500000000000, max: 1700000000000 })}?w=150&h=150&fit=crop&crop=face`
        },
        unread: faker.datatype.boolean()
      }));
      setStories(fakeStories);
    };

    generateStories();
  }, [user]);

  const handleAddStory = () => {
    alert('Funcionalidade de adicionar story será implementada!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Stories stories={stories} onAddStory={handleAddStory} />

          {loading ? (
             <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
             </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {posts.map((post) => (
                <Post key={post.id} post={post} onUpdate={fetchPosts} />
              ))}
            </motion.div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold">Bem-vindo à Bella Vitta!</h2>
                <p className="text-gray-500 mt-2">Siga outros usuários para ver o que eles compartilham ou explore novos conteúdos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

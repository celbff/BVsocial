import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, likes(count), comments(count)')
        .order('created_at', { ascending: false })
        .limit(21);

      if (error) {
        console.error('Error fetching explore posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchExplorePosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    (post.caption || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`relative cursor-pointer group ${
                  index % 7 === 0 ? 'col-span-2 row-span-2' : 'aspect-square'
                }`}
              >
                <img
                  src={post.image_url}
                  alt="Explorar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity flex space-x-4">
                    <span className="flex items-center">
                      <span className="mr-1">❤️</span>
                      {post.likes[0]?.count || 0}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">💬</span>
                      {post.comments[0]?.count || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum resultado encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

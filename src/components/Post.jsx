import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Post = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.[0]?.count || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkLiked = async () => {
      if (!user || !post) return;
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single();
      
      setLiked(!!data);
    };
    checkLiked();
  }, [post.id, user]);

  const handleLike = async () => {
    if (!user) return;
    
    const newLikedState = !liked;
    setLiked(newLikedState);

    if (newLikedState) {
      setLikeCount(prev => prev + 1);
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
    } else {
      setLikeCount(prev => prev - 1);
      await supabase.from('likes').delete().match({ post_id: post.id, user_id: user.id });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: post.id, user_id: user.id, text: newComment.trim() })
      .select('*, profiles(username, avatar_url)')
      .single();

    if (error) {
      console.error('Error adding comment', error);
    } else {
      setComments(prev => [...prev, data]);
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}a`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}m`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}min`;
    return `${Math.floor(seconds)}s`;
  };

  return (
    <motion.div 
      className="bg-white border border-gray-200 rounded-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src={post.profiles.avatar_url}
            alt={post.profiles.username}
            className="w-10 h-10 rounded-full mr-3 bg-gray-200"
          />
          <div>
            <p className="font-semibold text-sm">{post.profiles.username}</p>
            {post.location && <p className="text-gray-500 text-xs">{post.location}</p>}
          </div>
        </div>
        <button>
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.image_url}
          alt="Post"
          className="w-full h-auto max-h-[70vh] object-contain bg-black"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`${liked ? 'text-red-500' : 'text-gray-700'}`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            <button onClick={() => document.getElementById(`comment-input-${post.id}`).focus()}>
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </button>
            <button>
              <Send className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <motion.button whileTap={{ scale: 0.9 }}>
            <Bookmark className="w-6 h-6 text-gray-700" />
          </motion.button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">
          {likeCount} curtidas
        </p>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.profiles.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2"
          >
            {showComments ? 'Ocultar comentários' : `Ver todos os ${comments.length} comentários`}
          </button>
        )}

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 max-h-40 overflow-y-auto"
            >
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start text-sm">
                  <span className="font-semibold mr-2">{comment.profiles.username}</span>
                  <span>{comment.text}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time */}
        <p className="text-gray-400 text-xs uppercase mt-2">{getTimeAgo(post.created_at)}</p>
      </div>
      
      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="border-t border-gray-200 px-4 py-2 flex items-center">
        <input
          id={`comment-input-${post.id}`}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="text-blue-500 font-semibold text-sm disabled:text-blue-200"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </motion.div>
  );
};

export default Post;

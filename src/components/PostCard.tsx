// src/components/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: Comment[];
  timestamp: string;
  user_id: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments);

  // Sincroniza estado com props (útil em atualizações realtime)
  useEffect(() => {
    setLiked(post.liked);
    setLikesCount(post.likes);
    setSaved(post.saved);
    setComments(post.comments);
  }, [post]);

  const handleLike = async () => {
    if (!user) return;

    if (liked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ user_id: user.id, post_id: post.id });
      if (!error) {
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, post_id: post.id });
      if (!error) {
        setLiked(true);
        setLikesCount(prev => prev + 1);
        if (post.user_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            type: 'like',
            message: `${user.user_metadata.full_name || user.email?.split('@')[0]} curtiu seu post.`,
          });
        }
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (saved) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .match({ user_id: user.id, post_id: post.id });
      if (!error) setSaved(false);
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert({ user_id: user.id, post_id: post.id });
      if (!error) setSaved(true);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const { error } = await supabase.from('comments').insert({
      post_id: post.id,
      user_id: user.id,
      content: commentText.trim(),
    });

    if (!error) {
      setCommentText('');
      if (post.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          type: 'comment',
          message: `${user.user_metadata.full_name || user.email?.split('@')[0]} comentou em seu post.`,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 flex items-center space-x-3">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{post.author}</h3>
          <p className="text-xs text-gray-500">@{post.username} · {post.timestamp}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2 flex justify-between border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          disabled={!user}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm">{likesCount}</span>
        </button>

        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm">{comments.length}</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center space-x-1 ${saved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={saved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 max-h-40 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-2 last:mb-0">
              <p className="text-sm">
                <span className="font-semibold">{comment.author}:</span>{' '}
                <span>{comment.text}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <form onSubmit={handleComment} className="p-4 border-t border-gray-100 flex space-x-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={user ? "Escreva um comentário..." : "Faça login para comentar..."}
          className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={!user}
        />
        <button
          type="submit"
          disabled={!user || !commentText.trim()}
          className="text-sm bg-emerald-600 text-white px-4 rounded-full hover:bg-emerald-700 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default PostCard;
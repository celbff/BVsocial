// src/hooks/useSavedPosts.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../components/PostCard';

export const useSavedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setPosts([]);
        setLoading(false);
        return;
      }
      const user = data.user;

      const { data: savedData, error: savedError } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id);

      if (savedError) throw savedError;

      const postIds = savedData.map((s: any) => s.post_id);
      if (postIds.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const { data: postData, error: postError } = await supabase
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
        .in('id', postIds)
        .order('created_at', { ascending: false });

      if (postError) throw postError;

      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id);
      // Na linha 58:
      const likedPostIds = new Set((likesData || []).map((l: any) => l.post_id));
      const { data: allLikes } = await supabase
        .from('likes')
        .select('post_id')
        .in('post_id', postIds);
      const likesCountMap = (allLikes || []).reduce((acc: Record<string, number>, like: any) => {
        acc[like.post_id] = (acc[like.post_id] || 0) + 1;
        return acc;
      }, {});

      const { data: comments } = await supabase
        .from('comments')
        .select(`
          id,
          post_id,
          content,
          created_at,
          user_id,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
        .in('post_id', postIds)
        .order('created_at', { ascending: true });

      const commentsMap = (comments || []).reduce((acc: Record<string, any[]>, comment: any) => {
        if (!acc[comment.post_id]) acc[comment.post_id] = [];
        acc[comment.post_id].push(comment);
        return acc;
      }, {});

      const formattedPosts = postData.map((post: any) => {
        const author = post.profiles;
        const postComments = commentsMap[post.id] || [];
        return {
          id: post.id,
          user_id: post.user_id,
          author: author?.full_name || author?.username || 'Usuário',
          username: author?.username || 'usuario',
          avatar: author?.avatar_url || `https://placehold.co/100x100/10b981/white?text=${(author?.username || 'U')[0]}`,
          content: post.content,
          image: post.image_url || undefined,
          timestamp: new Date(post.created_at).toLocaleDateString('pt-BR'),
          likes: likesCountMap[post.id] || 0,
          liked: likedPostIds.has(post.id),
          saved: true,
          comments: postComments.map((c: any) => ({
            id: c.id,
            author: c.profiles?.full_name || c.profiles?.username || 'Alguém',
            avatar: c.profiles?.avatar_url || `https://placehold.co/40x40/3b82f6/white?text=${(c.profiles?.username || 'A')[0]}`,
            text: c.content,
            timestamp: new Date(c.created_at).toLocaleDateString('pt-BR'),
          })),
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Erro ao carregar posts salvos:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();

    const savedChannel = supabase
      .channel('saved-posts-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'saved_posts' },
        () => fetchSavedPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(savedChannel);
    };
  }, []);

  return { posts, loading };
};
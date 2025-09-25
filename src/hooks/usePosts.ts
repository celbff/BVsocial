// src/hooks/usePosts.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../components/PostCard';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const {  {  { user } } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Busca posts + perfis dos autores
      const {  {  postData, error: postError } } = await supabase
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
        .order('created_at', { ascending: false });

      if (postError) throw postError;

      // IDs dos posts
      const postIds = postData.map((p: any) => p.id);

      // Likes
      let likesData: any[] = [];
      let likesCountMap: Record<string, number> = {};
      if (postIds.length > 0) {
        const {  { data: allLikes } } = await supabase
          .from('likes')
          .select('post_id');
        likesCountMap = allLikes.reduce((acc: Record<string, number>, like: any) => {
          acc[like.post_id] = (acc[like.post_id] || 0) + 1;
          return acc;
        }, {});

        if (userId) {
          const {  { data } } = await supabase
            .from('likes')
            .select('post_id')
            .eq('user_id', userId);
          likesData = data || [];
        }
      }

      const likedPostIds = new Set(likesData.map((like: any) => like.post_id));

      // Salvos
      let savedPostIds = new Set<string>();
      if (userId && postIds.length > 0) {
        const {  { data: savedData } } = await supabase
          .from('saved_posts')
          .select('post_id')
          .in('post_id', postIds)
          .eq('user_id', userId);
        savedPostIds = new Set(savedData.map((s: any) => s.post_id));
      }

      // Comentários
      let commentsMap: Record<string, any[]> = {};
      if (postIds.length > 0) {
        const {  { data: comments } } = await supabase
          .from('comments')
          .select(`
            id,
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

        commentsMap = comments.reduce((acc: Record<string, any[]>, comment: any) => {
          const postId = comment.post_id;
          if (!acc[postId]) acc[postId] = [];
          acc[postId].push(comment);
          return acc;
        }, {});
      }

      // Formata posts
      const formattedPosts = postData.map((post: any) => {
        const author = post.profiles;
        const comments = commentsMap[post.id] || [];
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
          saved: savedPostIds.has(post.id),
          comments: comments.map((c: any) => ({
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
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Realtime: escuta mudanças
    const postsChannel = supabase
      .channel('posts-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, fetchPosts)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe();

    const likesChannel = supabase
      .channel('likes-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, fetchPosts)
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, fetchPosts)
      .subscribe();

    const savedChannel = supabase
      .channel('saved-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_posts' }, fetchPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(savedChannel);
    };
  }, []);

  return { posts, loading, refetch: fetchPosts };
};
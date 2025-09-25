// src/hooks/useMessages.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Message = {
  id: string;
  sender_id: string;
  sender: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  content: string;
  created_at: string;
  is_own: boolean;
};

export const useMessages = (otherUserId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!otherUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const {  {  { user } } } = await supabase.auth.getUser();
      if (!user) return;

      const {  {  { data, error } } } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          content,
          created_at,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formatted = data.map((m: any) => ({
        id: m.id,
        sender_id: m.sender_id,
        sender: {
          username: m.profiles?.username || 'Usuário',
          full_name: m.profiles?.full_name || 'Usuário',
          avatar_url: m.profiles?.avatar_url || `https://placehold.co/40x40/3b82f6/white?text=${m.profiles?.username?.[0] || 'U'}`,
        },
        content: m.content,
        created_at: new Date(m.created_at).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        is_own: m.sender_id === user.id,
      }));

      setMessages(formatted);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!otherUserId) return;

    const channel = supabase
      .channel(`messages-${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId})`,
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [otherUserId]);

  return { messages, loading, refetch: fetchMessages };
};
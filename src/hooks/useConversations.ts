// src/hooks/useConversations.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Conversation = {
  id: string;
  other_user_id: string;
  other_user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  last_message?: string;
  last_message_at?: string;
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const {  {  { user } } } = await supabase.auth.getUser();
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Busca mensagens onde o usuário é remetente ou destinatário
      const {  {  { data: messages, error } } } = await supabase
        .rpc('get_user_conversations', { current_user_id: user.id });

      if (error) throw error;

      const formatted = messages.map((m: any) => ({
        id: m.other_user_id,
        other_user_id: m.other_user_id,
        other_user: {
          username: m.username,
          full_name: m.full_name,
          avatar_url: m.avatar_url || `https://placehold.co/100x100/3b82f6/white?text=${m.username?.[0] || 'U'}`,
        },
        last_message: m.last_message,
        last_message_at: m.last_message_at
          ? new Date(m.last_message_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
      }));

      setConversations(formatted);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { conversations, loading };
};
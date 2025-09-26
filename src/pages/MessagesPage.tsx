// src/pages/MessagesPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useConversations } from '../hooks/useConversations';
import { useMessages, Message } from '../hooks/useMessages';

const MessagesPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, loading: loadingConversations } = useConversations();
  const { messages, loading: loadingMessages } = useMessages(userId || null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !user || !newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: userId,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage('');
      // Notificação opcional
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'message',
        message: `${user.user_metadata.full_name || 'Alguém'} te enviou uma mensagem.`,
      });
    }
  };

  const activeConversation = conversations.find(c => c.other_user_id === userId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Lista de conversas */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold">Mensagens</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-gray-500">Carregando...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-gray-500">Nenhuma conversa ainda.</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.other_user_id}
                onClick={() => navigate(`/messages/${conv.other_user_id}`)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  userId === conv.other_user_id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={conv.other_user.avatar_url}
                    alt={conv.other_user.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{conv.other_user.full_name}</p>
                    <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                  </div>
                  {conv.last_message_at && (
                    <span className="text-xs text-gray-400">{conv.last_message_at}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        {userId ? (
          <>
            {/* Header da conversa */}
            <div className="bg-white p-4 border-b border-gray-200">
              {activeConversation ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={activeConversation.other_user.avatar_url}
                    alt={activeConversation.other_user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h2 className="font-semibold">{activeConversation.other_user.full_name}</h2>
                </div>
              ) : (
                <h2 className="font-semibold">Selecione uma conversa</h2>
              )}
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {loadingMessages ? (
                <div className="text-center py-4 text-gray-500">Carregando mensagens...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Inicie uma conversa!</div>
              ) : (
                messages.map((msg: Message) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.is_own && (
                      <img
                        src={msg.sender.avatar_url}
                        alt={msg.sender.full_name}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                    )}
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                        msg.is_own
                          ? 'bg-emerald-500 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.is_own ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {msg.created_at}
                      </p>
                    </div>
                    {msg.is_own && <div className="w-8"></div>}
                  </div>
                ))
              )}
            </div>

            {/* Input de nova mensagem */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-emerald-600 text-white px-4 rounded-full hover:bg-emerald-700 disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Selecione uma conversa para começar a conversar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, Phone, Video, Info, ArrowLeft, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const { userId: selectedUserId } = useParams();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Fetch all conversation partners
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      setLoadingConversations(true);
      const { data, error } = await supabase.rpc('get_conversations', { p_user_id: user.id });
      
      if (error) {
        console.error("Error fetching conversations:", error);
      } else {
        setConversations(data);
        // If a user is selected in the URL, find and set them as the active conversation
        if (selectedUserId) {
          const currentConv = data.find(c => c.user_id === selectedUserId);
          setSelectedConversation(currentConv);
        }
      }
      setLoadingConversations(false);
    };

    fetchConversations();
  }, [user, selectedUserId]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      };
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`(sender_id.eq.${user.id},and(receiver_id.eq.${selectedConversation.user_id})), (sender_id.eq.${selectedConversation.user_id},and(receiver_id.eq.${user.id}))`)
        .order('created_at', { ascending: true });
      
      if (error) console.error("Error fetching messages:", error);
      else setMessages(data);
      setLoadingMessages(false);
    };
    fetchMessages();
  }, [selectedConversation, user.id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!selectedConversation) return;

    const channel = supabase.channel(`messages:${user.id}:${selectedConversation.user_id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id},and(sender_id=eq.${selectedConversation.user_id})`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [selectedConversation, user.id]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    const content = newMessage.trim();
    setNewMessage('');

    // Optimistically update UI
    const tempMessage = {
      id: Math.random(),
      sender_id: user.id,
      receiver_id: selectedConversation.user_id,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    const { error } = await supabase
      .from('messages')
      .insert({ sender_id: user.id, receiver_id: selectedConversation.user_id, content });
      
    if (error) {
      console.error("Error sending message:", error);
      // Revert optimistic update on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      alert("Erro ao enviar mensagem.");
    }
  };
  
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    navigate(`/messages/${conv.user_id}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="flex h-screen border-t border-gray-200">
          {/* Sidebar */}
          <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedConversation && 'hidden md:flex'}`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{user.username}</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="p-4 text-center text-gray-500">Carregando conversas...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Nenhuma conversa encontrada.</div>
              ) : (
               conversations.map((conv) => (
                <motion.button key={conv.user_id} whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 flex items-center text-left hover:bg-gray-50 ${selectedConversation?.user_id === conv.user_id ? 'bg-gray-100' : ''}`}>
                  <img src={conv.avatar_url} alt={conv.username} className="w-12 h-12 rounded-full mr-3"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{conv.username}</p>
                    <p className="text-xs text-gray-500">Última mensagem: {new Date(conv.last_message_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </motion.button>
              )))}
            </div>
          </div>

          {/* Chat Window */}
          <AnimatePresence>
            {selectedConversation ? (
              <motion.div
                key={selectedConversation.user_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <button onClick={() => navigate('/messages')} className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20}/></button>
                    <Link to={`/profile/${selectedConversation.username}`} className="flex items-center">
                      <img src={selectedConversation.avatar_url} alt={selectedConversation.username} className="w-10 h-10 rounded-full mr-3"/>
                      <div><p className="font-semibold">{selectedConversation.username}</p></div>
                    </Link>
                  </div>
                  <div className="flex space-x-2 text-gray-600">
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Info className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                     <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                     </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm break-words">{message.content}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center space-x-4 bg-white">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Enviar mensagem..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 bg-gray-50"/>
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={!newMessage.trim()}
                    className="p-3 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors">
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle size={48} className="mx-auto text-gray-300"/>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">Suas Mensagens</h3>
                  <p className="text-gray-500 mt-1">Selecione uma conversa para começar a conversar.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

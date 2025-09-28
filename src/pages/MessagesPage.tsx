<<<<<<< HEAD
import { useState, useEffect } from 'react';

interface OtherUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_online: boolean;
}

interface Conversation {
  id: string;
  other_user_id: string;
  other_user: OtherUser;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_own: boolean;
}

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Dados simulados
  const mockConversations: Conversation[] = [
    {
      id: '1',
      other_user_id: '1',
      other_user: {
        id: '1',
        username: 'maria_silva',
        full_name: 'Maria Silva',
        avatar_url: 'keys/user1?prompt=young woman profile photo instagram style',
        is_online: true
      },
      last_message: 'Oi! Como você está?',
      last_message_at: '2h',
      unread_count: 2
    },
    {
      id: '2',
      other_user_id: '2',
      other_user: {
        id: '2',
        username: 'joao_santos',
        full_name: 'João Santos',
        avatar_url: 'keys/user2?prompt=young man profile photo instagram style',
        is_online: false
      },
      last_message: 'Obrigado pela dica!',
      last_message_at: '1d',
      unread_count: 0
    },
    {
      id: '3',
      other_user_id: '3',
      other_user: {
        id: '3',
        username: 'ana_costa',
        full_name: 'Ana Costa',
        avatar_url: 'keys/user3?prompt=young woman profile photo instagram style',
        is_online: true
      },
      last_message: 'Vamos marcar um café? ☕️',
      last_message_at: '3d',
      unread_count: 1
    }
  ];

  const mockMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        sender_id: '1',
        content: 'Oi! Como você está?',
        created_at: '2024-01-15T10:00:00Z',
        is_own: false
      },
      {
        id: '2',
        sender_id: 'current',
        content: 'Oi Maria! Tudo bem, e você?',
        created_at: '2024-01-15T10:01:00Z',
        is_own: true
      },
      {
        id: '3',
        sender_id: '1',
        content: 'Tudo ótimo! Vi suas fotos das viagens, que lugares incríveis! 😍',
        created_at: '2024-01-15T10:02:00Z',
        is_own: false
      }
    ],
    '2': [
      {
        id: '4',
        sender_id: 'current',
        content: 'Que bom que gostou da dica!',
        created_at: '2024-01-14T14:00:00Z',
        is_own: true
      },
      {
        id: '5',
        sender_id: '2',
        content: 'Obrigado pela dica!',
        created_at: '2024-01-14T14:30:00Z',
        is_own: false
      }
    ],
    '3': [
      {
        id: '6',
        sender_id: '3',
        content: 'Vamos marcar um café? ☕️',
        created_at: '2024-01-12T16:00:00Z',
        is_own: false
      }
    ]
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setConversations(mockConversations);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.other_user_id] || []);
    
    // No mobile, ocultar lista quando selecionar conversa
    if (isMobileView) {
      setIsMobileView(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: 'current',
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      is_own: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const MenuFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around py-2 px-4">
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <div className="w-6 h-6 border-2 border-gray-700 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 border border-gray-700 rounded-sm"></div>
          </div>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Mobile: Lista de conversas ou chat */}
      {isMobileView ? (
        <>
          {/* Header Mobile */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => console.log('Voltar')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <h1 className="text-lg font-semibold text-gray-900">Mensagens</h1>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Lista de Conversas Mobile */}
          <div className="flex-1">
            {conversations.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">Suas mensagens</p>
                <p className="text-gray-400 text-sm mt-2">Envie mensagens privadas para um amigo ou grupo</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={conv.other_user.avatar_url}
                      alt={conv.other_user.full_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {conv.other_user.is_online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 truncate">{conv.other_user.username}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.last_message_at}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                      {conv.unread_count > 0 && (
                        <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Desktop: Layout lado a lado */
        <div className="flex h-screen">
          {/* Sidebar: Lista de conversas */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Mensagens</h1>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedConversation?.id === conv.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.other_user.avatar_url}
                      alt={conv.other_user.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.other_user.is_online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 truncate">{conv.other_user.username}</p>
                      <span className="text-xs text-gray-500">{conv.last_message_at}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                      {conv.unread_count > 0 && (
                        <div className="w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat principal */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header da conversa */}
                <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
                  <img
                    src={selectedConversation.other_user.avatar_url}
                    alt={selectedConversation.other_user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.other_user.username}</h2>
                    {selectedConversation.other_user.is_online && (
                      <p className="text-xs text-green-500">Online</p>
                    )}
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.is_own
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de mensagem */}
                <div className="bg-white p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite uma mensagem..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl">Suas mensagens</p>
                  <p className="text-gray-400 text-sm mt-2">Envie mensagens privadas para um amigo ou grupo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Individual Mobile */}
      {!isMobileView && selectedConversation && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
            <button 
              onClick={() => setIsMobileView(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <img
              src={selectedConversation.other_user.avatar_url}
              alt={selectedConversation.other_user.full_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{selectedConversation.other_user.username}</h2>
              {selectedConversation.other_user.is_online && (
                <p className="text-xs text-green-500">Online</p>
              )}
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.is_own
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de mensagem */}
          <div className="bg-white p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      <MenuFooter />
    </div>
  );
};

=======
import { useState, useEffect } from 'react';

interface OtherUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_online: boolean;
}

interface Conversation {
  id: string;
  other_user_id: string;
  other_user: OtherUser;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_own: boolean;
}

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Dados simulados
  const mockConversations: Conversation[] = [
    {
      id: '1',
      other_user_id: '1',
      other_user: {
        id: '1',
        username: 'maria_silva',
        full_name: 'Maria Silva',
        avatar_url: 'keys/user1?prompt=young woman profile photo instagram style',
        is_online: true
      },
      last_message: 'Oi! Como você está?',
      last_message_at: '2h',
      unread_count: 2
    },
    {
      id: '2',
      other_user_id: '2',
      other_user: {
        id: '2',
        username: 'joao_santos',
        full_name: 'João Santos',
        avatar_url: 'keys/user2?prompt=young man profile photo instagram style',
        is_online: false
      },
      last_message: 'Obrigado pela dica!',
      last_message_at: '1d',
      unread_count: 0
    },
    {
      id: '3',
      other_user_id: '3',
      other_user: {
        id: '3',
        username: 'ana_costa',
        full_name: 'Ana Costa',
        avatar_url: 'keys/user3?prompt=young woman profile photo instagram style',
        is_online: true
      },
      last_message: 'Vamos marcar um café? ☕️',
      last_message_at: '3d',
      unread_count: 1
    }
  ];

  const mockMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        sender_id: '1',
        content: 'Oi! Como você está?',
        created_at: '2024-01-15T10:00:00Z',
        is_own: false
      },
      {
        id: '2',
        sender_id: 'current',
        content: 'Oi Maria! Tudo bem, e você?',
        created_at: '2024-01-15T10:01:00Z',
        is_own: true
      },
      {
        id: '3',
        sender_id: '1',
        content: 'Tudo ótimo! Vi suas fotos das viagens, que lugares incríveis! 😍',
        created_at: '2024-01-15T10:02:00Z',
        is_own: false
      }
    ],
    '2': [
      {
        id: '4',
        sender_id: 'current',
        content: 'Que bom que gostou da dica!',
        created_at: '2024-01-14T14:00:00Z',
        is_own: true
      },
      {
        id: '5',
        sender_id: '2',
        content: 'Obrigado pela dica!',
        created_at: '2024-01-14T14:30:00Z',
        is_own: false
      }
    ],
    '3': [
      {
        id: '6',
        sender_id: '3',
        content: 'Vamos marcar um café? ☕️',
        created_at: '2024-01-12T16:00:00Z',
        is_own: false
      }
    ]
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setConversations(mockConversations);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.other_user_id] || []);
    
    // No mobile, ocultar lista quando selecionar conversa
    if (isMobileView) {
      setIsMobileView(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: 'current',
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      is_own: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const MenuFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around py-2 px-4">
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <div className="w-6 h-6 border-2 border-gray-700 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 border border-gray-700 rounded-sm"></div>
          </div>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Mobile: Lista de conversas ou chat */}
      {isMobileView ? (
        <>
          {/* Header Mobile */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => console.log('Voltar')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <h1 className="text-lg font-semibold text-gray-900">Mensagens</h1>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Lista de Conversas Mobile */}
          <div className="flex-1">
            {conversations.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">Suas mensagens</p>
                <p className="text-gray-400 text-sm mt-2">Envie mensagens privadas para um amigo ou grupo</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={conv.other_user.avatar_url}
                      alt={conv.other_user.full_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {conv.other_user.is_online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 truncate">{conv.other_user.username}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.last_message_at}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                      {conv.unread_count > 0 && (
                        <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Desktop: Layout lado a lado */
        <div className="flex h-screen">
          {/* Sidebar: Lista de conversas */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Mensagens</h1>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedConversation?.id === conv.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.other_user.avatar_url}
                      alt={conv.other_user.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.other_user.is_online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 truncate">{conv.other_user.username}</p>
                      <span className="text-xs text-gray-500">{conv.last_message_at}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                      {conv.unread_count > 0 && (
                        <div className="w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat principal */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header da conversa */}
                <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
                  <img
                    src={selectedConversation.other_user.avatar_url}
                    alt={selectedConversation.other_user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.other_user.username}</h2>
                    {selectedConversation.other_user.is_online && (
                      <p className="text-xs text-green-500">Online</p>
                    )}
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.is_own
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de mensagem */}
                <div className="bg-white p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite uma mensagem..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl">Suas mensagens</p>
                  <p className="text-gray-400 text-sm mt-2">Envie mensagens privadas para um amigo ou grupo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Individual Mobile */}
      {!isMobileView && selectedConversation && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
            <button 
              onClick={() => setIsMobileView(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <img
              src={selectedConversation.other_user.avatar_url}
              alt={selectedConversation.other_user.full_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{selectedConversation.other_user.username}</h2>
              {selectedConversation.other_user.is_online && (
                <p className="text-xs text-green-500">Online</p>
              )}
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.is_own
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de mensagem */}
          <div className="bg-white p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      <MenuFooter />
    </div>
  );
};

>>>>>>> 147c96675ed3d33f3ef6f393346a34f96ae65ba2
export default MessagesPage;
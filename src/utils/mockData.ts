// src/utils/mockData.ts
export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
};

export type Post = {
  id: string;
  author: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: Comment[];
  timestamp: string;
};

export const initialPosts: Post[] = [
  {
    id: '1',
    author: 'Bella Vitta Oficial',
    username: 'bellavitta',
    avatar: 'https://placehold.co/100x100/10b981/white?text=BV',
    content: 'Novos serviços disponíveis em Araraquara! Confira nossa agenda de atendimento para esta semana. 💚',
    image: 'https://placehold.co/600x400/10b981/white?text=Serviços+Bella+Vitta',
    likes: 24,
    liked: false,
    saved: false,
    comments: [
      { id: 'c1', author: 'Ana Silva', avatar: 'https://placehold.co/40x40/f59e0b/white?text=A', text: 'Adorei!', timestamp: '2h' },
      { id: 'c2', author: 'Carlos Mendes', avatar: 'https://placehold.co/40x40/8b5cf6/white?text=C', text: 'Vou agendar!', timestamp: '1h' },
    ],
    timestamp: '3h',
  },
  {
    id: '2',
    author: 'Equipe Bella Vitta',
    username: 'equipebv',
    avatar: 'https://placehold.co/100x100/059669/white?text=EQ',
    content: 'Agradecemos a todos que participaram do nosso evento de beleza no último sábado! 🌸',
    likes: 42,
    liked: true,
    saved: true,
    comments: [],
    timestamp: '1 dia',
  },
];
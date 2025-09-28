import { ArrowLeft, Grid3X3, Bookmark, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

const SavedPostsPage = () => {
  const [posts, setPosts] = React.useState([
    {
      id: 1,
      user: { name: 'joao_silva', avatar: 'keys/avatar1?prompt=professional headshot of a young man' },
      image: 'keys/post1?prompt=beautiful landscape photography with mountains and lake',
      likes: 1250,
      caption: 'Vista incrível das montanhas! #natureza #paisagem'
    },
    {
      id: 2,
      user: { name: 'maria_foto', avatar: 'keys/avatar2?prompt=professional headshot of a young woman photographer' },
      image: 'keys/post2?prompt=modern architecture building with glass facade',
      likes: 892,
      caption: 'Arquitetura moderna em seu melhor! #arquitetura #design'
    },
    {
      id: 3,
      user: { name: 'chef_carlos', avatar: 'keys/avatar3?prompt=professional headshot of a chef' },
      image: 'keys/post3?prompt=gourmet food plating on white plate',
      likes: 2105,
      caption: 'Novo prato da temporada 👨‍🍳 #gastronomia #chef'
    }
  ]);
  const [loading, setLoading] = React.useState(false);

  const PostCard = ({ post }) => (
    <div className="bg-white border-b border-gray-200 mb-0">
      {/* Header do Post */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">{post.user.name}</span>
        </div>
        <MoreHorizontal size={20} className="text-gray-600" />
      </div>

      {/* Imagem do Post */}
      <div className="w-full aspect-square">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ações do Post */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <Heart size={24} className="text-gray-900 hover:text-red-500 cursor-pointer" />
            <MessageCircle size={24} className="text-gray-900 cursor-pointer" />
            <Share size={24} className="text-gray-900 cursor-pointer" />
          </div>
          <Bookmark size={24} className="text-gray-900 fill-current cursor-pointer" />
        </div>

        <div className="text-sm font-semibold mb-1">{post.likes.toLocaleString()} curtidas</div>
        
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.user.name}</span>
          {post.caption}
        </div>
      </div>
    </div>
  );

  const FooterMenu = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <div className="flex flex-col items-center py-2">
          <Grid3X3 size={24} className="text-gray-900" />
        </div>
        <div className="flex flex-col items-center py-2">
          <Heart size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <MessageCircle size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <Bookmark size={24} className="text-gray-900 fill-current" />
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-1"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Posts Salvos</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto pb-20">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-gray-900 flex items-center justify-center mb-6">
              <Bookmark size={32} className="text-gray-900" />
            </div>
            <h2 className="text-xl font-light text-gray-900 mb-2">Salvar</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Salve fotos e vídeos que você quer ver novamente. Ninguém será notificado e só você poderá ver o que salvou.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Footer Menu */}
      <FooterMenu />
    </div>
  );
};

export default SavedPostsPage;
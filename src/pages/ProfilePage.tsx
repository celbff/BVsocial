// src/pages/ProfilePage.tsx
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile'; // ✅ Removido 'Profile' não usado
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: loadingProfile, error, updateProfile, uploadAvatar } = useProfile(username || '');
  const { posts, loading: loadingPosts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', username: '' });
  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ Removido estado de avatarFile não usado

  const isOwnProfile = user?.id === profile?.id;

  const handleEdit = () => {
    if (profile) {
      setEditData({ full_name: profile.full_name, username: profile.username });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editData.full_name.trim()) return;
    const success = await updateProfile({
      full_name: editData.full_name.trim(),
      username: editData.username.trim(),
    });
    if (success) setIsEditing(false);
  };

  const userPosts = posts.filter((post) => post.user_id === profile?.id);

  if (loadingProfile) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">←</button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profile?.avatar_url}
                alt={profile?.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              {isOwnProfile && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1 shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadAvatar(e.target.files[0]);
                  }
                }}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    placeholder="Nome completo"
                  />
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    placeholder="Username"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold">{profile?.full_name}</h1>
                  <p className="text-gray-600">@{profile?.username}</p>
                  {isOwnProfile && (
                    <button
                      onClick={handleEdit}
                      className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Editar perfil
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loadingPosts ? (
          <p className="text-center text-gray-500">Carregando posts...</p>
        ) : userPosts.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Nenhum post ainda.</p>
        ) : (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
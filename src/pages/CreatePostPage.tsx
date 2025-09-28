import React, { useState } from 'react';

const CreatePostPage = () => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'edit' | 'share'>('select'); // 'select', 'edit', 'share'

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione uma imagem válida (JPEG, PNG, etc.).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStep('edit');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setStep('select');
  };

  const handleNext = () => {
    if (step === 'edit') {
      setStep('share');
    }
  };

  const handleBack = () => {
    if (step === 'share') {
      setStep('edit');
    } else if (step === 'edit') {
      setStep('select');
      handleRemoveImage();
    } else {
      // Voltar para página anterior
      console.log('Navegando para página anterior');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !imageFile) {
      setError('Adicione um texto ou uma imagem.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Simular upload e criação do post
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpar e simular redirecionamento
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      setStep('select');
      
      alert('Post publicado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar post:', err);
      setError('Erro ao publicar. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const MenuFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around py-3">
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

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto md:max-w-4xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {step === 'select' && 'Nova publicação'}
              {step === 'edit' && 'Recortar'}
              {step === 'share' && 'Nova publicação'}
            </h1>
          </div>
          
          {step === 'edit' && (
            <button 
              onClick={handleNext}
              className="text-blue-500 font-semibold text-sm hover:text-blue-600"
            >
              Avançar
            </button>
          )}
          
          {step === 'share' && (
            <button 
              onClick={handleSubmit}
              disabled={uploading}
              className="text-blue-500 font-semibold text-sm hover:text-blue-600 disabled:opacity-50"
            >
              {uploading ? 'Publicando...' : 'Compartilhar'}
            </button>
          )}
        </div>
      </header>

      <div className="max-w-md mx-auto md:max-w-4xl md:mt-8 bg-white md:rounded-lg md:shadow-sm md:border border-gray-200">
        {/* Select Image Step */}
        {step === 'select' && (
          <div className="min-h-[60vh] md:min-h-[500px] flex flex-col items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-light text-gray-900 mb-2">Arrastar fotos e vídeos aqui</h2>
              <p className="text-gray-500 text-sm mb-8">Suas fotos e vídeos serão exibidos aqui</p>
              
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors">
                  Selecionar do computador
                </div>
              </label>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Image Step */}
        {step === 'edit' && imagePreview && (
          <div className="aspect-square bg-black relative overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Edit Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </button>
                <button className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Step */}
        {step === 'share' && (
          <div className="md:flex">
            {/* Image Preview */}
            {imagePreview && (
              <div className="aspect-square md:w-1/2 bg-black">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Caption Section */}
            <div className={`p-4 ${imagePreview ? 'md:w-1/2' : 'w-full'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">U</span>
                </div>
                <span className="font-semibold text-sm">usuario</span>
              </div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva uma legenda..."
                className="w-full min-h-[120px] resize-none border-none outline-none text-sm placeholder-gray-400"
                maxLength={2200}
              />
              
              <div className="text-right text-xs text-gray-400 mt-2">
                {content.length}/2.200
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm">Adicionar local</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm">Marcar pessoas</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm">Configurações avançadas</p>
                    <p className="text-xs text-gray-400">Ocultar contagem de curtidas e visualizações</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <MenuFooter />
    </div>
  );
};

export default CreatePostPage;
<<<<<<< HEAD
import React from 'react';
import { ArrowLeft, MapPin, Navigation, Share2, Heart, MessageCircle, Grid3X3, Bookmark, ExternalLink } from 'lucide-react';

const MapPage = () => {
  const [loading, setLoading] = React.useState(true);
  const mapEmbedUrl = "https://www.google.com/maps/d/u/0/embed?mid=1XFELlB7i9JmH3FVd6wR3O8HQ1nAdTSo&ehbc=2E312F";

  const handleMapLoad = () => {
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bella Vitta - Mapa de Atendimento',
        text: 'Confira nossa área de cobertura em Araraquara/SP',
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleOpenInMaps = () => {
    window.open('https://maps.google.com/maps?q=Araraquara,+SP', '_blank');
  };

  const FooterMenu = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <div className="flex flex-col items-center py-2">
          <Grid3X3 size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <Heart size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <MessageCircle size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <Bookmark size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <MapPin size={24} className="text-gray-900 fill-current" />
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
          <h1 className="text-lg font-semibold text-gray-900">Mapa</h1>
          <button
            onClick={handleShare}
            className="p-1"
          >
            <Share2 size={24} className="text-gray-900" />
          </button>
        </div>
      </header>

      {/* Business Info */}
      <div className="bg-white border-b border-gray-200 p-4 max-w-lg mx-auto">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">BV</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">Bella Vitta</h2>
            <p className="text-gray-600 text-sm">Serviços e Vendas</p>
            <div className="flex items-center space-x-1 mt-1">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-gray-500 text-sm">Araraquara, São Paulo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <main className="max-w-lg mx-auto pb-20">
        <div className="relative bg-gray-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="text-sm text-gray-600">Carregando mapa...</span>
              </div>
            </div>
          )}
          
          <div className="w-full h-96 md:h-[500px]">
            <iframe
              title="Bella Vitta - Mapa de Serviços"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleMapLoad}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Map Info */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Área de Atendimento</h3>
          <p className="text-gray-600 text-sm mb-4">
            Visualize nossa área de cobertura e pontos de interesse em Araraquara e região.
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleOpenInMaps}
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
            >
              <Navigation size={16} />
              <span>Abrir no Maps</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Detalhes da Localização</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Araraquara, São Paulo</div>
                <div className="text-gray-500">Região central do interior paulista</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Navigation size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Cobertura</div>
                <div className="text-gray-500">Atendemos toda a região metropolitana</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white p-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium text-gray-900 text-sm">Status do Serviço</span>
            </div>
            <p className="text-gray-600 text-sm">
              Atendimento ativo em toda a região. Entre em contato para mais informações sobre disponibilidade.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Menu */}
      <FooterMenu />
    </div>
  );
};

=======
import React from 'react';
import { ArrowLeft, MapPin, Navigation, Share2, Heart, MessageCircle, Grid3X3, Bookmark, ExternalLink } from 'lucide-react';

const MapPage = () => {
  const [loading, setLoading] = React.useState(true);
  const mapEmbedUrl = "https://www.google.com/maps/d/u/0/embed?mid=1XFELlB7i9JmH3FVd6wR3O8HQ1nAdTSo&ehbc=2E312F";

  const handleMapLoad = () => {
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bella Vitta - Mapa de Atendimento',
        text: 'Confira nossa área de cobertura em Araraquara/SP',
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleOpenInMaps = () => {
    window.open('https://maps.google.com/maps?q=Araraquara,+SP', '_blank');
  };

  const FooterMenu = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <div className="flex flex-col items-center py-2">
          <Grid3X3 size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <Heart size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <MessageCircle size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <Bookmark size={24} className="text-gray-400" />
        </div>
        <div className="flex flex-col items-center py-2">
          <MapPin size={24} className="text-gray-900 fill-current" />
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
          <h1 className="text-lg font-semibold text-gray-900">Mapa</h1>
          <button
            onClick={handleShare}
            className="p-1"
          >
            <Share2 size={24} className="text-gray-900" />
          </button>
        </div>
      </header>

      {/* Business Info */}
      <div className="bg-white border-b border-gray-200 p-4 max-w-lg mx-auto">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">BV</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">Bella Vitta</h2>
            <p className="text-gray-600 text-sm">Serviços e Vendas</p>
            <div className="flex items-center space-x-1 mt-1">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-gray-500 text-sm">Araraquara, São Paulo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <main className="max-w-lg mx-auto pb-20">
        <div className="relative bg-gray-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="text-sm text-gray-600">Carregando mapa...</span>
              </div>
            </div>
          )}
          
          <div className="w-full h-96 md:h-[500px]">
            <iframe
              title="Bella Vitta - Mapa de Serviços"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleMapLoad}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Map Info */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Área de Atendimento</h3>
          <p className="text-gray-600 text-sm mb-4">
            Visualize nossa área de cobertura e pontos de interesse em Araraquara e região.
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleOpenInMaps}
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
            >
              <Navigation size={16} />
              <span>Abrir no Maps</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Detalhes da Localização</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Araraquara, São Paulo</div>
                <div className="text-gray-500">Região central do interior paulista</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Navigation size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Cobertura</div>
                <div className="text-gray-500">Atendemos toda a região metropolitana</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white p-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium text-gray-900 text-sm">Status do Serviço</span>
            </div>
            <p className="text-gray-600 text-sm">
              Atendimento ativo em toda a região. Entre em contato para mais informações sobre disponibilidade.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Menu */}
      <FooterMenu />
    </div>
  );
};

>>>>>>> 147c96675ed3d33f3ef6f393346a34f96ae65ba2
export default MapPage;
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MapPin, Users, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useSubscription } from '../contexts/SubscriptionContext';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const { hasFeature } = useSubscription();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Gerar localizações fake
    const fakeLocations = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: faker.location.street(),
      description: faker.lorem.sentence(),
      coordinates: [
        faker.location.latitude({ min: -30, max: 5 }),
        faker.location.longitude({ min: -75, max: -30 })
      ],
      posts: faker.number.int({ min: 1, max: 50 }),
      visitors: faker.number.int({ min: 10, max: 1000 }),
      lastUpdate: faker.date.recent(),
      image: `https://images.unsplash.com/photo-${faker.number.int({ min: 1500000000000, max: 1700000000000 })}?w=300&h=200&fit=crop`
    }));
    
    setLocations(fakeLocations);
  }, []);

  if (!hasFeature('map_access')) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="lg:ml-64 pb-16 lg:pb-0">
          <div className="flex items-center justify-center h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200"
            >
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Acesso Premium Necessário
              </h2>
              <p className="text-gray-600 mb-6">
                O mapa interativo está disponível apenas para usuários Premium.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/subscription'}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Assinar Premium
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Localizações
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Descubra lugares incríveis compartilhados pela comunidade
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {locations.map((location) => (
                <motion.button
                  key={location.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                    selectedLocation?.id === location.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{location.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{location.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location.posts} posts
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {location.visitors}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {location.lastUpdate.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              center={[-14.235, -51.9253]}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.coordinates}
                  eventHandlers={{
                    click: () => setSelectedLocation(location)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{location.posts} posts</span>
                        <span>{location.visitors} visitantes</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-1000">
              <h3 className="font-semibold text-sm mb-2">Filtros</h3>
              <div className="space-y-2">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Mais visitados
                </label>
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  Recentes
                </label>
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  Perto de mim
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import DonationModal from './DonationModal';

const DonationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 z-40"
        aria-label="Apoiar o criador do app"
      >
        <Heart className="w-6 h-6" />
      </button>

      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default DonationButton;
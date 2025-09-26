import React, { useState } from 'react';
import { X, Heart, Coffee } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [customValue, setCustomValue] = useState<string>('');
  const pixKey = "lunara_terapias@jim.com";
  const qrBaseUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=";

  const suggestedValues = [5, 10, 20];

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      alert(`Chave PIX copiada: ${pixKey}`);
    } catch {
      alert(`Não foi possível copiar. Copie manualmente: ${pixKey}`);
    }
  };

  const handleValueSelect = (value: number) => {
    setCustomValue(value.toString());
  };

  const handleOpenQR = () => {
    const qrUrl = qrBaseUrl + encodeURIComponent(pixKey);
    window.open(qrUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Apoie este projeto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Este app não foi feito por robôs (ainda) — foi no suor, dedicação e algumas horas de café.
          Se quiser retribuir, aceitamos PIX! Cada apoio ajuda a manter o projeto firme e forte no condomínio.
          <Coffee className="inline w-4 h-4 ml-1" />
        </p>

        {/* Suggested Values */}
        <div className="flex gap-2 mb-4">
          {suggestedValues.map((value) => (
            <button
              key={value}
              onClick={() => handleValueSelect(value)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 py-3 px-4 rounded-lg cursor-pointer transition-colors font-medium"
            >
              R$ {value}
            </button>
          ))}
        </div>

        {/* Custom Value */}
        <div className="mb-4">
          <label htmlFor="customValue" className="block text-sm font-medium text-gray-700 mb-2">
            Ou escolha o valor do seu cafézinho <Coffee className="inline w-4 h-4" />:
          </label>
          <input
            type="number"
            id="customValue"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Digite o valor"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* PIX Key */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Chave PIX:</div>
          <div className="text-gray-800 font-mono text-sm break-all">{pixKey}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleCopyPix}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Copiar chave PIX
          </button>
          <button
            onClick={handleOpenQR}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Abrir QR Code
          </button>
        </div>

        {/* Thank you message */}
        <p className="text-center text-sm text-gray-500">
          Obrigado! Sua ajuda mantém este projeto vivo. 🚀
        </p>
      </div>
    </div>
  );
};

export default DonationModal;
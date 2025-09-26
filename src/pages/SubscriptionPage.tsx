// src/pages/SubscriptionPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    try {
      // Simular inscrição
      console.log('Inscrição no plano:', plan);
      alert(`Inscrição no plano ${plan} realizada com sucesso!`);
      navigate('/');
    } catch (error) {
      console.error('Erro na inscrição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">←</button>
          <h1 className="text-lg font-semibold">Planos</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Escolha seu plano</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">Básico</h3>
              <p className="text-gray-600 text-sm mt-1">Acesso limitado</p>
              <button
                onClick={() => handleSubscribe('basic')}
                disabled={loading}
                className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm"
              >
                Selecionar
              </button>
            </div>

            <div className="border-2 border-emerald-500 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-700">Premium</h3>
              <p className="text-gray-600 text-sm mt-1">Todos os recursos</p>
              <button
                onClick={() => handleSubscribe('premium')}
                disabled={loading}
                className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm hover:bg-emerald-700"
              >
                {loading ? 'Processando...' : 'Selecionar'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
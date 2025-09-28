import React from 'react';
import { ArrowLeft, Check, Crown, Star, Zap, Heart, MessageCircle, Grid3X3, Bookmark } from 'lucide-react';

const SubscriptionPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('premium');

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      // Simular inscrição
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Inscrição no plano ${plan} realizada com sucesso!`);
    } catch (error) {
      console.error('Erro na inscrição:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'Grátis',
      description: 'Para começar',
      features: [
        '10 posts por mês',
        'Filtros básicos',
        'Stories básicos',
        'Suporte por email'
      ],
      color: 'gray',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Mais popular',
      features: [
        'Posts ilimitados',
        'Todos os filtros',
        'Stories avançados',
        'Analytics detalhados',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      color: 'purple',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 39,90',
      period: '/mês',
      description: 'Para profissionais',
      features: [
        'Tudo do Premium',
        'Agendamento de posts',
        'Múltiplas contas',
        'API avançada',
        'Suporte 24/7',
        'Badge verificado'
      ],
      color: 'gold',
      popular: false
    }
  ];

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
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-1"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Planos</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 px-4 py-8">
        <div className="max-w-lg mx-auto text-center text-white">
          <Crown size={48} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Libere todo o potencial</h2>
          <p className="text-purple-100 text-sm">
            Escolha o plano perfeito para você e leve sua experiência para o próximo nível
          </p>
        </div>
      </div>

      {/* Plans */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-20">
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${
                selectedPlan === plan.id
                  ? plan.color === 'purple'
                    ? 'border-purple-500 shadow-purple-100'
                    : plan.color === 'gold'
                    ? 'border-yellow-500 shadow-yellow-100'
                    : 'border-gray-900 shadow-gray-100'
                  : 'border-gray-200'
              } ${plan.popular ? 'scale-105' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Star size={12} />
                    <span>MAIS POPULAR</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <span>{plan.name}</span>
                      {plan.color === 'purple' && <Zap size={20} className="text-purple-600" />}
                      {plan.color === 'gold' && <Crown size={20} className="text-yellow-600" />}
                    </h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                    {plan.period && (
                      <div className="text-sm text-gray-500">{plan.period}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check size={16} className={`${
                        plan.color === 'purple' ? 'text-purple-600' :
                        plan.color === 'gold' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? plan.color === 'purple'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : plan.color === 'gold'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-900 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </div>
                  ) : selectedPlan === plan.id ? (
                    'Selecionar Plano'
                  ) : (
                    'Escolher'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Pagamento seguro e criptografado</span>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-blue-500 underline">Termos de Serviço</a>{' '}
            e{' '}
            <a href="#" className="text-blue-500 underline">Política de Privacidade</a>
          </p>
        </div>
      </main>

      {/* Footer Menu */}
      <FooterMenu />
    </div>
  );
};

export default SubscriptionPage;
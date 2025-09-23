import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useSubscription } from '../contexts/SubscriptionContext';
import { motion } from 'framer-motion';

const SubscriptionPage = () => {
  const { subscription, subscribe, loading: subLoading } = useSubscription();
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: 'basic', name: 'Básico', price: 'Grátis', description: 'Para usuários casuais', features: ['Posts ilimitados', 'Stories básicos', 'Mensagens diretas'], popular: false },
    { id: 'premium', name: 'Premium', price: 'R$ 19,90/mês', description: 'Para criadores de conteúdo', features: ['Tudo do Básico', 'Acesso ao Mapa Interativo', 'Analytics avançados', 'Suporte prioritário'], popular: true },
    { id: 'business', name: 'Business', price: 'R$ 49,90/mês', description: 'Para empresas', features: ['Tudo do Premium', 'Múltiplas contas', 'Agendamento de posts', 'Relatórios detalhados'], popular: false }
  ];

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      await subscribe(plan);
      alert('Assinatura ativada com sucesso!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-gray-900 mb-4">Escolha seu plano</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-gray-600">Desbloqueie recursos exclusivos.</motion.p>
            
            {subLoading ? <div className="mt-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div></div> :
             subscription && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg inline-block">
                <p className="text-green-800 font-semibold flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Plano atual: {subscription.plan}
                </p>
                <p className="text-green-600 text-sm">Válida até: {new Date(subscription.end_date).toLocaleDateString('pt-BR')}</p>
              </motion.div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${plan.popular ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Mais Popular</span></div>}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> <span className="text-sm">{feature}</span></li>
                  ))}
                </ul>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSubscribe(plan)}
                  disabled={loading || plan.id === 'basic' || subscription?.plan === plan.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}>
                  {loading ? 'Processando...' : subscription?.plan === plan.id ? 'Plano Atual' : plan.id === 'basic' ? 'Padrão' : 'Assinar Agora'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

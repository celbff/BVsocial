// src/contexts/SubscriptionContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type Subscription = {
  id: string;
  user_id: string;
  plan: 'basic' | 'premium' | 'business';
  status: 'active' | 'canceled' | 'past_due';
  start_date: string;
  end_date: string;
};

type SubscriptionContextType = {
  subscription: Subscription | null;
  loading: boolean;
  subscribe: (plan: string) => Promise<void>;
  hasFeature: (feature: string) => boolean;
  isSubscribed: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  loading: false,
  subscribe: async () => {},
  hasFeature: () => false,
  isSubscribed: false,
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setSubscription(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          setSubscription(null);
        } else {
          setSubscription(data as Subscription);
        }
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const subscribe = async (plan: string) => {
    // Implementação futura
    console.log('Assinando plano:', plan);
  };

  const hasFeature = (_feature: string) => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (new Date(subscription.end_date) < new Date()) return false;
    
    return subscription.plan === 'premium' || subscription.plan === 'business';
  };

  const isSubscribed = !!subscription && 
    subscription.status === 'active' && 
    new Date(subscription.end_date) > new Date();

  return (
    <SubscriptionContext.Provider
      value={{ subscription, loading, subscribe, hasFeature, isSubscribed }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
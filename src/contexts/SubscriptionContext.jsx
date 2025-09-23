import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setSubscription(data);
        } else {
          setSubscription(null);
        }
      }
      setLoading(false);
    };
    
    fetchSubscription();
  }, [user]);

  const subscribe = async (plan) => {
    if (!user) throw new Error("Usuário não autenticado");

    const newSubscription = {
      user_id: user.id,
      plan: plan.id,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(newSubscription, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    
    setSubscription(data);
    return data;
  };

  const hasFeature = (feature) => {
    if (!subscription || subscription.status !== 'active' || new Date(subscription.end_date) < new Date()) {
      return false;
    }
    
    if (feature === 'map_access') {
      return subscription.plan === 'premium' || subscription.plan === 'business';
    }
    
    // Adicionar outras features aqui
    return false;
  };

  const isActive = () => {
    return subscription?.status === 'active' && new Date(subscription.endDate) > new Date();
  };

  const value = {
    subscription,
    subscribe,
    hasFeature,
    isActive,
    loading
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

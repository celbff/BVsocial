// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

export const useProfile = (username: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const {  { data, error: fetchError } } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (fetchError) throw fetchError;

      setProfile({
        id: data.id,
        username: data.username,
        full_name: data.full_name || '',
        avatar_url: data.avatar_url || `https://placehold.co/400x400/10b981/white?text=${username[0]}`,
      });
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      setError('Usuário não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return false;
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile((prev) => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!profile) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await updateProfile({ avatar_url: data.publicUrl });
      return data.publicUrl;
    } catch (err) {
      console.error('Erro ao fazer upload do avatar:', err);
      return null;
    }
  };

  return { profile, loading, error, updateProfile, uploadAvatar };
};
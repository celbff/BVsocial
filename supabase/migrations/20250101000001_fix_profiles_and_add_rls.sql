/*
          # [Operation Name]
          Correção da Tabela de Perfis e Adição de Segurança (RLS)

          ## Query Description: [Este script corrige a configuração da sua tabela `profiles`.
          1. Ele garante que a tabela `profiles` exista, sem causar erros se ela já foi criada.
          2. Cria a função e o gatilho necessários para que novos usuários cadastrados tenham seus perfis criados automaticamente.
          3. Implementa as políticas de segurança (RLS) essenciais para proteger os dados dos usuários, garantindo que um usuário só possa alterar o seu próprio perfil.
          Esta operação é segura e pode ser executada sem riscos.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Safe"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          [Tabela: public.profiles, Função: public.handle_new_user, Gatilho: on_auth_user_created, Políticas RLS]
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [As políticas são baseadas no ID do usuário autenticado (auth.uid()).]
          
          ## Performance Impact:
          - Indexes: [Nenhum novo índice]
          - Triggers: [Garante que o gatilho de criação de perfil exista]
          - Estimated Impact: [Baixo. A RLS adiciona uma verificação de segurança necessária a cada consulta.]
          */

-- 1. Garante que a tabela de perfis exista, sem erros.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Cria ou substitui a função para lidar com novos usuários.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garante que o gatilho exista, recriando-o de forma segura.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Habilita a Row Level Security (RLS) e define as políticas de acesso.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

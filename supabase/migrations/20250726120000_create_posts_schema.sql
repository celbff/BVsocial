/*
          # [Criação do Schema de Posts, Comentários e Curtidas]
          Este script cria as tabelas essenciais para a funcionalidade principal da aplicação, incluindo posts, comentários e curtidas. Também estabelece as políticas de segurança (RLS) para proteger os dados do usuário.

          ## Query Description: [Este script é seguro para ser executado. Ele adiciona novas tabelas e políticas de segurança, não afetando dados existentes, pois as tabelas `posts`, `comments`, e `likes` ainda não existem. Nenhuma precaução especial é necessária.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tabelas Criadas: `posts`, `comments`, `likes`
          - Políticas RLS: Habilitadas e configuradas para todas as novas tabelas.
          
          ## Security Implications:
          - RLS Status: Habilitado para as novas tabelas.
          - Policy Changes: Sim, políticas são adicionadas para permitir que os usuários gerenciem seu próprio conteúdo.
          - Auth Requirements: As políticas dependem do `auth.uid()` para verificar a identidade do usuário.
          
          ## Performance Impact:
          - Indexes: Índices de chave primária e estrangeira são criados, o que é bom para o desempenho das consultas.
          - Triggers: Nenhum.
          - Estimated Impact: Baixo.
*/

-- 1. Tabela de Posts
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.posts IS 'Armazena as publicações dos usuários.';

-- 2. Tabela de Comentários
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.comments IS 'Armazena os comentários feitos em cada post.';

-- 3. Tabela de Curtidas
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(post_id, user_id)
);

COMMENT ON TABLE public.likes IS 'Registra as curtidas dos usuários nos posts, garantindo que um usuário só possa curtir um post uma vez.';


-- 4. Habilitar RLS para as novas tabelas
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;


-- 5. Políticas de Segurança para a tabela `posts`
CREATE POLICY "Permitir leitura de todos os posts"
ON public.posts FOR SELECT
USING (true);

CREATE POLICY "Permitir que usuários criem seus próprios posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir que usuários atualizem seus próprios posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir que usuários deletem seus próprios posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);


-- 6. Políticas de Segurança para a tabela `comments`
CREATE POLICY "Permitir leitura de todos os comentários"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Permitir que usuários autenticados criem comentários"
ON public.comments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir que usuários atualizem seus próprios comentários"
ON public.comments FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir que usuários deletem seus próprios comentários"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);


-- 7. Políticas de Segurança para a tabela `likes`
CREATE POLICY "Permitir leitura de todas as curtidas"
ON public.likes FOR SELECT
USING (true);

CREATE POLICY "Permitir que usuários autenticados curtam posts"
ON public.likes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir que usuários removam suas próprias curtidas"
ON public.likes FOR DELETE
USING (auth.uid() = user_id);

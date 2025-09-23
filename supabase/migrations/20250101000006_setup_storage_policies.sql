/*
          # Configuração de Políticas de Segurança para o Storage
          Este script cria as políticas de segurança (RLS) para o bucket 'posts' no Supabase Storage. Essas políticas são essenciais para controlar o acesso e garantir que os usuários só possam gerenciar seus próprios arquivos.

          ## Descrição da Query:
          - A query define quatro políticas na tabela `storage.objects`:
            1.  **SELECT**: Permite que qualquer usuário autenticado veja qualquer imagem no bucket `posts`. Isso é necessário para que os feeds de outros usuários funcionem.
            2.  **INSERT**: Permite que um usuário autenticado adicione novos arquivos (imagens) ao bucket `posts`. A política garante que o `owner` do arquivo seja o mesmo que o `id` do usuário que está fazendo o upload.
            3.  **UPDATE**: Permite que um usuário autenticado atualize seus próprios arquivos.
            4.  **DELETE**: Permite que um usuário autenticado apague seus próprios arquivos.
          - Não há risco de perda de dados com este script, pois ele apenas adiciona regras de segurança.

          ## Metadados:
          - Categoria do Schema: "Segurança"
          - Nível de Impacto: "Baixo"
          - Requer Backup: false
          - Reversível: true (removendo as políticas)
          
          ## Detalhes da Estrutura:
          - Tabela Afetada: `storage.objects`
          - Bucket Afetado: `posts`
          
          ## Implicações de Segurança:
          - Status RLS: Habilitando políticas para o Storage.
          - Mudanças de Política: Sim, adiciona 4 novas políticas.
          - Requisitos de Autenticação: As políticas se aplicam a usuários `authenticated`.
          
          ## Impacto no Desempenho:
          - Índices: Nenhum.
          - Triggers: Nenhum.
          - Impacto Estimado: Mínimo. A verificação de políticas tem um custo de desempenho muito baixo.
          */

-- Habilita o acesso de leitura para usuários autenticados no bucket 'posts'
CREATE POLICY "Allow authenticated users to view post images"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'posts' );

-- Permite que usuários autenticados façam upload de imagens no bucket 'posts'
CREATE POLICY "Allow authenticated users to upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'posts' AND owner = auth.uid() );

-- Permite que usuários atualizem suas próprias imagens
CREATE POLICY "Allow users to update their own post images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'posts' AND owner = auth.uid() );

-- Permite que usuários apaguem suas próprias imagens
CREATE POLICY "Allow users to delete their own post images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'posts' AND owner = auth.uid() );

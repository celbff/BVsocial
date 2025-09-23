/*
          # Criação da Tabela de Perfis e Gatilho de Sincronização
          Cria a tabela 'profiles' para armazenar dados públicos dos usuários e configura um gatilho para sincronizar novos usuários do sistema de autenticação.

          ## Query Description: Este script é seguro e essencial para o funcionamento do sistema de perfis.
          1. **Cria a tabela `profiles`**: Armazena informações como nome de usuário, nome completo e avatar, vinculadas ao ID do usuário autenticado.
          2. **Habilita RLS**: Ativa a Segurança em Nível de Linha para proteger os dados dos usuários.
          3. **Cria Políticas RLS**:
             - Permite que qualquer pessoa visualize os perfis (leitura pública).
             - Permite que cada usuário atualize seu próprio perfil.
          4. **Cria uma Função de Gatilho**: `handle_new_user` é uma função que insere automaticamente um novo registro na tabela `profiles` sempre que um novo usuário se cadastra no `auth.users`.
          5. **Cria o Gatilho**: `on_auth_user_created` aciona a função `handle_new_user` após a criação de um novo usuário.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tabela afetada: `public.profiles` (criação)
          - Colunas: `id`, `updated_at`, `username`, `full_name`, `avatar_url`, `website`
          - Gatilho: `on_auth_user_created` na tabela `auth.users`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (criação de políticas de SELECT e UPDATE)
          - Auth Requirements: As políticas garantem que apenas o usuário autenticado possa modificar seus próprios dados.
          
          ## Performance Impact:
          - Indexes: Chave primária e índice em `username` são criados.
          - Triggers: Adiciona um gatilho `AFTER INSERT` na tabela `auth.users`, com impacto mínimo na performance de novos cadastros.
          - Estimated Impact: Baixo. A operação é rápida e otimizada.
          */

-- 1. Create public.profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Create RLS policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 4. Create a function to handle new user creation
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Create a trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set a comment for the new table
comment on table public.profiles is 'Profile information for each user.';

-- ==========================================================
-- SCRIPT DE CRIAÇÃO DA TABELA E POLÍTICAS RLS NO SUPABASE
-- Execute no menu: Supabase > SQL Editor > New query > Run
-- ==========================================================

-- ⚠️ SEGURANÇA — ANTES DE EXECUTAR:
-- 1. Substitua 'SEU_EMAIL@EXEMPLO.COM' pelo e-mail do administrador
--    (3 ocorrências nas políticas do passo 5).
-- 2. No painel do Supabase, vá em Authentication > Providers > Email
--    e DESATIVE "Enable sign-ups" para impedir cadastros públicos.
-- 3. Crie sua conta de admin em Authentication > Users > "Add user".

-- 1. Criação da tabela de links e produtos
create table if not exists public.drummer_links (
  id text primary key,
  title text not null,
  subtitle text,
  url text not null,
  category text not null default 'shopee',
  icon text default 'ShoppingBag',
  platform text default 'shopee',
  badge text,
  highlight_color text,
  order_index integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Ativação do RLS (Row Level Security)
alter table public.drummer_links enable row level security;

-- 3. Limpeza de políticas antigas (inclui a versão insegura anterior,
--    que permitia escrita a QUALQUER usuário autenticado)
drop policy if exists "Permitir leitura pública" on public.drummer_links;
drop policy if exists "Permitir leitura pública dos links" on public.drummer_links;
drop policy if exists "Permitir gerenciamento completo apenas para administradores autenticados" on public.drummer_links;
drop policy if exists "Somente o administrador pode inserir links" on public.drummer_links;
drop policy if exists "Somente o administrador pode atualizar links" on public.drummer_links;
drop policy if exists "Somente o administrador pode excluir links" on public.drummer_links;

-- 4. POLÍTICA PÚBLICA: qualquer visitante pode LER os links (necessário para o site)
create policy "Permitir leitura pública"
  on public.drummer_links
  for select
  using (true);

-- 5. ESCRITA RESTRITA: somente o e-mail definido abaixo pode inserir, alterar ou excluir.
--    Mesmo que outra conta consiga se autenticar, ela NÃO terá permissão de escrita.
create policy "Somente o administrador pode inserir links"
  on public.drummer_links
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'SEU_EMAIL@EXEMPLO.COM');

create policy "Somente o administrador pode atualizar links"
  on public.drummer_links
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'SEU_EMAIL@EXEMPLO.COM')
  with check ((auth.jwt() ->> 'email') = 'SEU_EMAIL@EXEMPLO.COM');

create policy "Somente o administrador pode excluir links"
  on public.drummer_links
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'SEU_EMAIL@EXEMPLO.COM');

-- ==========================================================
-- VERIFICAÇÃO (opcional): confirme as políticas criadas
-- select policyname, cmd, roles from pg_policies
--   where tablename = 'drummer_links';
-- ==========================================================

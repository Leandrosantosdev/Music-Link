import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('sua-url-aqui')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==========================================
// AUTENTICAÇÃO COM SUPABASE (E-MAIL E SENHA)
// ==========================================

/**
 * Realiza login com E-mail e Senha no Supabase Auth
 */
export async function signInAdmin(email, password) {
  if (!supabase) throw new Error('Supabase não configurado');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (error) throw error;
  return data;
}

/**
 * Encerra a sessão do usuário
 */
export async function signOutAdmin() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.error('[Supabase Auth] Erro ao deslogar:', error.message);
}

/**
 * Obtém o usuário atualmente autenticado
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Observa alterações de estado de autenticação (Login, Logout, Token renovado)
 */
export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

// ==========================================
// BANCO DE DADOS (LINKS & PRODUTOS SHOPEE)
// ==========================================

/**
 * Busca todos os links do Supabase
 */
export async function fetchRemoteLinks() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('drummer_links')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.warn('[Supabase] Erro ao buscar links:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      url: item.url,
      category: item.category,
      icon: item.icon,
      platform: item.platform,
      badge: item.badge,
      highlightColor: item.highlight_color,
      active: item.active !== false,
      orderIndex: item.order_index,
    }));
  } catch (err) {
    console.error('[Supabase] Falha na conexão:', err);
    return null;
  }
}

/**
 * Salva ou atualiza um link no Supabase
 */
export async function upsertRemoteLink(link) {
  if (!isSupabaseConfigured || !supabase) return false;

  const payload = {
    id: link.id,
    title: link.title,
    subtitle: link.subtitle,
    url: link.url,
    category: link.category,
    icon: link.icon || 'ExternalLink',
    platform: link.platform || link.category,
    badge: link.badge || '',
    highlight_color: link.highlightColor || '',
    order_index: link.orderIndex || 0,
    active: link.active !== false,
  };

  const { error } = await supabase.from('drummer_links').upsert(payload);
  if (error) {
    console.error('[Supabase] Erro ao salvar link:', error.message);
    throw error;
  }
  return true;
}

/**
 * Remove um link do Supabase
 */
export async function deleteRemoteLink(id) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('drummer_links').delete().eq('id', id);
  if (error) {
    console.error('[Supabase] Erro ao deletar link:', error.message);
    throw error;
  }
  return true;
}

/**
 * Insere lote de links iniciais no Supabase se a tabela estiver vazia
 */
export async function seedInitialLinks(initialLinks) {
  if (!isSupabaseConfigured || !supabase) return false;

  const formatted = initialLinks.map((link, index) => ({
    id: link.id,
    title: link.title,
    subtitle: link.subtitle || '',
    url: link.url,
    category: link.category,
    icon: link.icon || 'ExternalLink',
    platform: link.platform || link.category,
    badge: link.badge || '',
    highlight_color: link.highlightColor || '',
    order_index: index,
    active: link.active !== false,
  }));

  const { error } = await supabase.from('drummer_links').upsert(formatted);
  if (error) {
    console.error('[Supabase Seed] Erro ao popular links iniciais:', error.message);
    throw error;
  }
  return true;
}

/**
 * SQL completo para o usuário colar no SQL Editor do Supabase
 */
export const SUPABASE_SQL_SETUP = `-- ==========================================================
-- SCRIPT DE CRIAÇÃO DA TABELA E POLÍTICAS RLS NO SUPABASE
-- Execute este script no menu: Supabase > SQL Editor > New query
-- ==========================================================

-- ⚠️ SEGURANÇA — ANTES DE EXECUTAR:
-- 1. Substitua 'SEU_EMAIL@EXEMPLO.COM' pelo e-mail do administrador
--    (3 ocorrências nas políticas abaixo).
-- 2. No painel do Supabase, vá em Authentication > Providers > Email
--    e DESATIVE "Enable sign-ups" para impedir cadastros públicos.

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
`;

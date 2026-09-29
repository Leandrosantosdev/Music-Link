import React, { useState, useMemo, useEffect } from 'react';
import { profileData, categories, linksList } from './data/linksData';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { LinkCard } from './components/LinkCard';
import { DrumPadWidget } from './components/DrumPadWidget';
import { TopBar } from './components/TopBar';
import { ShareModal } from './components/ShareModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { playCrash } from './utils/drumAudio';
import { fetchRemoteLinks, isSupabaseConfigured } from './services/supabaseClient';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Controle de rota oculta / admin (via hash #admin ou clique no lock)
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });

  // Links dinâmicos (carregados do Supabase ou do LocalStorage ou do padrão)
  const [links, setLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('hub_custom_links');
      if (saved) {
        return JSON.parse(saved);
      }
      return linksList;
    } catch {
      return linksList;
    }
  });

  // Tenta carregar links do Supabase na inicialização caso configurado
  useEffect(() => {
    async function loadSupabaseLinks() {
      if (isSupabaseConfigured) {
        const remote = await fetchRemoteLinks();
        if (remote && remote.length > 0) {
          setLinks(remote);
          try {
            localStorage.setItem('hub_custom_links', JSON.stringify(remote));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    loadSupabaseLinks();
  }, []);

  // Ouve mudanças na hash da URL (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Atalho de teclado secreto para entrar no admin: Alt + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Salvar links vindos do painel administrativo
  const handleSaveLinks = (updatedLinks) => {
    setLinks(updatedLinks);
    try {
      localStorage.setItem('hub_custom_links', JSON.stringify(updatedLinks));
    } catch (e) {
      console.error('Falha ao salvar no localStorage', e);
    }
  };

  // Filtragem pública de links (apenas itens ativos)
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // Itens inativos não aparecem para o público
      if (link.active === false) return false;

      const isProductTab = activeCategory === 'shopee';
      const isLegacyProduct = link.category === 'other' && link.badge && (
        link.badge.toUpperCase().includes('MERCADO') || 
        link.badge.toUpperCase().includes('AMAZON')
      );
      const matchCategory =
        activeCategory === 'all' || 
        link.category === activeCategory ||
        (isProductTab && (link.category === 'mercadolivre' || link.category === 'amazon' || isLegacyProduct));

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        link.title.toLowerCase().includes(q) ||
        (link.subtitle && link.subtitle.toLowerCase().includes(q)) ||
        (link.badge && link.badge.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [links, activeCategory, searchQuery]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleAvatarClick = () => {
    playCrash();
    showToast('🥁 Crash ativado! Som de bateria!');
  };

  const openAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminOpen(true);
  };

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminOpen(false);
  };

  return (
    <>
      {/* Luz ambiente de fundo */}
      <div className="bg-ambient-orb-1" aria-hidden="true" />
      <div className="bg-ambient-orb-2" aria-hidden="true" />

      {/* Rota Oculta: Painel Administrativo */}
      {isAdminOpen ? (
        <AdminPanel
          links={links}
          onSaveLinks={handleSaveLinks}
          onClose={closeAdmin}
          onShowToast={showToast}
        />
      ) : (
        /* Visualização Pública Oficial */
        <main className="app-container">
          {/* Barra superior limpa (Apenas Som e Compartilhar) */}
          <TopBar
            onOpenShare={() => setIsShareOpen(true)}
          />

          {/* Perfil e Header Principal */}
          <Header
            profile={profileData}
            onAvatarClick={handleAvatarClick}
          />

          {/* Filtros de Categoria e Pesquisa (Buscador no topo com destaque) */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Lista de Links com Bateria no Meio para Máximo Destaque nos Links */}
          <section className="links-section" aria-label="Lista de Links Oficiais">
            {searchQuery || activeCategory !== 'all' ? (
              /* Modo Filtrado / Busca: exibe todos os links correspondentes primeiro */
              <>
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))
                ) : (
                  <div className="empty-state">
                    <p>Nenhum link encontrado para <strong>"{searchQuery}"</strong>.</p>
                  </div>
                )}
                {/* Bateria Virtual após os links filtrados */}
                <DrumPadWidget />
              </>
            ) : (
              /* Modo Padrão: Primeiros links em destaque -> Drum Virtual no meio -> Demais links */
              <>
                {filteredLinks.slice(0, 3).map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}

                {/* Bateria Virtual no Meio da Página */}
                <DrumPadWidget />

                {filteredLinks.slice(3).map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </>
            )}
          </section>

          {/* Rodapé Oficial */}
          <Footer name={profileData.name} />
        </main>
      )}

      {/* Modal de Compartilhamento */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Flutuante */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner de Consentimento LGPD (carrega GA4/Clarity só após o aceite) */}
      <CookieConsent />
    </>
  );
}

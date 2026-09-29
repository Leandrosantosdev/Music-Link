import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Database, 
  ShoppingBag, 
  Layers, 
  Copy, 
  Check, 
  Eye,  EyeOff,
  UserCheck,
  AlertCircle,
  UploadCloud,
  LogOut,
  ShoppingCart,
  Package
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  SUPABASE_SQL_SETUP, 
  upsertRemoteLink, 
  deleteRemoteLink,
  signInAdmin,
  signOutAdmin,
  getCurrentUser,
  seedInitialLinks,
  onAuthStateChange
} from '../services/supabaseClient';
import { copyToClipboardSafe } from '../utils/security';

export function AdminPanel({
  links,
  onSaveLinks,
  onClose,
  onShowToast,
}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Formulário de Login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Abas do Painel
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'form' | 'supabase'

  // Estado para Edição / Novo Item
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    url: '',
    category: 'shopee',
    icon: 'ShoppingBag',
    badge: 'Shopee',
    highlightColor: '#EE4D2D',
  });

  const [copiedSql, setCopiedSql] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Monitora o estado da sessão do Supabase
  useEffect(() => {
    async function checkSession() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkSession();

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login com E-mail e Senha no Supabase
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const data = await signInAdmin(emailInput, passwordInput);
      setCurrentUser(data.user);
      onShowToast(`Bem-vindo, ${data.user.email}!`);
    } catch (err) {
      console.error('Erro de autenticação:', err);
      let msg = err.message || 'Falha ao autenticar no Supabase.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'E-mail ou senha incorretos no Supabase.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'E-mail ainda não confirmado. Desative "Confirm email" no Supabase ou confirme o link no seu e-mail.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'A senha deve ter no mínimo 6 caracteres.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setCurrentUser(null);
    onShowToast('Sessão encerrada com sucesso.');
  };

  // Prepara formulário para editar
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      url: item.url || '',
      category: item.category || 'shopee',
      icon: item.icon || 'ShoppingBag',
      badge: item.badge || '',
      highlightColor: item.highlightColor || (
        item.category === 'shopee' ? '#EE4D2D' :
        item.category === 'mercadolivre' ? '#FFE600' :
        item.category === 'amazon' ? '#FF9900' :
        '#00F2FE'
      ),
    });
    setActiveTab('form');
  };

  // Prepara formulário para novo item
  const handleStartNew = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      url: '',
      category: 'shopee',
      icon: 'ShoppingBag',
      badge: 'Shopee',
      highlightColor: '#EE4D2D',
    });
    setActiveTab('form');
  };

  // Salva ou adiciona item no Supabase com RLS
  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      alert('Por favor, informe ao menos o Título e a URL do link.');
      return;
    }

    let updatedLinks;
    let savedItem;

    if (editingId) {
      // Atualizando item existente
      updatedLinks = links.map((l) => {
        if (l.id === editingId) {
          savedItem = {
            ...l,
            ...formData,
          };
          return savedItem;
        }
        return l;
      });
    } else {
      // Criando novo item
      const newId = `item-${Date.now()}`;
      savedItem = {
        id: newId,
        ...formData,
        active: true,
      };
      updatedLinks = [savedItem, ...links];
    }

    onSaveLinks(updatedLinks);

    // Salva remotamente no Supabase com permissões de usuário autenticado (RLS)
    if (isSupabaseConfigured && savedItem) {
      try {
        await upsertRemoteLink(savedItem);
        onShowToast('Salvo e sincronizado no banco de dados do Supabase!');
      } catch (err) {
        console.error(err);
        onShowToast('Atenção: Salvo localmente, mas verifique as políticas de RLS no Supabase.');
      }
    } else {
      onShowToast(editingId ? 'Link atualizado com sucesso!' : 'Novo item adicionado com sucesso!');
    }

    setActiveTab('list');
    setEditingId(null);
  };

  // Deletar item
  const handleDeleteItem = async (id, title) => {
    if (!window.confirm(`Tem certeza que deseja remover "${title}"?`)) return;

    const updated = links.filter((l) => l.id !== id);
    onSaveLinks(updated);

    if (isSupabaseConfigured) {
      try {
        await deleteRemoteLink(id);
      } catch (err) {
        console.error('Erro ao deletar no Supabase:', err);
      }
    }

    onShowToast('Item removido com sucesso!');
  };

  // Alternar ativo/oculto
  const handleToggleActive = async (id) => {
    let targetItem = null;
    const updated = links.map((l) => {
      if (l.id === id) {
        targetItem = { ...l, active: l.active === false ? true : false };
        return targetItem;
      }
      return l;
    });
    onSaveLinks(updated);

    if (isSupabaseConfigured && targetItem) {
      try {
        await upsertRemoteLink(targetItem);
      } catch (err) {
        console.error(err);
      }
    }

    onShowToast('Visibilidade do link atualizada!');
  };

  // Sincronizar todos os links padrão para o Supabase (Seed com 1 clique)
  const handleSeedSupabase = async () => {
    setIsSeeding(true);
    try {
      await seedInitialLinks(links);
      onShowToast('Todos os links foram enviados para a tabela do Supabase com sucesso!');
    } catch (err) {
      alert(`Erro ao sincronizar com o Supabase: ${err.message}. Verifique se você executou o SQL de criação da tabela.`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Cópia do Script SQL para Supabase
  const handleCopySql = async () => {
    const ok = await copyToClipboardSafe(SUPABASE_SQL_SETUP);
    if (ok) {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
      onShowToast('Script SQL copiado para a área de transferência!');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="admin-layout" style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Verificando credenciais de segurança...</p>
      </div>
    );
  }

  // TELA DE LOGIN SUPABASE AUTH (E-MAIL E SENHA)
  if (!currentUser) {
    return (
      <div className="admin-layout">
        <div className="admin-login-card">
          <div className="admin-lock-icon">
            <Lock size={26} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#ffffff' }}>
            Login Administrativo
          </h2>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Autenticação segura via <strong>Supabase Auth</strong>. O cadastro público está desativado: a conta de administrador deve ser criada manualmente no painel do Supabase.
          </p>

          <form onSubmit={handleAuthSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>E-mail do Administrador</label>
              <input
                type="email"
                placeholder="seu-email@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="admin-input"
                required
                autoFocus
              />
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Senha de Acesso</label>
              <input
                type="password"
                placeholder="Digite sua senha..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="admin-input"
                required
                minLength={6}
              />
            </div>

            {authError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.78rem', background: 'rgba(239,68,68,0.1)', padding: '8px', borderRadius: '6px' }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={authLoading}
              className="admin-btn admin-btn-primary" 
              style={{ justifyContent: 'center', padding: '11px', marginTop: '4px' }}
            >
              <Unlock size={16} />
              <span>{authLoading ? 'Autenticando...' : 'Entrar com Supabase'}</span>
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            className="admin-secret-trigger"
            style={{ marginTop: '12px' }}
          >
            ← Voltar para o Linktree
          </button>
        </div>
      </div>
    );
  }

  // PAINEL AUTENTICADO
  return (
    <div className="admin-layout">
      {/* Header do Painel */}
      <div className="admin-header">
        <div className="admin-header-title">
          <span style={{ fontSize: '1.3rem' }}>🥁</span>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>Painel Administrativo Hub</div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <UserCheck size={13} />
              <span>Autenticado como: <strong>{currentUser.email.split('@')[0].slice(0, 3) + '***@' + currentUser.email.split('@')[1]}</strong></span>
            </div>
          </div>
        </div>

        <div className="admin-header-actions">
          <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary" title="Ver Linktree">
            <ArrowLeft size={15} />
            <span>Ver Site</span>
          </button>
          <button type="button" onClick={handleLogout} className="admin-btn admin-btn-danger" title="Encerrar sessão Supabase">
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="admin-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`admin-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
        >
          <Layers size={15} />
          <span>Gerenciar Links ({links.length})</span>
        </button>

        <button
          type="button"
          onClick={handleStartNew}
          className={`admin-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
        >
          <Plus size={15} />
          <span>{editingId ? 'Editar Item' : 'Novo Produto / Link'}</span>
        </button>
      </div>

      {/* ABA 1: LISTAGEM DE LINKS */}
      {activeTab === 'list' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="admin-card-title">
              <ShoppingBag size={18} color="#ee4d2d" />
              <span>Produtos e Redes Cadastrados</span>
            </h3>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={handleSeedSupabase} 
                disabled={isSeeding}
                className="admin-btn admin-btn-secondary"
                title="Sincroniza todos os links do setup para a tabela do Supabase de uma vez só"
              >
                <UploadCloud size={14} />
                <span>{isSeeding ? 'Sincronizando...' : 'Sincronizar Tudo no Supabase'}</span>
              </button>

              <button type="button" onClick={handleStartNew} className="admin-btn admin-btn-shopee">
                <Plus size={14} />
                <span>Adicionar Produto</span>
              </button>
            </div>
          </div>

          <div className="admin-items-list">
            {links.map((item) => (
              <div 
                key={item.id} 
                className="admin-item-row"
                style={{ opacity: item.active === false ? 0.5 : 1 }}
              >
                <div className="admin-item-info">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: item.highlightColor ? `${item.highlightColor}26` : 'rgba(0,242,254,0.15)',
                      color: item.highlightColor || '#00f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.category === 'shopee' ? <ShoppingBag size={18} /> : 
                     item.category === 'mercadolivre' ? <ShoppingCart size={18} /> : 
                     item.category === 'amazon' ? <Package size={18} /> : 
                     <Layers size={18} />}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{item.title}</strong>
                      {item.badge && (
                        <span 
                          style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 700, 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            background: item.highlightColor || '#00f2fe',
                            color: item.category === 'mercadolivre' ? '#000000' : '#ffffff'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {item.url}
                    </div>
                  </div>
                </div>

                <div className="admin-item-actions">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id)}
                    className="icon-action-btn"
                    title={item.active === false ? 'Mostrar no Linktree' : 'Ocultar do Linktree'}
                  >
                    {item.active === false ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="icon-action-btn"
                    title="Editar produto"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id, item.title)}
                    className="icon-action-btn"
                    title="Excluir item"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: FORMULÁRIO DE NOVO / EDITAR ITEM */}
      {activeTab === 'form' && (
        <div className="admin-card">
          <h3 className="admin-card-title">
            <Edit3 size={18} color="var(--neon-cyan)" />
            <span>{editingId ? 'Editar Produto ou Link' : 'Cadastrar Novo Produto ou Link'}</span>
          </h3>

          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    let badge = '';
                    let highlightColor = '#00F2FE';
                    let icon = 'Layers';
                    
                    if (cat === 'shopee') { badge = 'Shopee'; highlightColor = '#EE4D2D'; icon = 'ShoppingBag'; }
                    else if (cat === 'mercadolivre') { badge = 'Mercado Livre'; highlightColor = '#FFE600'; icon = 'ShoppingCart'; }
                    else if (cat === 'amazon') { badge = 'Amazon'; highlightColor = '#FF9900'; icon = 'Package'; }

                    setFormData((prev) => ({
                      ...prev,
                      category: cat,
                      badge,
                      highlightColor,
                      icon
                    }));
                  }}
                  className="admin-select"
                >
                  <option value="shopee">Setup Shopee (Produto com link de afiliado)</option>
                  <option value="mercadolivre">Mercado Livre (Produto com link de afiliado)</option>
                  <option value="amazon">Amazon (Produto com link de afiliado)</option>
                  <option value="social">Rede Social Oficial</option>
                  <option value="other">Outro Link Personalizado</option>
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label">Selo / Badge (Ex: Shopee, Mais Vendido, Setup Recomendado)</label>
                <input
                  type="text"
                  placeholder="Ex: Shopee ou Mais Vendido"
                  value={formData.badge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Título do Item ou Produto *</label>
              <input
                type="text"
                placeholder="Ex: Baquetas que uso nos vídeos / Fone KZ ZSN Pro"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="admin-input"
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Subtítulo / Descrição Curta</label>
              <input
                type="text"
                placeholder="Ex: Pegada equilibrada, durabilidade extrema e rimshot pesado"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Link de Afiliado ou URL de Destino *</label>
              <input
                type="url"
                placeholder="https://shopee.com.br/... ou https://shope.ee/..."
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label">Ícone</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  className="admin-select"
                >
                  <option value="ShoppingBag">Sacola de Compras (Shopee)</option>
                  <option value="ShoppingCart">Carrinho (Mercado Livre)</option>
                  <option value="Package">Pacote (Amazon)</option>
                  <option value="Headphones">Fone de Ouvido</option>
                  <option value="Wand2">Baquetas</option>
                  <option value="Disc">Pad de Estudo</option>
                  <option value="Sliders">Moongel / Abafadores</option>
                  <option value="Camera">Garra / Celular</option>
                  <option value="Youtube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Video">TikTok</option>
                  <option value="Sparkles">Destaque</option>
                  <option value="ExternalLink">Link Externo</option>
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label">Cor de Destaque</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.highlightColor || '#ee4d2d'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, highlightColor: e.target.value }))}
                    style={{ background: 'none', border: 'none', width: '40px', height: '40px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formData.highlightColor}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-shopee"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
              >
                <Save size={16} />
                <span>{editingId ? 'Salvar Alterações no Supabase' : 'Publicar no Supabase & Site'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="admin-btn admin-btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

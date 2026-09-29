import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { copyToClipboardSafe } from '../utils/security';

export function ShareModal({ isOpen, onClose, profileUrl, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = profileUrl || (typeof window !== 'undefined' ? window.location.href : 'https://seusite.com');

  const handleCopy = async () => {
    const success = await copyToClipboardSafe(currentUrl);
    if (success) {
      setCopied(true);
      if (onShowToast) onShowToast('Link oficial copiado com sucesso!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bio Links Oficial - Drummer Hub',
          text: 'Confira os canais oficiais, projetos musicais e o setup recomendado:',
          url: currentUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} color="var(--neon-cyan)" />
            <span>Compartilhar Perfil</span>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Envie este hub oficial de links para amigos, contratantes, bandas ou seguidores:
        </p>

        {/* Campo com Link e Botão Copiar */}
        <div className="share-copy-box">
          <span className="share-copy-url">{currentUrl}</span>
          <button type="button" onClick={handleCopy} className="share-copy-btn">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* Botão de Compartilhar Nativo (WhatsApp, Telegram, etc.) */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="share-copy-btn"
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, #00f2fe, #0ea5e9)',
            color: '#07090e',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}
        >
          <Share2 size={16} />
          <span>Enviar via Redes / WhatsApp</span>
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
          🔒 Link protegido com certificado HTTPS e verificação de integridade
        </div>
      </div>
    </div>
  );
}

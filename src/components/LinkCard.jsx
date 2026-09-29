import React from 'react';
import { 
  Headphones, 
  Wand2, 
  Disc, 
  Sliders, 
  Camera, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  ShoppingCart,
  Package
} from 'lucide-react';
import { 
  YoutubeIcon, 
  InstagramIcon, 
  TikTokIcon, 
  WhatsAppIcon, 
  ShopeeIcon 
} from './SocialIcons';
import { sanitizeUrl } from '../utils/security';
import { trackEvent } from '../utils/analytics';
import { playHiHat } from '../utils/drumAudio';

const ICON_MAP = {
  Headphones,
  Wand2,
  Disc,
  Sliders,
  Camera,
  Youtube: YoutubeIcon,
  Instagram: InstagramIcon,
  Video: TikTokIcon,
  MessageCircle: WhatsAppIcon,
  Shopee: ShopeeIcon,
  ExternalLink,
  Sparkles,
  ShoppingCart,
  Package
};

export function LinkCard({ link, onCardClick }) {
  const IconComponent = ICON_MAP[link.icon] || ExternalLink;
  const safeHref = sanitizeUrl(link.url);
  const isShopee = link.category === 'shopee';

  // Domínio do destino para análise no GA4 sem expor a URL completa (LGPD)
  let safeDomain = '';
  try {
    safeDomain = new URL(safeHref, window.location.origin).hostname;
  } catch {
    safeDomain = '';
  }

  const handleClick = () => {
    try {
      playHiHat();
    } catch {
      // áudio opcional
    }

    // Evento de clique para o GA4 + Clarity
    trackEvent('link_click', {
      link_id: link.id,
      link_title: link.title,
      link_category: link.category,
      link_domain: safeDomain,
    });

    if (onCardClick) {
      onCardClick(link);
    }
  };

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-card ${link.platform || ''} ${isShopee ? 'shopee' : ''}`}
      onClick={handleClick}
      id={`link-item-${link.id}`}
      aria-label={`${link.title}: ${link.subtitle}`}
    >
      <div className="link-card-left">
        <div 
          className="link-card-icon-box"
          style={{ 
            color: link.highlightColor || 'var(--neon-cyan)',
            backgroundColor: isShopee ? 'rgba(238, 77, 45, 0.12)' : undefined
          }}
        >
          <IconComponent size={20} />
        </div>

        <div className="link-card-text">
          <div className="link-card-title-row">
            <span className="link-card-title">{link.title}</span>
          </div>
          <span className="link-card-subtitle">{link.subtitle}</span>
        </div>
      </div>

      <div className="link-card-right">
        {link.badge && (
          <span className={`link-badge ${isShopee ? 'shopee' : ''} ${link.category === 'mercadolivre' ? 'mercadolivre' : ''} ${link.category === 'amazon' ? 'amazon' : ''} ${!isShopee && link.category !== 'mercadolivre' && link.category !== 'amazon' ? 'custom' : ''}`}
                style={link.category !== 'shopee' ? { 
                  backgroundColor: link.highlightColor, 
                  color: (link.category === 'mercadolivre' || String(link.badge).toUpperCase().includes('MERCADO LIV') || String(link.highlightColor).toUpperCase() === '#FFE600') ? '#000000' : '#ffffff' 
                } : {}}>
            {link.badge}
          </span>
        )}
        <ChevronRight size={18} className="link-chevron" />
      </div>
    </a>
  );
}

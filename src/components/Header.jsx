import React from 'react';
import { CheckCircle2, Disc3 } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TikTokIcon } from './SocialIcons';
import { sanitizeUrl } from '../utils/security';
import { trackEvent } from '../utils/analytics';

export function Header({ profile, onAvatarClick }) {
  /**
   * Rastreia clique em rede social do header no GA4 + Clarity
   * @param {'youtube'|'instagram'|'tiktok'} network
   */
  const trackSocialClick = (network) => {
    trackEvent('social_click', { social_network: network });
  };

  const instagramUrl = profile.socialLinks?.instagram || `https://instagram.com/${profile.handle?.replace('@', '') || ''}`;
  const youtubeUrl = profile.socialLinks?.youtube || 'https://youtube.com';
  const tiktokUrl = profile.socialLinks?.tiktok || 'https://tiktok.com';

  return (
    <header className="profile-header">
      {/* Avatar com Anel Neon animado */}
      <div 
        className="avatar-wrapper" 
        onClick={onAvatarClick}
        title="Clique para tocar o som de bateria!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onAvatarClick()}
      >
        <div className="avatar-glow-ring" />
        <div className="avatar-img-container">
          <img 
            src={profile.avatarUrl} 
            alt={`${profile.name} - Drummer`} 
            className="avatar-img"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300&h=300&fit=crop&q=80';
            }}
          />
        </div>
        <div className="avatar-badge-drum" title="Baterista Oficial">
          <Disc3 size={16} />
        </div>
      </div>

      {/* Identificação */}
      <div className="profile-info">
        <div className="profile-name-row">
          <h1 className="profile-name">{profile.name}</h1>
          {profile.verified && (
            <CheckCircle2 size={20} className="verified-icon" aria-label="Perfil Verificado" />
          )}
        </div>

        <a 
          href={sanitizeUrl(instagramUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-handle"
        >
          {profile.handle}
        </a>

        <div className="profile-role">{profile.role}</div>

        <p className="profile-bio">{profile.bio}</p>

        {/* Barra de Acesso Rápido às Redes (YouTube, Instagram, TikTok) */}
        <div className="quick-social-bar" aria-label="Redes sociais oficiais">
          <a
            href={sanitizeUrl(youtubeUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-social-link youtube"
            title="YouTube Oficial"
            aria-label={`YouTube ${profile.name}`}
            onClick={() => trackSocialClick('youtube')}
          >
            <YoutubeIcon size={20} /> 
          </a>

          <a
            href={sanitizeUrl(instagramUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-social-link instagram"
            title="Instagram Oficial"
            aria-label={`Instagram ${profile.name}`}
            onClick={() => trackSocialClick('instagram')}
          >
            <InstagramIcon size={20} />
          </a>

          <a
            href={sanitizeUrl(tiktokUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-social-link tiktok"
            title="TikTok Oficial"
            aria-label={`TikTok ${profile.name}`}
            onClick={() => trackSocialClick('tiktok')}
          >
            <TikTokIcon size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Share2, Volume2 } from 'lucide-react';
import { playSnare } from '../utils/drumAudio';

export function TopBar({ onOpenShare }) {
  const handleSoundTest = () => {
    playSnare();
  };

  return (
    <div className="top-action-bar">
      <button
        type="button"
        onClick={handleSoundTest}
        className="icon-action-btn"
        title="Som de Caixa (Snare)"
        aria-label="Tocar som de bateria"
      >
        <Volume2 size={16} />
      </button>

      <button
        type="button"
        onClick={onOpenShare}
        className="icon-action-btn"
        title="Compartilhar Perfil"
        aria-label="Compartilhar perfil oficial"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}

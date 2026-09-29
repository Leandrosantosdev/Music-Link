import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  playKick, 
  playSnare, 
  playHiHatClosed, 
  playHiHatOpen, 
  playCrash, 
  playSplash, 
  playRide, 
  playTom1, 
  playTom2, 
  playTom3, 
  playFloorTom 
} from '../utils/drumAudio';

// Definição dos pontos interativos baseados na imagem 1024 x 519 da bateria real
const DRUM_PIECES = [
  { id: 'crash-left', name: 'Prato Crash 1', key: 'Q', cx: 149, cy: 188, r: 105, play: () => playCrash(4200), color: '#f59e0b' },
  { id: 'hihat-top', name: 'Chimbal Fechado', key: 'W', cx: 68, cy: 270, r: 75, play: playHiHatClosed, color: '#fbbf24' },
  { id: 'hihat-bottom', name: 'Chimbal Aberto', key: 'E', cx: 20, cy: 426, r: 70, play: playHiHatOpen, color: '#fde047' },
  { id: 'splash', name: 'Prato Splash', key: 'R', cx: 351, cy: 104, r: 68, play: playSplash, color: '#10b981' },
  { id: 'tom-1', name: 'Tom 1', key: 'T', cx: 295, cy: 235, r: 68, play: playTom1, color: '#38bdf8' },
  { id: 'tom-2', name: 'Tom 2', key: 'Y', cx: 468, cy: 155, r: 72, play: playTom2, color: '#0ea5e9' },
  { id: 'crash-mid', name: 'Prato Crash 2', key: 'U', cx: 619, cy: 60, r: 90, play: () => playCrash(4800), color: '#ef4444' },
  { id: 'tom-3', name: 'Tom 3', key: 'I', cx: 660, cy: 235, r: 75, play: playTom3, color: '#0284c7' },
  { id: 'ride', name: 'Prato Ride', key: 'O', cx: 846, cy: 176, r: 115, play: playRide, color: '#eab308' },
  { id: 'snare', name: 'Caixa (Snare)', key: 'S', cx: 470, cy: 350, r: 85, play: playSnare, color: '#e02694' },
  { id: 'kick-1', name: 'Bumbo 1 (Kick)', key: 'Z', cx: 285, cy: 470, r: 98, play: () => playKick(145), color: '#00f2fe' },
  { id: 'kick-2', name: 'Bumbo 2 (Kick)', key: 'X', cx: 660, cy: 470, r: 98, play: () => playKick(135), color: '#00f2fe' },
  { id: 'floor-tom', name: 'Surdo (Floor Tom)', key: 'C', cx: 955, cy: 410, r: 90, play: playFloorTom, color: '#0369a1' },
];

export function DrumPadWidget() {
  const [activeHits, setActiveHits] = useState({});
  const [lastHitName, setLastHitName] = useState('Toque para tocar');
  const [isPlayingGroove, setIsPlayingGroove] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const grooveTimeoutsRef = useRef([]);
  const touchStartPos = useRef({ x: 0, y: 0, time: 0 });

  // Dispara o som e a animação de impacto
  const triggerPiece = (piece) => {
    piece.play();
    setLastHitName(piece.name);

    setActiveHits((prev) => ({ ...prev, [piece.id]: true }));
    setTimeout(() => {
      setActiveHits((prev) => ({ ...prev, [piece.id]: false }));
    }, 180);
  };

  // Touch handlers sem bloquear a rolagem nativa do celular (Mobile First)
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e, piece) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStartPos.current.x);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartPos.current.y);
      const dt = Date.now() - touchStartPos.current.time;
      // Se não moveu mais que 10px e foi rápido, foi um toque no instrumento e não um swipe de rolagem
      if (dx < 12 && dy < 12 && dt < 450) {
        triggerPiece(piece);
      }
    }
  };

  // Suporte a teclado no desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      const piece = DRUM_PIECES.find((p) => p.key === key);
      if (piece) {
        e.preventDefault();
        triggerPiece(piece);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Demonstração de Groove Musical
  const stopGroove = () => {
    grooveTimeoutsRef.current.forEach(clearTimeout);
    grooveTimeoutsRef.current = [];
    setIsPlayingGroove(false);
  };

  const playGrooveDemo = () => {
    if (isPlayingGroove) {
      stopGroove();
      return;
    }

    if (!isExpanded) setIsExpanded(true);

    setIsPlayingGroove(true);
    setLastHitName('🥁 Tocando Groove...');

    const tempo = 125;
    const beat = (60 / tempo) * 1000;
    const sixteenth = beat / 4;

    const pattern = [
      { t: 0, p: 'crash-left' },
      { t: 0, p: 'kick-1' },
      { t: sixteenth * 2, p: 'hihat-top' },
      { t: sixteenth * 4, p: 'snare' },
      { t: sixteenth * 4, p: 'hihat-top' },
      { t: sixteenth * 6, p: 'kick-1' },
      { t: sixteenth * 8, p: 'hihat-top' },
      { t: sixteenth * 9, p: 'kick-2' },
      { t: sixteenth * 10, p: 'kick-1' },
      { t: sixteenth * 12, p: 'snare' },
      { t: sixteenth * 12, p: 'hihat-top' },
      { t: sixteenth * 14, p: 'hihat-top' },

      // Compasso 2
      { t: sixteenth * 16, p: 'ride' },
      { t: sixteenth * 16, p: 'kick-1' },
      { t: sixteenth * 18, p: 'ride' },
      { t: sixteenth * 20, p: 'snare' },
      { t: sixteenth * 22, p: 'tom-1' },
      { t: sixteenth * 24, p: 'tom-2' },
      { t: sixteenth * 26, p: 'tom-3' },
      { t: sixteenth * 28, p: 'floor-tom' },
      { t: sixteenth * 30, p: 'snare' },
      { t: sixteenth * 32, p: 'crash-mid' },
      { t: sixteenth * 32, p: 'kick-1' },
      { t: sixteenth * 32, p: 'kick-2' },
    ];

    grooveTimeoutsRef.current = pattern.map(({ t, p }) => {
      return setTimeout(() => {
        const piece = DRUM_PIECES.find((item) => item.id === p);
        if (piece) triggerPiece(piece);
      }, t);
    });

    const totalDuration = sixteenth * 34;
    const finalTimeout = setTimeout(() => {
      setIsPlayingGroove(false);
      setLastHitName('Pronto para tocar!');
    }, totalDuration);

    grooveTimeoutsRef.current.push(finalTimeout);
  };

  useEffect(() => {
    return () => stopGroove();
  }, []);

  return (
    <div className="drum-kit-container" aria-label="Bateria Virtual Drum Virtual">
      {/* Barra de Título do Instrumento */}
      <div className="drum-kit-topbar">
        <div className="drum-kit-title">
          <Music size={14} style={{ color: 'var(--neon-cyan)' }} />
          <span>Drum Virtual</span>
        </div>

        <div className="drum-kit-actions">
          {isExpanded && (
            <span className="drum-hit-badge" title="Peça tocada">{lastHitName}</span>
          )}

          <button
            type="button"
            onClick={playGrooveDemo}
            className={`drum-demo-btn ${isPlayingGroove ? 'playing' : ''}`}
            title={isPlayingGroove ? 'Parar Groove' : 'Ouvir demonstração de groove'}
          >
            {isPlayingGroove ? <Square size={11} /> : <Play size={11} />}
            <span>{isPlayingGroove ? 'Parar' : 'Groove Demo'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="icon-action-btn"
            style={{ width: '28px', height: '28px' }}
            title={isExpanded ? 'Recolher bateria' : 'Expandir bateria para tocar'}
            aria-label={isExpanded ? 'Recolher bateria' : 'Expandir bateria'}
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Visual da Bateria com Hotspots (quando expandida) */}
      {isExpanded ? (
        <>
          <div className="drum-kit-stage">
            <img
              src="/drumkit-real.jpg"
              alt="Drum Virtual Interativo"
              className="drum-kit-image"
              draggable="false"
            />

            <svg
              viewBox="0 0 1024 519"
              className="drum-kit-svg-overlay"
              xmlns="http://www.w3.org/2000/svg"
            >
              {DRUM_PIECES.map((piece) => {
                const isHit = activeHits[piece.id];

                return (
                  <g
                    key={piece.id}
                    className={`drum-hit-group ${isHit ? 'hit' : ''}`}
                    onClick={() => triggerPiece(piece)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={(e) => handleTouchEnd(e, piece)}
                    role="button"
                    tabIndex={0}
                    aria-label={piece.name}
                  >
                    <circle
                      cx={piece.cx}
                      cy={piece.cy}
                      r={piece.r}
                      className="drum-hit-sensor"
                    />

                    {isHit && (
                      <>
                        <circle
                          cx={piece.cx}
                          cy={piece.cy}
                          r={piece.r}
                          fill="none"
                          stroke={piece.color}
                          strokeWidth="8"
                          className="drum-ripple-anim"
                        />
                        <circle
                          cx={piece.cx}
                          cy={piece.cy}
                          r={piece.r * 0.9}
                          fill={piece.color}
                          opacity="0.4"
                          className="drum-flash-anim"
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="drum-kit-legend">
            <span>
              {lastHitName && lastHitName !== 'Toque para tocar' && lastHitName !== 'Pronto para tocar!'
                ? `🥁 Tocado: ${lastHitName}`
                : 'Toque na bateria para ouvir bumbos, caixa, pratos e tons reais'}
            </span>
          </div>
        </>
      ) : (
        /* Modo Compacto no Celular: Permite abrir o kit com 1 toque sem ocupar espaço */
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed var(--card-border)',
            borderRadius: '10px',
            padding: '10px',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <span>🥁 Toque aqui para abrir a bateria e tocar no kit completo</span>
          <ChevronDown size={14} color="var(--neon-cyan)" />
        </button>
      )}
    </div>
  );
}

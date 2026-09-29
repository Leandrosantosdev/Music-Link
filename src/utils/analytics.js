/**
 * Analytics — três modos suportados (define só o que for usar no .env):
 *
 * 1. Google Tag Manager (recomendado): VITE_GTM_ID=GTM-XXXXXXX
 *    → carrega o container; as tags de GA4/Clarity são gerenciadas no GTM.
 *    A CSP já autoriza googletagmanager.com (script) e os endpoints de
 *    GA4/Clarity/doubleclick (connect), então as tags do container funcionam.
 *
 * 2. GA4 direto: VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Microsoft Clarity direto: VITE_CLARITY_PROJECT_ID=xxxxxxx
 *
 * Os scripts são injetados via DOM (sem script inline), mantendo
 * compatibilidade com a CSP estrita do site. Sem IDs no .env, nada carrega.
 *
 * O carregamento só acontece APÓS o consentimento de cookies (CookieConsent).
 */

const GTM_ID = import.meta.env.VITE_GTM_ID;
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

export function initAnalytics() {
  if (GTM_ID) {
    // GTM gerencia as tags (GA4, Clarity, etc.) pelo painel do Google
    initGTM(GTM_ID);
  } else {
    // Modo direto, sem GTM
    if (GA4_ID) initGA4(GA4_ID);
    if (CLARITY_ID) initClarity(CLARITY_ID);
  }
}

/**
 * Envia um evento para o Google (GTM ou GA4) e para o Microsoft Clarity.
 *
 * - Com GTM: faz dataLayer.push({event}) → as tags do container reagem
 * - Com GA4 direto: usa gtag('event')
 * - Com Clarity: espelha o evento para filtrar gravações de sessão
 *
 * @param {string} name - Nome do evento (letras, números e _, máx. 40 caracteres)
 * @param {Record<string, string|number|boolean>} [params] - Parâmetros do evento
 */
export function trackEvent(name, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      // GA4 direto
      window.gtag('event', name, params);
    } else if (Array.isArray(window.dataLayer)) {
      // GTM: um push de evento para o dataLayer
      window.dataLayer.push({ event: name, ...params });
    }
    if (typeof window.clarity === 'function') {
      window.clarity('event', name);
    }
  } catch {
    // Analytics nunca deve quebrar a interação do usuário
  }
}

/**
 * Google Tag Manager — snippet oficial adaptado (sem script inline)
 */
function initGTM(id) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}

/**
 * Google Analytics 4 — equivalente ao snippet oficial, sem script inline
 */
function initGA4(id) {
  window.dataLayer = window.dataLayer || [];

  // gtag depende de `arguments` (não usar arrow function)
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
}

/**
 * Microsoft Clarity — snippet oficial adaptado (sem script inline)
 */
function initClarity(id) {
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = `https://www.clarity.ms/tag/${i}`;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', id);
}

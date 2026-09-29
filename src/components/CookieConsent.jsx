import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { initAnalytics } from '../utils/analytics';

const CONSENT_KEY = 'lgpd_analytics_consent';

/**
 * Lê o consentimento salvo: 'accepted' | 'denied' | null (nunca respondeu)
 */
function getStoredConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

/**
 * Banner de consentimento LGPD.
 * O GA4 e o Microsoft Clarity SÓ são carregados após o aceite explícito
 * do usuário — antes disso, nenhum cookie ou script de análise é criado.
 *
 * Fluxo:
 * - 'accepted' → analytics carregado (na montagem ou ao aceitar)
 * - 'denied'   → analytics nunca é inicializado e o banner não volta
 * - null       → banner visível aguardando decisão
 */
export function CookieConsent() {
  const [consent, setConsent] = useState(() => getStoredConsent());

  // Carrega analytics quando o consentimento fica 'accepted'
  // (cobre tanto o visitante recorrente quanto quem acabou de aceitar)
  useEffect(() => {
    if (consent === 'accepted') {
      initAnalytics();
    }
  }, [consent]);

  const storeConsent = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage indisponível: vale apenas para a sessão atual
    }
    setConsent(value);
  };

  if (consent !== null) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Consentimento de cookies">
      <div className="cookie-consent-icon" aria-hidden="true">
        <Cookie size={18} />
      </div>

      <p className="cookie-consent-text">
        Este site usa cookies de análise (Google Analytics e Microsoft Clarity) para
        entender como os visitantes navegam. Você pode aceitar ou continuar sem eles.
      </p>

      <div className="cookie-consent-actions">
        <button
          type="button"
          onClick={() => storeConsent('accepted')}
          className="cookie-btn cookie-btn-accept"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => storeConsent('denied')}
          className="cookie-btn cookie-btn-deny"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}

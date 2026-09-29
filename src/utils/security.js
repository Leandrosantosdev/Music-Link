/**
 * Utilitários de segurança para links e manipulação de URLs
 * Garante proteção contra XSS, reverse tabnabbing e injeção de protocolos inseguros.
 */

const ALLOWED_PROTOCOLS = ['https:', 'mailto:', 'tel:'];

/**
 * Valida e sanitiza uma URL para garantir que use protocolos seguros
 * @param {string} rawUrl - A URL a ser sanitizada
 * @param {string} fallback - URL de fallback caso seja inválida
 * @returns {string} URL segura
 */
export function sanitizeUrl(rawUrl, fallback = '#') {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;

  const trimmed = rawUrl.trim();

  // Bloqueio explícito de protocolos perigosos
  const dangerousPatterns = /^(javascript:|vbscript:|data:|file:)/i;
  if (dangerousPatterns.test(trimmed)) {
    console.warn(`[Segurança] Bloqueada tentativa de URL insegura: ${trimmed}`);
    return fallback;
  }

  try {
    // Se for URL relativa que começa com /, é segura dentro da mesma origem
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
      return trimmed;
    }

    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      console.warn(`[Segurança] Protocolo não autorizado (${parsed.protocol}): ${trimmed}`);
      return fallback;
    }

    return parsed.href;
  } catch {
    // Se não for uma URL absoluta válida com protocolo, mas parecer domínio ou path seguro
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return fallback;
  }
}

/**
 * Verifica se a URL é segura e HTTPS
 * @param {string} url
 * @returns {boolean}
 */
export function isSafeHttpsUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Copia texto para a área de transferência de forma segura e com fallback
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboardSafe(text) {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback legado para ambientes sem navigator.clipboard
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('[Segurança] Falha ao copiar:', err);
    return false;
  }
}

import React from 'react';

export function Footer({ name }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <p>
        © {currentYear} <strong>{name} Drummer</strong> • Todos os direitos reservados.
      </p>
    </footer>
  );
}

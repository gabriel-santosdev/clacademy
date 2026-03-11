<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__copy">© 2026 CL Academy. Todos os direitos reservados.</p>
      <div class="footer__icons">
        <a href="https://www.instagram.com/clacademyyy" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a href="#" aria-label="Email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="2,4 12,13 22,4" />
          </svg>
        </a>
      </div>
    </div>

    <div class="footer__dev-bar">
      <a href="https://www.instagram.com/gabrielsantos.tec/" target="_blank" rel="noopener" class="footer__dev">
        <span>Desenvolvido por</span>
        <img src="../assets/gabriel.png" alt="Gabriel Santos" class="footer__dev-logo" />
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 20px 0;
}

.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer__copy {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.footer__icons {
  display: flex;
  gap: 14px;
  align-items: center;
}

.footer__icons a {
  color: var(--text-muted);
  transition: color 0.2s;
}

.footer__icons a:hover {
  color: var(--text-dark);
}

@media (max-width: 480px) {
  .footer__inner {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

.footer__dev-bar {
  border-top: 1px solid var(--border);
  padding: 14px 0;
  display: flex;
  justify-content: center;
  background: var(--dark);
}

.footer__dev {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--sand);
  font-size: 0.75rem;
  font-family: var(--font-body);
  letter-spacing: 0.03em;
  transition: opacity 0.2s;
}

.footer__dev:hover {
  opacity: 0.7;
}

.footer__dev-logo {
  height: 22px;
  width: auto;
  object-fit: contain;
}
</style>

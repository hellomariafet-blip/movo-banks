(() => {
  const currentPage = location.pathname.split('/').pop() || 'movo-banks-dashboard.html';
  const links = [
    { href: 'bank-ratings.html', label: 'Banks' },
    { href: 'saving-rates.html', label: 'Savings' },
    { href: 'transfers.html', label: 'Transfers' },
    { href: 'guides.html', label: 'Guides' }
  ];

  const styleId = 'movo-footer-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .movo-footer {
        margin-top: 64px;
        padding: 48px var(--page-px, var(--movo-page-gutter, clamp(20px, 5.55vw, 80px)));
        background: #151515;
        color: #fff;
      }

      .movo-footer__inner {
        width: 100%;
        max-width: var(--content-max, var(--movo-content-max, 1200px));
        margin: 0 auto;
      }

      .movo-footer__top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 32px;
      }

      .movo-footer__brand {
        display: grid;
        gap: 8px;
        max-width: 430px;
      }

      .movo-footer__logo {
        color: #fff;
        font-family: "Montserrat Alternates", Inter, Arial, sans-serif;
        font-size: 26px;
        font-weight: 800;
        line-height: 1;
        text-transform: lowercase;
      }

      .movo-footer__tagline {
        margin: 0;
        color: rgba(255, 255, 255, .62);
        font: 400 14px/1.55 Inter, Arial, sans-serif;
      }

      .movo-footer__links {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex-wrap: wrap;
      }

      .movo-footer__links a {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        padding: 0 14px;
        border-radius: 10px;
        color: rgba(255, 255, 255, .74);
        font: 600 14px/1.2 Inter, Arial, sans-serif;
        text-decoration: none;
      }

      .movo-footer__links a:hover,
      .movo-footer__links a[aria-current="page"] {
        background: rgba(255, 255, 255, .1);
        color: #fff;
      }

      .movo-footer__links a:focus-visible {
        outline: 3px solid rgba(27, 86, 245, .45);
        outline-offset: 3px;
      }

      .movo-footer__divider {
        height: 1px;
        margin: 34px 0 18px;
        background: rgba(255, 255, 255, .14);
      }

      .movo-footer__copy {
        margin: 0;
        color: rgba(255, 255, 255, .44);
        font: 400 12px/1.45 Inter, Arial, sans-serif;
      }

      @media (max-width: 767px) {
        .movo-footer {
          margin-top: 44px;
          padding-top: 36px;
          padding-bottom: 36px;
        }

        .movo-footer__top {
          flex-direction: column;
          gap: 24px;
        }

        .movo-footer__links {
          justify-content: flex-start;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const footer = document.createElement('footer');
  footer.className = 'movo-footer';
  footer.innerHTML = `
    <div class="movo-footer__inner">
      <div class="movo-footer__top">
        <div class="movo-footer__brand">
          <div class="movo-footer__logo">movo</div>
          <p class="movo-footer__tagline">Compare UAE banks with customer scores, savings rates and transfer estimates.</p>
        </div>
        <nav class="movo-footer__links" aria-label="Footer navigation">
          ${links.map(link => {
            const active = currentPage === link.href ? ' aria-current="page"' : '';
            return `<a href="${link.href}"${active}>${link.label}</a>`;
          }).join('')}
        </nav>
      </div>
      <div class="movo-footer__divider"></div>
      <p class="movo-footer__copy">© 2026 MOVO. All rights reserved.</p>
    </div>
  `;

  const existing = document.querySelector('footer');
  if (existing) {
    existing.replaceWith(footer);
  } else {
    document.body.appendChild(footer);
  }
})();

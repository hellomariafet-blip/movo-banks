(() => {
  const header = document.querySelector('.header');
  const nav = header?.querySelector('.nav');
  if (header && nav) {
    const bankLink = [...nav.querySelectorAll('a')].find(link => link.getAttribute('href') === 'bank-ratings.html');
    if (bankLink) bankLink.textContent = 'Banks';

    let hamburger = header.querySelector('.hamburger');
    if (!hamburger) {
      hamburger = document.createElement('button');
      hamburger.className = 'hamburger movo-site-menu-toggle';
      hamburger.type = 'button';
      hamburger.setAttribute('aria-label', 'Open menu');
      hamburger.setAttribute('aria-controls', nav.id || 'primary-navigation');
      hamburger.innerHTML = '<span></span><span></span><span></span>';
      header.appendChild(hamburger);
    }
    hamburger.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    };

    hamburger.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) closeMenu();
    });

    const current = location.pathname.split('/').pop() || 'movo-banks-dashboard.html';
    const isBankProfile = /-bank-page\.html$|wio-bank-profile\.html$/.test(current);
    nav.querySelectorAll('a').forEach(link => {
      const target = link.getAttribute('href')?.split('#')[0];
      if (target === current || (isBankProfile && target === 'bank-ratings.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  document.querySelectorAll('.footer-copy, .fcopy').forEach(node => {
    node.textContent = `© ${new Date().getFullYear()} MOVO. All rights reserved.`;
  });

  window.showMovoToast = message => {
    document.querySelector('.movo-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'movo-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  };

  const rateLinks = [...document.querySelectorAll('.btn-black, .btn-white')]
    .filter(link => /rate/i.test(link.textContent));
  rateLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const bankName = document.querySelector('.hero-name')?.textContent.trim() || 'this bank';
    const backdrop = document.createElement('div');
    backdrop.className = 'movo-modal-backdrop';
    backdrop.innerHTML = `
      <form class="movo-modal" role="dialog" aria-modal="true" aria-labelledby="movo-review-title">
        <div class="movo-modal-head">
          <div>
            <h2 id="movo-review-title">Rate ${bankName}</h2>
            <p>Your review helps other people compare banks.</p>
          </div>
          <button class="movo-modal-close" type="button" aria-label="Close review form">×</button>
        </div>
        <div class="movo-stars" aria-label="Rating">
          ${[1,2,3,4,5].map(value => `<button class="movo-star" type="button" aria-label="${value} star" data-value="${value}">★</button>`).join('')}
        </div>
        <label class="movo-field" for="movo-review-copy">
          <span class="movo-label">Short review</span>
          <span class="movo-input-wrap"><textarea class="movo-textarea" id="movo-review-copy" placeholder="What worked well? What could be better?" required></textarea></span>
        </label>
        <button class="movo-button movo-button--primary movo-modal-submit" type="submit">Submit review</button>
      </form>`;
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    let rating = 0;
    const close = () => {
      backdrop.remove();
      document.body.style.overflow = '';
    };
    backdrop.querySelector('.movo-modal-close').addEventListener('click', close);
    backdrop.addEventListener('click', modalEvent => {
      if (modalEvent.target === backdrop) close();
    });
    backdrop.querySelectorAll('.movo-star').forEach(star => {
      star.addEventListener('click', () => {
        rating = Number(star.dataset.value);
        backdrop.querySelectorAll('.movo-star').forEach(item => {
          item.classList.toggle('selected', Number(item.dataset.value) <= rating);
        });
      });
    });
    backdrop.querySelector('form').addEventListener('submit', submitEvent => {
      submitEvent.preventDefault();
      if (!rating) {
        showMovoToast('Choose a star rating first.');
        return;
      }
      close();
      showMovoToast('Review saved in this prototype.');
    });
    backdrop.querySelector('.movo-star').focus();
  }));
})();

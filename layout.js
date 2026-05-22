// Shared nav HTML — injected by each page
function getNavHTML(root = '') {
  return `
  <nav class="nav">
    <a href="${root}index.html" class="nav-logo">
      <img src="${root}assets/logo.png" alt="The Long Draw" />
    </a>
    <div class="nav-links">
      <a href="${root}pages/shop.html">Shop</a>
      <a href="${root}pages/about.html">About</a>
      <a href="${root}pages/contact.html">Contact</a>
    </div>
    <div class="nav-right">
      <button class="nav-cart" id="cart-btn" aria-label="Cart">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <span class="cart-count" id="cart-count">0</span>
      </button>
      <button class="nav-hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="mobile-menu" id="mobile-menu">
    <div class="mobile-menu-header">
      <img src="${root}assets/logo.png" alt="The Long Draw" style="height:24px;filter:brightness(0) saturate(100%) invert(67%) sepia(40%) saturate(500%) hue-rotate(5deg) brightness(90%);" />
      <button class="mobile-menu-close" id="mobile-close">&times;</button>
    </div>
    <nav>
      <a href="${root}pages/shop.html">Shop</a>
      <a href="${root}pages/about.html">About</a>
      <a href="${root}pages/contact.html">Contact</a>
    </nav>
  </div>

  <div class="cart-drawer" id="cart-drawer">
    <div class="cart-header">
      <span class="cart-title">Your cart</span>
      <button class="cart-close" id="cart-close">&times;</button>
    </div>
    <div class="cart-items" id="cart-items"></div>
    <div class="cart-footer" id="cart-footer"></div>
  </div>
  <div class="cart-overlay" id="cart-overlay"></div>`;
}

function getFooterHTML(root = '') {
  return `
  <footer class="footer">
    <a href="${root}index.html" class="footer-logo">
      <img src="${root}assets/logo.png" alt="The Long Draw" />
    </a>
    <div class="footer-links">
      <a href="${root}pages/shop.html">Shop</a>
      <a href="${root}pages/about.html">About</a>
      <a href="${root}pages/contact.html">Contact</a>
      <a href="https://instagram.com/thelongdraw" target="_blank">Instagram</a>
      <a href="https://tiktok.com/@thelongdraw" target="_blank">TikTok</a>
    </div>
    <span class="footer-copy">&copy; 2025 The Long Draw</span>
  </footer>`;
}

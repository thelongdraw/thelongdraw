// ── CART ──
let cartId = localStorage.getItem('ld_cart_id') || null;

async function ensureCart() {
  if (!cartId) {
    const cart = await createCart();
    cartId = cart.id;
    localStorage.setItem('ld_cart_id', cartId);
  }
  return cartId;
}

function renderCart(cart) {
  const items = cart.lines.edges;
  const count = items.reduce((s, e) => s + e.node.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  if (!itemsEl) return;

  if (!items.length) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (footerEl) footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = items.map(({ node: n }) => {
    const img = n.merchandise.product.images.edges[0]?.node.url || '';
    return `<div class="cart-item">
      ${img ? `<img class="cart-item-img" src="${img}" alt="${n.merchandise.product.title}" />` : '<div class="cart-item-img"></div>'}
      <div class="cart-item-info">
        <p class="cart-item-name">${n.merchandise.product.title}</p>
        <p class="cart-item-price">${formatPrice(n.merchandise.price.amount)} &times; ${n.quantity}</p>
      </div>
      <button class="cart-item-remove" onclick="handleRemove('${n.id}')">&times;</button>
    </div>`;
  }).join('');

  if (footerEl) {
    const t = cart.cost.totalAmount;
    footerEl.innerHTML = `
      <div class="cart-total"><span>Total</span><span>${formatPrice(t.amount, t.currencyCode)}</span></div>
      <a href="${cart.checkoutUrl}" class="btn btn-solid btn-full">Checkout &rarr;</a>`;
  }
}

async function handleAddToCart(variantId) {
  const btn = document.getElementById('add-to-cart-btn');
  if (btn) { btn.textContent = 'Adding...'; btn.disabled = true; }
  try {
    await ensureCart();
    const cart = await addToCart(cartId, variantId);
    renderCart(cart);
    openCart();
  } catch(e) { console.error(e); }
  finally {
    if (btn) { btn.textContent = 'Add to cart'; btn.disabled = false; }
  }
}

async function handleRemove(lineId) {
  try {
    await ensureCart();
    const cart = await removeFromCart(cartId, lineId);
    renderCart(cart);
  } catch(e) { console.error(e); }
}

function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
}
function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  // ── MOBILE NAV ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  hamburger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ── EMAIL SIGNUP ──
  document.getElementById('email-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('email-input');
    if (input?.value) {
      input.value = '';
      const msg = document.getElementById('email-msg');
      if (msg) { msg.textContent = "You're on the list."; msg.style.display = 'block'; }
    }
  });
});

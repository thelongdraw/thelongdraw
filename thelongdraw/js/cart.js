let cartId = localStorage.getItem('ld_cart_id') || null;
let cartData = null;

async function ensureCart() {
  if (!cartId) {
    const cart = await createCart();
    cartId = cart.id;
    localStorage.setItem('ld_cart_id', cartId);
  }
  return cartId;
}

function renderCart(cart) {
  cartData = cart;
  const items = cart.lines.edges;
  const count = items.reduce((sum, e) => sum + e.node.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle('visible', count > 0);
  }

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  if (!itemsEl) return;

  if (items.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (footerEl) footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = items.map(({ node }) => {
    const img = node.merchandise.product.images.edges[0]?.node.url || '';
    return `
      <div class="cart-item">
        ${img ? `<img class="cart-item-img" src="${img}" alt="${node.merchandise.product.title}" />` : '<div class="cart-item-img"></div>'}
        <div class="cart-item-info">
          <p class="cart-item-name">${node.merchandise.product.title}</p>
          <p class="cart-item-price">${formatPrice(node.merchandise.price.amount)} &times; ${node.quantity}</p>
        </div>
        <button class="cart-item-remove" onclick="handleRemove('${node.id}')">&times;</button>
      </div>
    `;
  }).join('');

  const total = cart.cost.totalAmount;
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="cart-total">
        <span>Total</span>
        <span>${formatPrice(total.amount, total.currencyCode)}</span>
      </div>
      <a href="${cart.checkoutUrl}" class="btn btn-solid" style="width:100%;text-align:center;display:block;">
        Checkout &rarr;
      </a>
    `;
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
  } catch (e) {
    console.error(e);
  } finally {
    if (btn) { btn.textContent = 'Add to cart'; btn.disabled = false; }
  }
}

async function handleRemove(lineId) {
  try {
    await ensureCart();
    const cart = await removeFromCart(cartId, lineId);
    renderCart(cart);
  } catch (e) {
    console.error(e);
  }
}

function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

document.getElementById('cart-btn')?.addEventListener('click', openCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

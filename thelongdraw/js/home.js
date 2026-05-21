async function loadFeaturedProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  try {
    const products = await getProducts(6);
    if (products.length === 0) {
      grid.innerHTML = '<p style="padding:2rem;color:#6b6760;font-size:14px;">Products coming soon.</p>';
      return;
    }
    grid.innerHTML = products.map(p => {
      const img = p.images.edges[0]?.node.url;
      const price = p.priceRange.minVariantPrice;
      return `
        <a href="pages/product.html?handle=${p.handle}" class="product-card">
          ${img
            ? `<img class="product-img" src="${img}" alt="${p.title}" />`
            : `<div class="product-img-placeholder">No image</div>`}
          <p class="product-name">${p.title}</p>
          <p class="product-material">${p.description?.split('.')[0] || ''}</p>
          <p class="product-price">${formatPrice(price.amount, price.currencyCode)}</p>
        </a>
      `;
    }).join('');
  } catch (e) {
    grid.innerHTML = '<p style="padding:2rem;color:#6b6760;font-size:14px;">Products coming soon.</p>';
  }
}

loadFeaturedProducts();

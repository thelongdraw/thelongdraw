const SHOPIFY_DOMAIN = 'feez07-2e.myshopify.com';
const SHOPIFY_TOKEN = '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';
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function getProducts(first = 24) {
  const { data } = await shopifyFetch(`
    query($first: Int!) {
      products(first: $first) {
        edges { node {
          id title handle description vendor
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url altText } } }
          variants(first: 1) { edges { node { id } } }
        }}
      }
    }`, { first });
  return data.products.edges.map(e => e.node);
}

async function getProduct(handle) {
  const { data } = await shopifyFetch(`
    query($handle: String!) {
      product(handle: $handle) {
        id title handle description vendor
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 8) { edges { node { url altText } } }
        variants(first: 20) { edges { node {
          id title availableForSale
          price { amount currencyCode }
        }}}
      }
    }`, { handle });
  return data.product;
}

async function createCart() {
  const { data } = await shopifyFetch(`
    mutation { cartCreate { cart { id checkoutUrl } } }
  `);
  return data.cartCreate.cart;
}

async function addToCart(cartId, merchandiseId, quantity = 1) {
  const { data } = await shopifyFetch(`
    mutation($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
    fragment CartFields on Cart {
      id checkoutUrl
      cost { totalAmount { amount currencyCode } }
      lines(first: 20) { edges { node {
        id quantity
        merchandise { ... on ProductVariant {
          id title price { amount currencyCode }
          product { title images(first:1){ edges{ node{ url } } } }
        }}
      }}}
    }`, { cartId, lines: [{ merchandiseId, quantity }] });
  return data.cartLinesAdd.cart;
}

async function removeFromCart(cartId, lineId) {
  const { data } = await shopifyFetch(`
    mutation($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
      }
    }
    fragment CartFields on Cart {
      id checkoutUrl
      cost { totalAmount { amount currencyCode } }
      lines(first: 20) { edges { node {
        id quantity
        merchandise { ... on ProductVariant {
          id title price { amount currencyCode }
          product { title images(first:1){ edges{ node{ url } } } }
        }}
      }}}
    }`, { cartId, lineIds: [lineId] });
  return data.cartLinesRemove.cart;
}

function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

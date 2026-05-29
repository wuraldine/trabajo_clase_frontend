class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || '';
  }

  async request(path, options = {}) {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    const text = await res.text();
    let parsed = text;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    const headers = {};
    for (const [k, v] of res.headers.entries()) headers[k] = v;

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}: ${text}`);
      err.status = res.status;
      err.body = parsed;
      err.headers = headers;
      throw err;
    }

    return { status: res.status, data: parsed, headers };
  }
}

class ProductService {
  constructor(client) {
    this.client = client;
  }
  list(query = '') {
    return this.client.request(`/products${query ? `?${query}` : ''}`);
  }
  get(id) {
    return this.client.request(`/products/${id}`);
  }
  create(payload) {
    return this.client.request(`/products`, { method: 'POST', body: JSON.stringify(payload) });
  }
  update(id, payload) {
    return this.client.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }
  remove(id) {
    return this.client.request(`/products/${id}`, { method: 'DELETE' });
  }
}

class AuthService {
  constructor(client) { this.client = client; }
  login(credentials) { return this.client.request(`/auth/login`, { method: 'POST', body: JSON.stringify(credentials) }); }
  register(data) { return this.client.request(`/auth/register`, { method: 'POST', body: JSON.stringify(data) }); }
  me() { return this.client.request(`/auth/me`); }
}

class CartService {
  constructor(client) { this.client = client; }
  getCart() { return this.client.request(`/cart`); }
  addItem(item) { return this.client.request(`/cart/items`, { method: 'POST', body: JSON.stringify(item) }); }
  removeItem(itemId) { return this.client.request(`/cart/items/${itemId}`, { method: 'DELETE' }); }
}

class OrderService {
  constructor(client) { this.client = client; }
  placeOrder(payload) { return this.client.request(`/orders`, { method: 'POST', body: JSON.stringify(payload) }); }
  getOrders() { return this.client.request(`/orders`); }
  getOrder(id) { return this.client.request(`/orders/${id}`); }
}

class AdminService {
  constructor(client) { this.client = client; }
  getUsers() { return this.client.request(`/admin/users`); }
  getProducts() { return this.client.request(`/admin/products`); }
}

export {
  ApiClient,
  ProductService,
  AuthService,
  CartService,
  OrderService,
  AdminService,
};

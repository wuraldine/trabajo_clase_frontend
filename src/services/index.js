import { ApiClient, ProductService, AuthService, CartService, OrderService, AdminService } from './ComplementServices';

const baseUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : '';

const api = new ApiClient(baseUrl);

export const productService = new ProductService(api);
export const authService = new AuthService(api);
export const cartService = new CartService(api);
export const orderService = new OrderService(api);
export const adminService = new AdminService(api);

export default api;

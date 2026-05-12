import api from "./api";

// Auth Service
export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/update-profile", data),
  changePassword: (data) => api.post("/auth/change-password", data),
};

// Product Service
export const productService = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get("/products/categories"),
  getFeatured: () => api.get("/products/featured"),
};

// Cart Service
export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId, quantity) =>
    api.post("/cart/add", { productId, quantity }),
  updateCartItem: (itemId, quantity) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),
};

// Order Service
export const orderService = {
  createOrder: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders"),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.delete(`/orders/${orderId}/cancel`),
};

// Admin Service
export const adminService = {
  getAllUsers: () => api.get("/admin/users/all"),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getDashboardStats: () => api.get("/admin/analytics"),
  getAllOrders: () => api.get("/admin/analytics/orders/stats"),
  updateOrderStatus: (orderId, status) =>
    api.put(`/admin/${orderId}/status`, { status }),
};

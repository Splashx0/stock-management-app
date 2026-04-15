import apiClient from "./apiClient";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isStaff: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  getAll: () => apiClient.get<User[]>("/api/users"),
  getById: (id: number) => apiClient.get<User>(`/api/users/${id}`),
  create: (data: Partial<User>) => apiClient.post<User>("/api/users", data),
  update: (id: number, data: Partial<User>) =>
    apiClient.put<User>(`/api/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/users/${id}`),
};

export interface Customer {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export const customerService = {
  getAll: () => apiClient.get<Customer[]>("/api/customers"),
  getById: (id: number) => apiClient.get<Customer>(`/api/customers/${id}`),
  create: (data: Partial<Customer>) =>
    apiClient.post<Customer>("/api/customers", data),
  update: (id: number, data: Partial<Customer>) =>
    apiClient.put<Customer>(`/api/customers/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/customers/${id}`),
};

export interface Product {
  id: number;
  name: string;
  price: number;
  reference: string;
  categoryId?: number;
  quantity: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  createdAt: string;
  updatedAt: string;
}

export const productService = {
  getAll: () => apiClient.get<Product[]>("/api/products"),
  getById: (id: number) => apiClient.get<Product>(`/api/products/${id}`),
  create: (data: Partial<Product>) =>
    apiClient.post<Product>("/api/products", data),
  update: (id: number, data: Partial<Product>) =>
    apiClient.put<Product>(`/api/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/products/${id}`),
};

export interface Order {
  id: number;
  customerId?: number;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  priceTotal: number;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  getAll: () => apiClient.get<Order[]>("/api/orders"),
  getById: (id: number) => apiClient.get<Order>(`/api/orders/${id}`),
  create: (data: Partial<Order>) => apiClient.post<Order>("/api/orders", data),
  update: (id: number, data: Partial<Order>) =>
    apiClient.put<Order>(`/api/orders/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/orders/${id}`),
};

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  getAll: () => apiClient.get<Category[]>("/api/categories"),
  getById: (id: number) => apiClient.get<Category>(`/api/categories/${id}`),
  create: (data: Partial<Category>) =>
    apiClient.post<Category>("/api/categories", data),
  update: (id: number, data: Partial<Category>) =>
    apiClient.put<Category>(`/api/categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/categories/${id}`),
};

export interface Driver {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const driverService = {
  getAll: () => apiClient.get<Driver[]>("/api/drivers"),
  getById: (id: number) => apiClient.get<Driver>(`/api/drivers/${id}`),
  create: (data: Partial<Driver>) =>
    apiClient.post<Driver>("/api/drivers", data),
  update: (id: number, data: Partial<Driver>) =>
    apiClient.put<Driver>(`/api/drivers/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/drivers/${id}`),
};

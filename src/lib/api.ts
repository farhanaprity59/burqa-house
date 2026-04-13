const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginData {
  user: UserData;
  token: string;
  token_type: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  created_at: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'Something went wrong',
      errors: data.errors || {},
    };
  }

  return data;
}

export const api = {
  // Auth
  register: (body: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) =>
    request<LoginData>('/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<LoginData>('/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: () =>
    request('/logout', {
      method: 'POST',
    }),

  getUser: () => request<UserData>('/user'),

  // Products
  getProducts: (params?: string) =>
    request(`/products${params ? `?${params}` : ''}`),

  getProduct: (id: string | number) => request(`/products/${id}`),
};

// Frontend API client utility
// Uses import.meta.env.VITE_API_URL from environment variables
// If not set, uses relative paths (same origin) for Vercel serverless functions
// For local dev with Vercel: run `vercel dev` to test API routes
// For production: set VITE_API_URL to your Vercel domain (or leave empty for same origin)

const API_URL = ((import.meta as any).env?.VITE_API_URL as string) || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log('API Request:', url); // Debug log
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // More helpful error messages
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      return {
        success: false,
        error: 'Cannot connect to server. For local dev, run `vercel dev`. For production, ensure API is deployed.',
      };
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// API functions
export const api = {
  // Health check
  async checkHealth() {
    return apiRequest<{ status: string; message: string; timestamp: string }>('/api/health');
  },

  // Products
  async getProducts() {
    return apiRequest<Array<{
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      createdAt: string;
    }>>('/api/products');
  },

  async createProduct(product: {
    name: string;
    price: number;
    imageUrl: string;
  }) {
    return apiRequest<{
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      createdAt: string;
    }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // Orders
  async createOrder(order: {
    customer: string;
    phone: string;
    total: number;
  }) {
    return apiRequest<{
      id: string;
      customer: string;
      phone: string;
      total: number;
      createdAt: string;
    }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  // Auth
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return apiRequest<{
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      role: string;
      address: string | null;
      apartment: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
      country: string | null;
      createdAt: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(credentials: {
    email: string;
    password: string;
  }) {
    return apiRequest<{
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      role: string;
      address: string | null;
      apartment: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
      country: string | null;
      createdAt: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getCurrentUser(userId: string) {
    return apiRequest<{
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      role: string;
      address: string | null;
      apartment: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
      country: string | null;
      createdAt: string;
    }>(`/api/auth/me?userId=${userId}`);
  },

  async forgotPassword(email: string) {
    return apiRequest<{
      message?: string;
    }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

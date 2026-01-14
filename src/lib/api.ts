
interface ApiError {
    success: false;
    error: string;
}

interface ApiSuccess<T> {
    success: true;
    data: T;
    count?: number;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// For local dev: use Express server at localhost:3000
// For production: use empty string to use same-origin (Vercel serverless functions)
// If VITE_API_URL is not set or empty, use relative paths for Vercel
const getApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL as string;
  if (!envUrl || envUrl === '') {
    // Empty or not set - use relative paths for Vercel serverless functions
    return '';
  }
  // Use the provided URL (e.g., http://localhost:3000 for local dev)
  return envUrl;
};

const API_URL = getApiUrl();

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        // Endpoints already include /api prefix, so use as-is
        const url = `${API_URL}${endpoint}`;
        // Debug: Log the request details in development
        console.log('API Request:', { method: options.method || 'GET', url, endpoint, API_URL });
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 200));
            return {
                success: false,
                error: `API endpoint not found or returned HTML. Endpoint: ${endpoint}`,
            };
        }

        const data = await response.json();
        
        // If response has error status, return error
        if (!response.ok) {
            return {
                success: false,
                error: data.error || data.message || `HTTP ${response.status}`,
            };
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Check for JSON parse errors
        if (errorMessage.includes('Unexpected token') || errorMessage.includes('JSON')) {
            return {
                success: false,
                error: 'Server returned invalid response. API endpoint may not exist.',
            };
        }

        // Check for connection failure
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            return {
                success: false,
                error: 'Cannot connect to server. Ensure backend is running.',
            };
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}

export const api = {
    // Health check
    checkHealth: () => request<{ status: string; message: string; timestamp: string }>('/api/health'),

    // Auth
    register: (data: any) => request<any>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    login: (data: any) => request<any>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Products
    getProducts: () => request<any[]>('/api/products'),
    getProduct: (id: string) => request<any>(`/api/products/${id}`),
    createProduct: (data: any) => request<any>('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateProduct: (id: string, data: any) => request<any>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteProduct: (id: string) => request<any>(`/api/products/${id}`, {
        method: 'DELETE',
    }),

    // Orders
    getOrders: () => request<any[]>('/api/orders'),
    getOrder: (id: string) => request<any>(`/api/orders/${id}`),
    createOrder: (data: any) => request<any>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateOrder: (id: string, data: any) => request<any>(`/api/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Settings
    getSettings: () => request<any>('/api/settings'),
    updateSetting: (data: any) => request<any>('/api/settings', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Addresses
    getAddresses: (userId: string) => request<any[]>(`/api/addresses?userId=${userId}`),
    createAddress: (data: any) => request<any>('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateAddress: (id: string, data: any) => request<any>(`/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteAddress: (id: string) => request<any>(`/api/addresses/${id}`, {
        method: 'DELETE',
    }),
    setDefaultAddress: async (id: string) => {
        // First get the address to check if it exists and get userId
        const getResponse = await request<any>(`/api/addresses/${id}`);
        if (!getResponse.success || !getResponse.data) {
            return getResponse;
        }
        // Then update it with isDefault: true (this will unset other defaults)
        return request<any>(`/api/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ isDefault: true }),
        });
    },
};

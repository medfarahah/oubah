/**
 * EXAMPLE: How to use the API in your React components
 * 
 * This file shows examples - you can delete it or use it as reference
 */

import { useState, useEffect } from 'react';
import { api } from './api';

// Example: Fetch products on component mount
export function ProductsExample() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const response = await api.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

// Example: Create an order
export async function createOrderExample() {
  const response = await api.createOrder({
    customer: 'John Doe',
    phone: '+1234567890',
    total: 199.99,
  });

  if (response.success) {
    console.log('Order created:', response.data);
    return response.data;
  } else {
    console.error('Error:', response.error);
    return null;
  }
}

// Example: Health check
export async function checkBackendHealth() {
  const response = await api.checkHealth();
  if (response.success) {
    console.log('Backend is healthy:', response.data);
  }
}

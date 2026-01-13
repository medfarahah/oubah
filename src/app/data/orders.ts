import { Order, CartItem, ShippingInfo, PaymentInfo } from '../types';

// In-memory storage for orders (in production, this would be a database)
let orders: Order[] = [];

export function getOrders(): Order[] {
  return [...orders];
}

export function addOrder(order: Order): void {
  orders.push(order);
}

export function updateOrderStatus(orderId: string, status: string): void {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    (order as any).status = status;
  }
}

export function getOrderById(orderId: string): Order | undefined {
  return orders.find((o) => o.id === orderId);
}

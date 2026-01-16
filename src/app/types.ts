export interface Product {
  id: string;
  name: string;
  categories: string[];
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  material?: string;
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  sale?: boolean;
}

export interface CartItem extends Product {
  productId?: string;
  quantity: number;
  size?: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  quartier: string;
  placeToReceive: string;
  deliveryNotes?: string;
}

export interface PaymentInfo {
  paymentMethod: 'waafi' | 'cash';
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: Date;
  status: string;
}

export interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  shippingCost: number;
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
}

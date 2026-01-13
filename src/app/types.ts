export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  material?: string;
  colors?: string[];
   sizes?: string[];
  isNew?: boolean;
  sale?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  deliveryNotes?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'card' | 'paypal' | 'cash';
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
}

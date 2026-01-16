import { Product } from '../types';

let products: Product[] = [
  {
    id: '1',
    name: 'Premium Silk Square Hijab',
    category: 'SILK HIJABS',
    price: 89,
    imageUrl: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoaWphYiUyMGZhc2hpb258ZW58MXx8fHwxNzY4MjY0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Luxurious 100% mulberry silk hijab with a beautiful drape and soft texture. Perfect for special occasions or everyday elegance.',
    material: '100% Mulberry Silk',
    colors: ['#1a1a1a', '#8b7355', '#2c5f2d', '#8b4513'],
    sizes: ['One Size'],
    isNew: true,
  },
  {
    id: '2',
    name: 'Chiffon Evening Hijab',
    category: 'CHIFFON HIJABS',
    price: 65,
    originalPrice: 85,
    imageUrl: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbW9kZXN0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgyNjQ5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Elegant lightweight chiffon hijab with subtle shimmer. Ideal for evening events and celebrations.',
    material: 'Premium Chiffon',
    colors: ['#f5e6d3', '#c9b1a6', '#d4af37', '#2c2c54'],
    sizes: ['One Size'],
    sale: true,
  },
  {
    id: '3',
    name: 'Classic Jersey Hijab',
    category: 'JERSEY HIJABS',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1761660450845-6c3aa8aaf43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2NhcmYlMjBsdXh1cnl8ZW58MXx8fHwxNzY4MTU0NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Comfortable everyday jersey hijab with excellent stretch and breathability. A wardrobe essential.',
    material: 'Premium Jersey Cotton',
    colors: ['#1a1a1a', '#ffffff', '#8b4513', '#2c5f2d', '#696969'],
    sizes: ['One Size'],
  },
  {
    id: '4',
    name: 'Embroidered Luxury Hijab',
    category: 'EMBROIDERED HIJABS',
    price: 125,
    imageUrl: 'https://images.unsplash.com/photo-1536814294574-df49a3cc97bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNsaW0lMjB3b21hbiUyMGZhc2hpb258ZW58MXx8fHwxNzY4MjY0OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Exquisite hand-embroidered hijab featuring intricate floral patterns. A true statement piece.',
    material: 'Silk blend with gold thread embroidery',
    colors: ['#1a1a1a', '#8b7355', '#d4af37'],
    sizes: ['One Size'],
    isNew: true,
  },
  {
    id: '5',
    name: 'Elegant Abaya Set',
    category: 'ABAYAS',
    price: 195,
    imageUrl: 'https://images.unsplash.com/photo-1762376128087-bc29c6df08c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYmF5YSUyMGZhc2hpb258ZW58MXx8fHwxNzY4MjY0OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Flowing abaya with modern silhouette and subtle embellishments. Designed for sophisticated style.',
    material: 'Premium Crepe',
    colors: ['#1a1a1a', '#2c2c54', '#4a4a4a'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isNew: true,
  },
  {
    id: '6',
    name: 'Satin Luxe Hijab',
    category: 'SATIN HIJABS',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1665764045207-a0f035401210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYWJyaWMlMjB0ZXh0dXJlfGVufDF8fHx8MTc2ODE1MzA2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Smooth satin hijab with beautiful sheen and luxurious feel. Perfect for any occasion.',
    material: 'Premium Satin',
    colors: ['#d4af37', '#c9b1a6', '#8b7355', '#1a1a1a'],
    sizes: ['One Size'],
  },
  {
    id: '7',
    name: 'Modal Blend Hijab',
    category: 'MODAL HIJABS',
    price: 55,
    originalPrice: 70,
    imageUrl: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoaWphYiUyMGZhc2hpb258ZW58MXx8fHwxNzY4MjY0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Soft and breathable modal blend hijab. Eco-friendly and incredibly comfortable.',
    material: 'Modal Blend',
    colors: ['#2c5f2d', '#8b4513', '#696969', '#f5e6d3'],
    sizes: ['One Size'],
    sale: true,
  },
  {
    id: '8',
    name: 'Georgette Drape Hijab',
    category: 'GEORGETTE HIJABS',
    price: 68,
    imageUrl: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbW9kZXN0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgyNjQ5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Flowing georgette hijab with beautiful movement and elegant drape.',
    material: 'Premium Georgette',
    colors: ['#c9b1a6', '#f5e6d3', '#8b7355'],
    sizes: ['One Size'],
  },
];

export function getProducts(): Product[] {
  return [...products];
}

// Initialize products on first load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('nura_products');
  if (stored) {
    try {
      products = JSON.parse(stored);
    } catch {
      // Use default products
      localStorage.setItem('nura_products', JSON.stringify(products));
    }
  } else {
    localStorage.setItem('nura_products', JSON.stringify(products));
  }
}

// Export setProducts function that saves to localStorage
export function setProducts(newProducts: Product[]): void {
  products = [...newProducts];
  if (typeof window !== 'undefined') {
    localStorage.setItem('nura_products', JSON.stringify(newProducts));
  }
}

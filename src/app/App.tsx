import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ShoppingCart } from './components/ShoppingCart';
import { Checkout } from './components/Checkout';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { getProducts } from './data/products';
import { Product, CartItem } from './types';
import { toast, Toaster } from 'sonner';
import { AuthProvider, useAuth } from './auth';
import { AuthModal } from './components/AuthModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { FAQ } from './components/FAQ';
import { ShippingReturns } from './components/ShippingReturns';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { SizeGuide } from './components/SizeGuide';
import { UserProfile } from './components/UserProfile';
import { WhatsAppButton } from './components/WhatsAppButton';

type Page = 'home' | 'about' | 'contact' | 'faq' | 'shipping' | 'privacy' | 'terms' | 'size-guide' | 'profile';

function AppInner() {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Check if admin is logged in - show admin dashboard
  if (isAdmin()) {
    return <AdminDashboard />;
  }

  // Show admin login if requested
  if (showAdminLogin) {
    return (
      <AdminLogin
        onSuccess={() => {
          setShowAdminLogin(false);
        }}
        onBack={() => setShowAdminLogin(false)}
      />
    );
  }

  const addToCart = (product: Product, size?: string) => {
    const cartId = size ? `${product.id}-${size}` : product.id;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartId);
      if (existing) {
        toast.success('Quantity updated in cart');
        return prev.map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success('Added to cart');
      return [...prev, { ...product, id: cartId, size, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Removed from cart');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailOpen(true);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    toast.success('Your order has been placed successfully!');
  };

  const products = getProducts();
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = filterCategory && filterCategory !== 'All'
    ? products.filter((p) => p.category === filterCategory)
    : products;

  // Render different pages based on currentPage state
  const renderPageContent = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ />;
      case 'shipping':
        return <ShippingReturns />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'size-guide':
        return <SizeGuide />;
      case 'profile':
        return <UserProfile />;
      case 'home':
      default:
        return (
          <>
            <Hero />

            {/* Featured Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50/30">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 font-serif">
                    Our Collection
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                    Handpicked selection of premium hijabs and modest wear crafted with the finest materials
                  </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category === 'All' ? null : category)}
                      className={`px-6 py-2 text-sm tracking-wider transition-colors ${(category === 'All' && !filterCategory) || filterCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                  <div>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl mb-2">Premium Quality</h3>
                    <p className="text-gray-600">
                      Only the finest materials sourced from trusted suppliers worldwide
                    </p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl mb-2">Fast Shipping</h3>
                    <p className="text-gray-600">
                      Free express shipping on orders over $150 with tracking
                    </p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-xl mb-2">Easy Returns</h3>
                    <p className="text-gray-600">
                      30-day hassle-free returns on all purchases
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-700 text-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl mb-6 font-serif">
                  Join Our Community
                </h2>
                <p className="text-xl mb-8 text-amber-100">
                  Subscribe to receive exclusive offers, styling tips, and be the first to know about new arrivals
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="bg-white text-amber-900 px-8 py-4 hover:bg-amber-50 transition-colors">
                    SUBSCRIBE
                  </button>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  // SEO configuration based on current page
  const getSEOConfig = () => {
    switch (currentPage) {
      case 'about':
        return {
          title: 'About Us - NŪRA Collection',
          description: 'Learn about NŪRA Collection, our mission to provide elegant and luxurious modest fashion. Discover our story, values, and commitment to quality.',
          keywords: 'about nura, modest fashion brand, hijab company, islamic fashion',
        };
      case 'contact':
        return {
          title: 'Contact Us - NŪRA Collection',
          description: 'Get in touch with NŪRA Collection. We\'re here to help with any questions about our products, orders, or services.',
          keywords: 'contact nura, customer service, support, help',
        };
      case 'faq':
        return {
          title: 'Frequently Asked Questions - NŪRA Collection',
          description: 'Find answers to common questions about NŪRA Collection products, shipping, returns, sizing, and more.',
          keywords: 'FAQ, frequently asked questions, help, support',
        };
      case 'shipping':
        return {
          title: 'Shipping & Returns - NŪRA Collection',
          description: 'Learn about NŪRA Collection shipping options, delivery times, and our hassle-free return policy.',
          keywords: 'shipping, returns, delivery, refund policy',
        };
      case 'privacy':
        return {
          title: 'Privacy Policy - NŪRA Collection',
          description: 'Read NŪRA Collection\'s privacy policy to understand how we collect, use, and protect your personal information.',
          keywords: 'privacy policy, data protection, privacy',
        };
      case 'terms':
        return {
          title: 'Terms of Service - NŪRA Collection',
          description: 'Review NŪRA Collection\'s terms of service and conditions for using our website and purchasing products.',
          keywords: 'terms of service, terms and conditions, legal',
        };
      case 'size-guide':
        return {
          title: 'Size Guide - NŪRA Collection',
          description: 'Find the perfect fit with NŪRA Collection\'s comprehensive size guide for hijabs and abayas.',
          keywords: 'size guide, sizing chart, measurements, fit guide',
        };
      default:
        return {
          title: 'NŪRA Collection - Luxury Modest Fashion | Premium Hijabs & Abayas',
          description: 'Discover elegant and luxurious hijabs, abayas, and modest fashion at NŪRA Collection. Premium quality materials, beautiful designs, and exceptional craftsmanship. Free shipping on orders over $150.',
          keywords: 'hijab, abaya, modest fashion, luxury hijabs, silk hijab, chiffon hijab, muslim fashion, islamic clothing, premium hijabs, elegant abayas',
        };
    }
  };

  const seoConfig = getSEOConfig();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
      />
      <Toaster position="top-right" richColors />

      <Header
        onCartClick={() => setCartOpen(true)}
        cartItemsCount={cartItemsCount}
        onAuthClick={() => {
          setAuthMode('login');
          setAuthOpen(true);
        }}
        onTrackOrderClick={() => setTrackOpen(true)}
        onAdminClick={() => setShowAdminLogin(true)}
        onNavigate={(page) => setCurrentPage(page)}
      />

      {/* Page Content */}
      {renderPageContent()}

      <Footer onNavigate={(page) => setCurrentPage(page)} />

      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={(mode) => setAuthMode(mode)}
      />

      <TrackOrderModal
        isOpen={trackOpen}
        onClose={() => setTrackOpen(false)}
      />

      <ShoppingCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onRequireAuth={() => {
          setCartOpen(false);
          setAuthMode('login');
          setAuthOpen(true);
        }}
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <ProductDetail
        product={selectedProduct}
        isOpen={productDetailOpen}
        onClose={() => setProductDetailOpen(false)}
        onAddToCart={addToCart}
      />

      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

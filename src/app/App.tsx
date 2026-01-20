import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ShoppingCart } from './components/ShoppingCart';
import { Checkout } from './components/Checkout';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { getProducts } from './data/products';
import { Product, CartItem, Settings } from './types';
import { api } from '../lib/api';
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
import { WishlistDrawer } from './components/WishlistDrawer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppInner() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    storeName: 'NŪRA Collection',
    storeEmail: 'info@nuracollection.com',
    storePhone: '+252638596758',
    storeAddress: 'Djibouti',
    currency: 'DJF',
    taxRate: 0,
    freeShippingThreshold: 150,
    shippingCost: 15,
    enableNotifications: true,
    enableEmailNotifications: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.getSettings();
        if (response.success && response.data) {
          setSettings((prev) => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          // Fallback to local data if API fails but returns success: false
          setProducts(getProducts());
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(getProducts());
      }
    };

    fetchSettings();
    fetchProducts();
  }, []);

  const addToCart = (product: Product, size?: string) => {
    const cartId = size ? `${product.id}-${size}` : product.id;
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === cartId);
      if (existingItem) {
        return prev.map(item =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, id: cartId, productId: product.id, quantity: 1, size: size }];
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
  const wishlistCount = wishlistIds.length;

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        toast.success('Removed from wishlist');
        return prev.filter((id) => id !== product.id);
      }
      toast.success('Added to wishlist');
      return [...prev, product.id];
    });
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    toast.success('Your order has been placed successfully!');
  };

  const categories = ['All', ...Array.from(new Set(products.flatMap((p) => (p.categories || []).map(c => c.toUpperCase()))))];
  const filteredProducts = filterCategory && filterCategory !== 'All'
    ? products.filter((p) => (p.categories || []).some(cat => cat.toUpperCase() === filterCategory.toUpperCase()))
    : products;
  const newArrivals = products.filter((p) => p.isNew);
  const wishlistItems = products.filter((p) => wishlistIds.includes(p.id));

  // SEO configuration based on current path
  const getSEOConfig = () => {
    const path = location.pathname;
    switch (path) {
      case '/about':
        return {
          title: `About Us - ${settings.storeName}`,
          description: `Learn about ${settings.storeName}, our mission to provide elegant and luxurious modest fashion. Discover our story, values, and commitment to quality.`,
          keywords: 'about nura, modest fashion brand, hijab company, islamic fashion',
        };
      case '/contact':
        return {
          title: `Contact Us - ${settings.storeName}`,
          description: `Get in touch with ${settings.storeName}. We're here to help with any questions about our products, orders, or services.`,
          keywords: 'contact nura, customer service, support, help',
        };
      case '/new':
        return {
          title: `New Arrivals - ${settings.storeName}`,
          description: 'Check out the latest additions to our collection. Premium hijabs, abayas and accessories.',
          keywords: 'new arrivals, latest fashion, modest fashion new',
        };
      case '/hijabs':
        return {
          title: `Hijabs - ${settings.storeName}`,
          description: 'Shop our premium collection of hijabs. Chiffon, silk, jersey and more.',
          keywords: 'hijabs, buy hijabs, chiffon hijab, silk hijab, modest fashion',
        };
      case '/abayas':
        return {
          title: `Abayas - ${settings.storeName}`,
          description: 'Discover our elegant collection of abayas. Modern and traditional styles.',
          keywords: 'abayas, buy abaya, modest dress, islamic fashion',
        };
      case '/accessories':
        return {
          title: `Accessories - ${settings.storeName}`,
          description: 'Complete your look with our modest fashion accessories.',
          keywords: 'accessories, hijab pins, jewelry, modest accessories',
        };
      case '/sale':
        return {
          title: `Sale - ${settings.storeName}`,
          description: 'Shop reduced prices on premium hijabs and modest fashion.',
          keywords: 'sale, hijab sale, abaya sale, discounts',
        };
      default:
        return {
          title: settings.storeName,
          description: 'Luxury modest fashion for the modern woman. Premium quality hijabs, abayas and Islamic clothing.',
          keywords: 'modest fashion, hijabs, abayas, islamic clothing, luxury hijab',
        };
    }
  };

  const seoConfig = getSEOConfig();

  const HomeContent = () => (
    <>
      <Hero />
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section - kept on home page too? Or remove? Usually Home has preview. 
          I'll keep the sections as they were to maintain home page design. */}
      <section id="new" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif">
              New Arrivals
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other sections omitted for brevity in thought but needed in code. 
          To properly replicate the file, I need to include ALL sections.
          Since I am replacing the WHOLE file, I must be careful not to delete parts.
          I'll create a reusable ProductGridSection maybe?
          No, I'll just paste the existing sections.
      */}
      {/* Hijabs */}
      <section id="hijabs" className="py-12 sm:py-16 lg:py-20 bg-amber-50/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif">
              Hijabs
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.filter(p => p.categories?.some(cat => cat.toUpperCase().includes('HIJAB'))).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Abayas */}
      <section id="abayas" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif">
              Abayas
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.filter(p => p.categories?.some(cat => cat.toUpperCase().includes('ABAYA'))).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section id="accessories" className="py-12 sm:py-16 lg:py-20 bg-amber-50/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif">
              Accessories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.filter(p => p.categories?.some(cat => cat.toUpperCase().includes('ACCESSOR'))).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sale */}
      <section id="sale" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif">
              Sale
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.filter(p => p.sale || (p.originalPrice && p.originalPrice > p.price)).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
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
                Free express shipping on orders over {settings.currency === 'DJF' ? 'FD15,000' : `$${settings.freeShippingThreshold}`} with tracking
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

  const NewArrivalsPage = () => (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-8 font-serif text-center">New Arrivals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const CategoryPage = ({
    title,
    filterFn,
    emptyMessage = "No products found in this category."
  }: {
    title: string;
    filterFn: (p: Product) => boolean;
    emptyMessage?: string;
  }) => {
    const categoryProducts = products.filter(filterFn);

    return (
      <div className="py-24 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-8 font-serif text-center">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={handleProductClick}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                currency={settings.currency}
              />
            ))}
            {categoryProducts.length === 0 && (
              <p className="text-gray-500 col-span-full text-center text-lg">
                {emptyMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
      />
      <Toaster position="top-right" richColors />

      {location.pathname !== '/admin' && (
        <Header
          settings={settings}
          onCartClick={() => setCartOpen(true)}
          cartItemsCount={cartItemsCount}
          wishlistCount={wishlistCount}
          onWishlistClick={() => setWishlistOpen(true)}
          onAuthClick={() => {
            setAuthMode('login');
            setAuthOpen(true);
          }}
          onTrackOrderClick={() => setTrackOpen(true)}
          onFilterCategory={setFilterCategory}
        />
      )}

      {/* Pages */}
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/new" element={<NewArrivalsPage />} />
        <Route
          path="/admin"
          element={
            isAdmin() ? (
              <AdminDashboard />
            ) : (
              <AdminLogin
                onSuccess={() => navigate('/admin')}
                onBack={() => navigate('/')}
              />
            )
          }
        />
        <Route
          path="/hijabs"
          element={
            <CategoryPage
              title="Hijabs"
              filterFn={(p) => p.categories?.some(cat => cat.toUpperCase().includes('HIJAB')) || false}
            />
          }
        />
        <Route
          path="/abayas"
          element={
            <CategoryPage
              title="Abayas"
              filterFn={(p) => p.categories?.some(cat => cat.toUpperCase().includes('ABAYA')) || false}
            />
          }
        />
        <Route
          path="/accessories"
          element={
            <CategoryPage
              title="Accessories"
              filterFn={(p) => p.categories?.some(cat => cat.toUpperCase().includes('ACCESSOR')) || false}
              emptyMessage="Accessories coming soon."
            />
          }
        />
        <Route
          path="/sale"
          element={
            <CategoryPage
              title="Sale"
              filterFn={(p) => !!(p.sale || (p.originalPrice && p.originalPrice > p.price))}
              emptyMessage="No products on sale right now."
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<ShippingReturns />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>

      {location.pathname !== '/admin' && (
        <Footer
          settings={settings}
          onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
        />
      )}

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
        settings={settings}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onRequireAuth={() => setAuthOpen(true)}
        onCheckout={() => setCheckoutOpen(true)}
      />

      <Checkout
        settings={settings}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onAddToCart={(product) => addToCart(product)}
        onRemoveFromWishlist={(productId) =>
          setWishlistIds((prev) => prev.filter((id) => id !== productId))
        }
      />

      <ProductDetail
        product={selectedProduct}
        isOpen={productDetailOpen}
        onClose={() => setProductDetailOpen(false)}
        onAddToCart={addToCart}
      />

      <WhatsAppButton settings={settings} />
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

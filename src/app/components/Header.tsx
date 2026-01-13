import { ShoppingBag, Search, Heart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth';

interface HeaderProps {
  onCartClick: () => void;
  cartItemsCount: number;
  onAuthClick?: () => void;
  onTrackOrderClick?: () => void;
  onAdminClick?: () => void;
  onNavigate?: (page: 'home' | 'about' | 'contact' | 'faq' | 'shipping' | 'privacy' | 'terms' | 'size-guide' | 'profile') => void;
}

export function Header({ onCartClick, cartItemsCount, onAuthClick, onTrackOrderClick, onAdminClick, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-xs sm:text-sm border-b border-gray-50">
          <div className="text-gray-600 truncate">Free shipping on orders over $150</div>
          <div className="hidden sm:flex gap-3 lg:gap-4 text-gray-600">
            <button className="hover:text-gray-900 transition-colors px-2 py-1" type="button" onClick={() => { onNavigate?.('about'); setMobileMenuOpen(false); }}>About</button>
            <button className="hover:text-gray-900 transition-colors px-2 py-1" type="button" onClick={() => { onNavigate?.('contact'); setMobileMenuOpen(false); }}>Contact</button>
            <button
              type="button"
              onClick={() => { onTrackOrderClick?.(); setMobileMenuOpen(false); }}
              className="hover:text-gray-900 transition-colors px-2 py-1"
            >
              Track Order
            </button>
            {onAdminClick && (
              <button
                type="button"
                onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                className="hover:text-gray-900 transition-colors px-2 py-1"
              >
                Admin
              </button>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-3 sm:py-4 lg:py-6">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2 touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <button onClick={() => { onNavigate?.('home'); setMobileMenuOpen(false); }} className="block">
              <h1 className="text-xl sm:text-2xl md:text-3xl tracking-wide">
                <span className="font-serif">NŪRA</span>
                <span className="text-amber-700 ml-1">COLLECTION</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 tracking-widest mt-0.5">
                LUXURY MODEST FASHION
              </p>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 mx-4 xl:mx-8">
            <a href="#new" className="text-gray-800 hover:text-amber-700 transition-colors text-sm">New Arrivals</a>
            <a href="#hijabs" className="text-gray-800 hover:text-amber-700 transition-colors text-sm">Hijabs</a>
            <a href="#abayas" className="text-gray-800 hover:text-amber-700 transition-colors text-sm">Abayas</a>
            <a href="#accessories" className="text-gray-800 hover:text-amber-700 transition-colors text-sm">Accessories</a>
            <a href="#sale" className="text-gray-800 hover:text-amber-700 transition-colors text-sm">Sale</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <button
              onClick={user ? () => { onNavigate?.('profile'); setMobileMenuOpen(false); } : () => { onAuthClick?.(); setMobileMenuOpen(false); }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-gray-200 rounded-full text-xs hover:border-amber-700 hover:text-amber-700 transition-colors touch-manipulation"
            >
              <User size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden md:inline">
                {user ? `Hi, ${user.name?.split(' ')[0] || user.name}` : 'Sign in / Join'}
              </span>
              <span className="md:hidden">
                {user ? 'Account' : 'Sign in'}
              </span>
            </button>
            <button className="hidden sm:block p-2 hover:text-amber-700 transition-colors touch-manipulation" aria-label="Search">
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button className="hidden sm:block p-2 hover:text-amber-700 transition-colors touch-manipulation" aria-label="Wishlist">
              <Heart size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onCartClick}
              className="p-2 hover:text-amber-700 transition-colors relative touch-manipulation"
              aria-label={`Shopping cart with ${cartItemsCount} items`}
            >
              <ShoppingBag size={20} className="sm:w-5 sm:h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="lg:hidden fixed top-[73px] sm:top-[81px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50 max-h-[calc(100vh-73px)] sm:max-h-[calc(100vh-81px)] overflow-y-auto">
              <div className="px-4 py-4 space-y-1">
                <button
                  onClick={() => { onNavigate?.('home'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Home
                </button>
                <a 
                  href="#new" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  New Arrivals
                </a>
                <a 
                  href="#hijabs" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Hijabs
                </a>
                <a 
                  href="#abayas" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Abayas
                </a>
                <a 
                  href="#accessories" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Accessories
                </a>
                <a 
                  href="#sale" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Sale
                </a>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={() => { onNavigate?.('about'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  About
                </button>
                <button
                  onClick={() => { onNavigate?.('contact'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Contact
                </button>
                <button
                  onClick={() => { onTrackOrderClick?.(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                >
                  Track Order
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => { onNavigate?.('profile'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { onAuthClick?.(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                  >
                    Sign in / Join
                  </button>
                )}
                {onAdminClick && (
                  <button
                    onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors touch-manipulation"
                  >
                    Admin
                  </button>
                )}
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

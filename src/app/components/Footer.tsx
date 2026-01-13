import { Instagram, Facebook, Twitter, Mail, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'contact' | 'faq' | 'shipping' | 'privacy' | 'terms' | 'size-guide') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl mb-4 font-serif">
              NŪRA <span className="text-amber-500">COLLECTION</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Luxury modest fashion for the modern woman. Premium quality hijabs and Islamic clothing.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-amber-500 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-amber-500 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-amber-500 transition">
                <Twitter size={20} />
              </a>
              <a 
                href="https://wa.me/25377243018" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-500 transition"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 tracking-wider">SHOP</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition">New Arrivals</button></li>
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition">Hijabs</button></li>
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition">Abayas</button></li>
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition">Accessories</button></li>
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition">Sale</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 tracking-wider">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate?.('contact')} className="hover:text-white transition">Contact Us</button></li>
              <li><button onClick={() => onNavigate?.('faq')} className="hover:text-white transition">FAQ</button></li>
              <li><button onClick={() => onNavigate?.('shipping')} className="hover:text-white transition">Shipping & Returns</button></li>
              <li><button onClick={() => onNavigate?.('size-guide')} className="hover:text-white transition">Size Guide</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="hover:text-white transition">About Us</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 tracking-wider">NEWSLETTER</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for exclusive offers and updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
              <button className="bg-amber-700 px-4 py-2 hover:bg-amber-600 transition">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 Nūra Collection. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => onNavigate?.('terms')} className="hover:text-white transition">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

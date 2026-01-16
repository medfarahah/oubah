import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem, Settings } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../auth';
import { toast } from 'sonner';

interface ShoppingCartProps {
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onRequireAuth?: () => void;
  onCheckout?: () => void;
}

export function ShoppingCart({
  settings,
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onRequireAuth,
  onCheckout,
}: ShoppingCartProps) {
  const { user } = useAuth();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login or create an account before you checkout.');
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }
    if (onCheckout) {
      onCheckout();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Cart panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold">Shopping Cart ({items.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full touch-manipulation" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base sm:text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-amber-700 hover:text-amber-800 text-sm sm:text-base font-medium touch-manipulation"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-24 sm:w-24 sm:h-32 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-sm sm:text-base font-medium line-clamp-2">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">{item.category}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500 mb-1">Size: {item.size}</p>
                    )}
                    <p className="mb-2 text-sm sm:text-base font-semibold">${item.price}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 hover:bg-gray-50 touch-manipulation min-w-[36px] sm:min-w-[40px]"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-200 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 hover:bg-gray-50 touch-manipulation min-w-[36px] sm:min-w-[40px]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded touch-manipulation"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {items.length > 0 && (
          <div className="border-t p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white sticky bottom-0">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {subtotal < settings.freeShippingThreshold && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                Add ${(settings.freeShippingThreshold - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="flex justify-between text-base sm:text-lg font-semibold border-t pt-3 sm:pt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-gray-900 text-white py-3 sm:py-4 hover:bg-amber-700 transition-colors text-sm sm:text-base font-semibold touch-manipulation"
              onClick={handleCheckout}
            >
              {user ? 'PROCEED TO CHECKOUT' : 'LOGIN TO CHECKOUT'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

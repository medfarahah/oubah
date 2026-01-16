import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onRemoveFromWishlist,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Wishlist panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            Wishlist ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full touch-manipulation"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wishlist items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base sm:text-lg">Your wishlist is empty</p>
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
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100 last:border-0"
                >
                  <div className="w-20 h-24 sm:w-24 sm:h-32 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-sm sm:text-base font-medium line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">
                      {item.category}
                    </p>
                    <p className="mb-3 text-sm sm:text-base font-semibold">
                      ${item.price}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-3 text-xs sm:text-sm rounded hover:bg-amber-700 transition-colors touch-manipulation"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded touch-manipulation"
                        aria-label="Remove from wishlist"
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
      </div>
    </>
  );
}


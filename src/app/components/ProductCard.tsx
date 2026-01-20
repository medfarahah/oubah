import { Heart, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../types';
import { formatCurrency } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  currency?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  onProductClick,
  onToggleWishlist,
  isWishlisted,
  currency = 'DJF',
}: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-4">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onClick={() => onProductClick(product)}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-amber-700 text-white text-xs px-3 py-1 tracking-wider">NEW</span>
          )}
          {product.sale && (
            <span className="bg-red-600 text-white text-xs px-3 py-1 tracking-wider">SALE</span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
            className={`bg-white p-2 rounded-full shadow-sm hover:bg-amber-700 hover:text-white transition-colors ${isWishlisted ? 'text-amber-700' : ''
              }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              className={isWishlisted ? 'fill-amber-700 text-amber-700' : ''}
            />
          </button>
        </div>

        {/* Add to cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const defaultSize =
              product.sizes && product.sizes.length === 1 ? product.sizes[0] : undefined;
            onAddToCart(product, defaultSize);
          }}
          className="absolute bottom-4 left-4 right-4 bg-white text-gray-900 py-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-700 hover:text-white flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} />
          ADD TO CART
        </button>
      </div>

      <div onClick={() => onProductClick(product)}>
        <h3 className="text-sm mb-1 text-gray-600 tracking-wide">{product.category}</h3>
        <h4 className="mb-2">{product.name}</h4>
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatCurrency(product.price, currency)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice, currency)}</span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

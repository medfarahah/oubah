import { X, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SEO } from './SEO';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export function ProductDetail({ product, isOpen, onClose, onAddToCart }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;

  return (
    <>
      <SEO
        title={`${product.name} - NŪRA Collection`}
        description={product.description || `Shop ${product.name} from NŪRA Collection. ${product.material ? `Made from ${product.material}.` : ''} Premium quality, elegant design.`}
        keywords={`${product.name}, ${product.category}, hijab, modest fashion, ${product.material || ''}`}
        image={product.image}
        type="product"
        product={product}
      />
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white w-full h-full sm:max-w-5xl sm:w-full sm:max-h-[90vh] sm:rounded-lg overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid sm:grid-cols-2 gap-0 sm:gap-6 lg:gap-8 flex-1">
            {/* Image */}
            <div className="relative aspect-[3/4] sm:aspect-auto bg-gray-50 order-2 sm:order-1">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 tracking-wider">
                  NEW
                </span>
              )}
              {product.sale && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 tracking-wider">
                  SALE
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 order-1 sm:order-2 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-gray-100 rounded-full touch-manipulation z-10 bg-white/80 backdrop-blur-sm"
                aria-label="Close product details"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              <p className="text-xs sm:text-sm text-gray-500 tracking-widest mb-1 sm:mb-2">{product.category}</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4 font-semibold">{product.name}</h2>
              
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">{product.description}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm mb-3">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === idx ? 'border-amber-700' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {hasSizes && (
                <div className="mb-6">
                  <p className="text-sm mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                          selectedSize === size
                            ? 'border-amber-700 bg-amber-700 text-white'
                            : 'border-gray-300 text-gray-800 hover:border-amber-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {product.sizes && product.sizes.length > 1 && !selectedSize && (
                    <p className="mt-2 text-xs text-red-600">Please select a size.</p>
                  )}
                </div>
              )}

              {/* Material */}
              {product.material && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Material: <span className="text-gray-900">{product.material}</span></p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 sticky bottom-0 sm:static bg-white pt-4 sm:pt-0 -mx-4 sm:mx-0 px-4 sm:px-0 pb-4 sm:pb-0 border-t sm:border-0">
                <button
                  onClick={() => {
                    if (hasSizes && product.sizes && product.sizes.length > 1 && !selectedSize) {
                      return;
                    }
                    const sizeToUse =
                      selectedSize || (product.sizes && product.sizes.length === 1
                        ? product.sizes[0]
                        : undefined);
                    onAddToCart(product, sizeToUse);
                    onClose();
                  }}
                  className="flex-1 bg-gray-900 text-white py-3 sm:py-4 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-semibold touch-manipulation"
                >
                  <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">ADD TO CART</span>
                  <span className="xs:hidden">ADD</span>
                </button>
                <button className="p-3 sm:p-4 border border-gray-300 hover:border-amber-700 hover:text-amber-700 transition-colors touch-manipulation" aria-label="Add to wishlist">
                  <Heart size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                <p>✓ Premium quality materials</p>
                <p>✓ Breathable and comfortable</p>
                <p>✓ Easy care instructions</p>
                <p>✓ Free returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

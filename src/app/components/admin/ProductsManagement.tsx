import { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Plus, Edit, Trash2, X, Save, Search, Filter, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api } from '../../../lib/api';

export function ProductsManagement() {
  const [products, setProductsState] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts();
      if (response.success && response.data) {
        // Convert API product format to frontend Product format
        const convertedProducts: Product[] = response.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || '',
          price: p.price,
          image: p.imageUrl || p.image,
          description: p.description || '',
          material: p.material,
          colors: p.colors || [],
          sizes: p.sizes || ['One Size'],
          isNew: p.isNew || false,
          sale: p.sale || false,
          originalPrice: p.originalPrice,
        }));
        setProductsState(convertedProducts);
      } else {
        toast.error(response.error || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      id: Date.now().toString(),
      name: '',
      category: '',
      price: 0,
      image: '',
      description: '',
      sizes: ['One Size'],
      colors: [],
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      const response = await api.deleteProduct(id);
      if (response.success) {
        setProductsState(products.filter((p) => p.id !== id));
        toast.success('Product deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isAdding) {
        const response = await api.createProduct({
          name: formData.name!,
          price: formData.price!,
          imageUrl: formData.image!,
          category: formData.category!,
          description: formData.description,
          material: formData.material,
          colors: formData.colors || [],
          sizes: formData.sizes || ['One Size'],
          isNew: formData.isNew || false,
          sale: formData.sale || false,
          originalPrice: formData.originalPrice,
        });

        if (response.success && response.data) {
          await loadProducts(); // Reload products from API
          toast.success('Product added successfully');
        } else {
          toast.error(response.error || 'Failed to add product');
        }
      } else if (editingId) {
        const response = await api.updateProduct(editingId, {
          name: formData.name,
          price: formData.price,
          imageUrl: formData.image,
          category: formData.category,
          description: formData.description,
          material: formData.material,
          colors: formData.colors,
          sizes: formData.sizes,
          isNew: formData.isNew,
          sale: formData.sale,
          originalPrice: formData.originalPrice,
        });

        if (response.success && response.data) {
          await loadProducts(); // Reload products from API
          toast.success('Product updated successfully');
        } else {
          toast.error(response.error || 'Failed to update product');
        }
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {isAdding ? 'Add New Product' : 'Edit Product'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0.00"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.originalPrice || ''}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })
                }
                placeholder="0.00"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image *</label>
              <div className="space-y-3">
                {/* Image Preview */}
                {formData.image && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* File Upload */}
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-lg p-4 text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {formData.image ? 'Change Image' : 'Upload from Device'}
                        </span>
                        <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* URL Input Option */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <Input
                  value={formData.image?.startsWith('data:') ? '' : (formData.image || '')}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-gray-200 focus:border-amber-500"
                />
                <p className="text-xs text-gray-500">You can upload an image or paste an image URL</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={4}
                placeholder="Product description..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Material</label>
              <Input
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g., 100% Silk"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sizes (comma-separated)</label>
              <Input
                value={formData.sizes?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="One Size, S, M, L, XL"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Palette className="inline w-4 h-4 mr-2" />
                Colors
              </label>
              <div className="space-y-4">
                {/* Color Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="color-picker"
                      value={formData.colors?.[formData.colors.length - 1] || '#000000'}
                      onChange={(e) => {
                        const newColor = e.target.value.toUpperCase();
                        const currentColors = formData.colors || [];
                        if (!currentColors.includes(newColor)) {
                          setFormData({
                            ...formData,
                            colors: [...currentColors, newColor],
                          });
                          toast.success('Color added');
                        } else {
                          toast.error('Color already added');
                        }
                      }}
                      className="w-16 h-10 border-gray-200 cursor-pointer"
                      title="Pick a color and it will be added automatically"
                    />
                    <Input
                      type="text"
                      id="color-input"
                      placeholder="#000000 or color name (e.g., Black, Navy)"
                      className="flex-1 border-gray-200 focus:border-amber-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          const value = input.value.trim();
                          if (value) {
                            // Check if it's a hex color
                            const hexMatch = value.match(/^#?([0-9A-Fa-f]{6})$/);
                            const colorValue = hexMatch ? `#${hexMatch[1].toUpperCase()}` : value;
                            const currentColors = formData.colors || [];
                            if (!currentColors.includes(colorValue)) {
                              setFormData({
                                ...formData,
                                colors: [...currentColors, colorValue],
                              });
                              input.value = '';
                              toast.success('Color added');
                            } else {
                              toast.error('Color already added');
                            }
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('color-input') as HTMLInputElement;
                        const value = input?.value.trim();
                        if (value) {
                          const hexMatch = value.match(/^#?([0-9A-Fa-f]{6})$/);
                          const colorValue = hexMatch ? `#${hexMatch[1].toUpperCase()}` : value;
                          const currentColors = formData.colors || [];
                          if (!currentColors.includes(colorValue)) {
                            setFormData({
                              ...formData,
                              colors: [...currentColors, colorValue],
                            });
                            if (input) input.value = '';
                            toast.success('Color added');
                          } else {
                            toast.error('Color already added');
                          }
                        } else {
                          toast.error('Please enter a color');
                        }
                      }}
                      className="px-4 bg-amber-600 hover:bg-amber-700 text-white"
                      title="Add color"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Pick a color from the color picker or enter a hex code/color name and press Enter or click the + button
                  </p>
                </div>

                {/* Color Swatches */}
                {formData.colors && formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {formData.colors.map((color, index) => {
                      // Check if color is a hex code
                      const isHex = /^#([0-9A-Fa-f]{6})$/.test(color);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200 shadow-sm"
                        >
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300 flex-shrink-0"
                            style={{
                              backgroundColor: isHex ? color : 'transparent',
                              backgroundImage: isHex
                                ? 'none'
                                : `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                              backgroundSize: isHex ? 'auto' : '8px 8px',
                              backgroundPosition: isHex ? '0 0' : '0 0, 0 4px, 4px -4px, -4px 0px',
                            }}
                            title={color}
                          />
                          <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                            {color}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = formData.colors?.filter((_, i) => i !== index) || [];
                              setFormData({ ...formData, colors: newColors });
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Remove color"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Predefined Color Palette */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Quick add common colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Black', hex: '#000000' },
                      { name: 'White', hex: '#FFFFFF' },
                      { name: 'Navy', hex: '#1a1a1a' },
                      { name: 'Beige', hex: '#f5e6d3' },
                      { name: 'Brown', hex: '#8b7355' },
                      { name: 'Green', hex: '#2c5f2d' },
                      { name: 'Gold', hex: '#d4af37' },
                      { name: 'Burgundy', hex: '#8b4513' },
                      { name: 'Gray', hex: '#696969' },
                      { name: 'Rose', hex: '#c9b1a6' },
                    ].map((preset) => {
                      const currentColors = formData.colors || [];
                      const isAdded = currentColors.includes(preset.hex);
                      return (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => {
                            if (!isAdded) {
                              setFormData({
                                ...formData,
                                colors: [...currentColors, preset.hex],
                              });
                            } else {
                              toast.info('Color already added');
                            }
                          }}
                          disabled={isAdded}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                            isAdded
                              ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-amber-500 hover:bg-amber-50'
                          }`}
                          title={isAdded ? 'Already added' : `Add ${preset.name}`}
                        >
                          <div
                            className="w-5 h-5 rounded border border-gray-300"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <span className="text-xs font-medium text-gray-700">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew || false}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as New Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sale || false}
                  onChange={(e) => setFormData({ ...formData, sale: e.target.checked })}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">On Sale</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg"
              >
                <Save size={18} className="mr-2" />
                {isAdding ? 'Create Product' : 'Save Changes'}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X size={18} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-600 font-medium">Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No products found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{product.name}</div>
                          <div className="flex gap-2 flex-wrap">
                            {product.isNew && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                                NEW
                              </span>
                            )}
                            {product.sale && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white">
                                SALE
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-medium">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getProducts, setProducts } from '../../data/products';
import { Product } from '../../types';
import { Package, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface InventoryItem extends Product {
  stock: number;
  lowStockThreshold: number;
}

export function InventoryManagement() {
  const [products, setProductsState] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Map<string, { stock: number; threshold: number }>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const allProducts = getProducts();
    setProductsState(allProducts);

    // Initialize inventory from localStorage or default
    const stored = localStorage.getItem('nura_inventory');
    if (stored) {
      try {
        const invData = JSON.parse(stored);
        setInventory(new Map(Object.entries(invData)));
      } catch {
        // Use defaults
      }
    }

    // Initialize missing products with default stock
    const newInventory = new Map(inventory);
    allProducts.forEach((product) => {
      if (!newInventory.has(product.id)) {
        newInventory.set(product.id, { stock: 50, threshold: 10 });
      }
    });
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const saveInventory = (inv: Map<string, { stock: number; threshold: number }>) => {
    const obj = Object.fromEntries(inv);
    localStorage.setItem('nura_inventory', JSON.stringify(obj));
  };

  const updateStock = (productId: string, newStock: number) => {
    const newInventory = new Map(inventory);
    const current = newInventory.get(productId) || { stock: 0, threshold: 10 };
    newInventory.set(productId, { ...current, stock: Math.max(0, newStock) });
    setInventory(newInventory);
    saveInventory(newInventory);
    toast.success('Stock updated');
  };

  const updateThreshold = (productId: string, newThreshold: number) => {
    const newInventory = new Map(inventory);
    const current = newInventory.get(productId) || { stock: 0, threshold: 10 };
    newInventory.set(productId, { ...current, threshold: Math.max(0, newThreshold) });
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockProducts = filteredProducts.filter((p) => {
    const inv = inventory.get(p.id);
    return inv && inv.stock <= inv.threshold;
  });

  const totalStock = Array.from(inventory.values()).reduce((sum, inv) => sum + inv.stock, 0);
  const lowStockCount = lowStockProducts.length;
  const outOfStockCount = Array.from(inventory.values()).filter((inv) => inv.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Inventory</h2>
          <p className="text-gray-600 mt-1">Manage product stock levels</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {products.length - outOfStockCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-gray-200 focus:border-amber-500"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">
                {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} running low on stock
              </p>
              <p className="text-sm text-amber-700">Consider restocking these items soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
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
                  Current Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Low Stock Threshold
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const inv = inventory.get(product.id) || { stock: 50, threshold: 10 };
                  const isLowStock = inv.stock <= inv.threshold;
                  const isOutOfStock = inv.stock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">${product.price}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={inv.stock}
                            onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                            className="w-24 border-gray-200 focus:border-amber-500"
                            min="0"
                          />
                          <button
                            onClick={() => updateStock(product.id, inv.stock + 10)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Add 10"
                          >
                            <TrendingUp size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          value={inv.threshold}
                          onChange={(e) => updateThreshold(product.id, parseInt(e.target.value) || 0)}
                          className="w-24 border-gray-200 focus:border-amber-500"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

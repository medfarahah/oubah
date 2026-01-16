import { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, X, Save, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '../../../lib/api';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts();
      if (response.success && response.data) {
        const products = response.data;
        const categoryMap = new Map<string, Category>();

        products.forEach((product: any) => {
          const productCategories = product.categories && product.categories.length > 0
            ? product.categories
            : ['Uncategorized'];

          productCategories.forEach((catName: string) => {
            const normalizedCatName = catName.toUpperCase();

            if (!categoryMap.has(normalizedCatName)) {
              categoryMap.set(normalizedCatName, {
                id: normalizedCatName.toLowerCase().replace(/\s+/g, '-'),
                name: catName,
                description: '',
                productCount: 0,
              });
            }
            const cat = categoryMap.get(normalizedCatName)!;
            cat.productCount += 1;
          });
        });

        setCategories(Array.from(categoryMap.values()));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', description: '' });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingId(category.id);
    setIsAdding(false);
  };

  const handleDelete = async (categoryName: string) => {
    try {
      const response = await api.getProducts();
      if (response.success && response.data) {
        const products = response.data;
        const productsInCategory = products.filter((p: any) => p.categories && p.categories.includes(categoryName));

        if (productsInCategory.length > 0) {
          toast.error(`Cannot delete category. ${productsInCategory.length} product(s) are using it.`);
          return;
        }

        if (confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
          loadCategories();
          toast.success('Category deleted');
        }
      }
    } catch (error) {
      toast.error('Failed to check category status');
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    // In this implementation, categories are derived from product fields.
    // To "add" or "edit" a category generally, you'd update individual products.
    if (editingId) {
      toast.info('To rename this category, please update the products using it in the Products tab.');
    } else {
      toast.success('Category will be created when you add a product with this name.');
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    loadCategories();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">Organize your products by categories</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {isAdding ? 'Add New Category' : 'Edit Category'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., SILK HIJABS"
                className="border-gray-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={3}
                placeholder="Category description..."
              />
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg"
              >
                <Save size={18} className="mr-2" />
                {isAdding ? 'Create Category' : 'Save Changes'}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X size={18} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-200/50 p-16 text-center">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Create your first category to organize products</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:border-gray-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Category</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.name)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={16} className="text-gray-400" />
                <span className="font-semibold">{category.productCount}</span>
                <span>product{category.productCount !== 1 ? 's' : ''}</span>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                  {category.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

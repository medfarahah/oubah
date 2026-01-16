import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { api } from '../../../lib/api';
import { Order, Product } from '../../types';

export function ReportsManagement() {
  const [reportType, setReportType] = useState<'sales' | 'products'>('sales');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        api.getOrders(),
        api.getProducts()
      ]);

      if (ordersRes.success && ordersRes.data) {
        const convertedOrders: Order[] = ordersRes.data.map((o: any) => ({
          id: o.id,
          items: o.items?.map((item: any) => ({
            id: item.productId || item.id,
            name: item.product?.name || 'Unknown Product',
            price: item.price,
            quantity: item.quantity,
          })) || [],
          subtotal: o.subtotal || 0,
          shipping: o.shipping || 0,
          total: o.total || 0,
          orderDate: o.createdAt ? new Date(o.createdAt) : new Date(),
          status: o.status || 'pending',
          shippingInfo: {
            email: o.email || '',
          }
        })) as Order[];
        setOrders(convertedOrders);
      }

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data as Product[]);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSalesReport = () => {
    const filteredOrders = filterOrdersByDate(orders);
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      period: dateRange,
      totalRevenue,
      totalOrders,
      averageOrder,
      orders: filteredOrders,
    };
  };

  const generateProductsReport = () => {
    const productSales = new Map<string, { name: string; sold: number; revenue: number }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const current = productSales.get(item.id) || { name: item.name, sold: 0, revenue: 0 };
        productSales.set(item.id, {
          name: item.name,
          sold: current.sold + item.quantity,
          revenue: current.revenue + item.price * item.quantity,
        });
      });
    });

    return Array.from(productSales.values()).sort((a, b) => b.revenue - a.revenue);
  };



  const filterOrdersByDate = (ordersList: typeof orders) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case 'today':
        return ordersList.filter((o) => new Date(o.orderDate) >= today);
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return ordersList.filter((o) => new Date(o.orderDate) >= weekAgo);
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return ordersList.filter((o) => new Date(o.orderDate) >= monthAgo);
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return ordersList.filter((o) => new Date(o.orderDate) >= yearAgo);
      default:
        return ordersList;
    }
  };

  const handleExport = () => {
    let data = '';
    let filename = '';

    if (reportType === 'sales') {
      const report = generateSalesReport();
      data = `Sales Report - ${dateRange}\n\n`;
      data += `Total Revenue: $${report.totalRevenue.toFixed(2)}\n`;
      data += `Total Orders: ${report.totalOrders}\n`;
      data += `Average Order Value: $${report.averageOrder.toFixed(2)}\n\n`;
      data += 'Orders:\n';
      report.orders.forEach((order) => {
        data += `${order.id} - $${order.total.toFixed(2)} - ${new Date(order.orderDate).toLocaleDateString()}\n`;
      });
      filename = `sales-report-${dateRange}-${Date.now()}.txt`;
    } else {
      const report = generateProductsReport();
      data = 'Products Sales Report\n\n';
      report.forEach((product) => {
        data += `${product.name}: ${product.sold} sold - $${product.revenue.toFixed(2)} revenue\n`;
      });
      filename = `products-report-${Date.now()}.txt`;
    }

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600 mt-1">Generate and export detailed reports</p>
        </div>
        <Button
          onClick={handleExport}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/30"
        >
          <Download size={20} className="mr-2" />
          Export Report
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200/50">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Preparing reports...</p>
        </div>
      ) : (
        <>
          {/* Report Type Selector */}
          <div className="bg-white rounded-xl border border-gray-200/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Report Type</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'sales', label: 'Sales Report', icon: TrendingUp },
                { id: 'products', label: 'Products Report', icon: FileText },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${reportType === type.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${reportType === type.id ? 'text-amber-600' : 'text-gray-400'}`} />
                    <p className={`font-semibold ${reportType === type.id ? 'text-amber-900' : 'text-gray-700'}`}>
                      {type.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="bg-white rounded-xl border border-gray-200/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Date Range</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'Last 7 Days' },
                { id: 'month', label: 'Last Month' },
                { id: 'year', label: 'Last Year' },
                { id: 'all', label: 'All Time' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${dateRange === range.id
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-white rounded-xl border border-gray-200/50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Preview</h3>
            <div className="space-y-4">
              {reportType === 'sales' && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${generateSalesReport().totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{generateSalesReport().totalOrders}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${generateSalesReport().averageOrder.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'products' && (
                <div className="space-y-2">
                  {generateProductsReport().slice(0, 10).map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{product.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">${product.revenue.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 ml-2">({product.sold} sold)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </div>
          </div>
        </>
      )}
    </div>
  );
}

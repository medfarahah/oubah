import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { Order, Product } from '../../types';

export function SalesAnalytics() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      if (response.success && response.data) {
        // Convert API order format to frontend Order format
        const convertedOrders: Order[] = response.data.map((o: any) => ({
          id: o.id,
          items: o.items?.map((item: any) => ({
            id: item.productId || item.id,
            name: item.product?.name || 'Unknown Product',
            price: item.price,
            quantity: item.quantity,
            size: item.size,
          })) || [],
          subtotal: o.subtotal || 0,
          shipping: o.shipping || 0,
          total: o.total || 0,
          orderDate: o.createdAt ? new Date(o.createdAt) : new Date(),
          status: o.status || 'pending',
          shippingInfo: {
            email: o.email || '',
          },
        })) as Order[];

        setOrders(convertedOrders);
        calculateAnalytics(convertedOrders);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (ordersList: Order[]) => {
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = ordersList.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueChange: 0, // In a real app, calculate comparison with previous period
      ordersChange: 0,
    });
  };

  // Get top selling products
  const getTopProducts = () => {
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const current = productSales.get(item.id) || { name: item.name, sales: 0, revenue: 0 };
        productSales.set(item.id, {
          name: item.name,
          sales: current.sales + item.quantity,
          revenue: current.revenue + item.price * item.quantity,
        });
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  // Get revenue by month (last 6 months)
  const getMonthlyRevenue = () => {
    const monthly = new Map<string, number>();

    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly.set(monthKey, (monthly.get(monthKey) || 0) + order.total);
    });

    return Array.from(monthly.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);
  };

  const monthlyRevenue = getMonthlyRevenue();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Sales & Analytics</h2>
        <p className="text-gray-600 mt-1">Comprehensive sales insights and performance metrics</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200/50">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">${analytics.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sales data available</p>
                ) : (
                  topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{product.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm sm:text-base">${product.revenue.toFixed(2)}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider">Revenue</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue</h3>
              <div className="space-y-6">
                {monthlyRevenue.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No revenue data available</p>
                ) : (
                  monthlyRevenue.map(([month, revenue]) => {
                    const maxRevenue = Math.max(...monthlyRevenue.map(([, r]) => r));
                    const percentage = (revenue / (maxRevenue || 1)) * 100;
                    const date = new Date(month + '-01');
                    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                    return (
                      <div key={month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700">{monthName}</span>
                          <span className="font-bold text-gray-900">${revenue.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200/50">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(217,119,6,0.2)]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

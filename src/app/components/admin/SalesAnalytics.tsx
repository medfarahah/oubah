import { useState, useEffect } from 'react';
import { getOrders } from '../../data/orders';
import { getProducts } from '../../data/products';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function SalesAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    revenueChange: 12.5,
    ordersChange: 8.2,
    customersChange: 5.1,
  });

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const orders = getOrders();
    const products = getProducts();
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const uniqueCustomers = new Set(orders.map((o) => o.shippingInfo.email)).size;

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers: uniqueCustomers,
      revenueChange: 12.5,
      ordersChange: 8.2,
      customersChange: 5.1,
    });
  };

  // Get top selling products
  const getTopProducts = () => {
    const orders = getOrders();
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
    const orders = getOrders();
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
              <ArrowUpRight size={12} />
              {analytics.revenueChange}%
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
              <ArrowUpRight size={12} />
              {analytics.ordersChange}%
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
              <ArrowUpRight size={12} />
              +5.3%
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900">${analytics.averageOrderValue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
              <ArrowUpRight size={12} />
              {analytics.customersChange}%
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data available</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${product.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue</h3>
          <div className="space-y-4">
            {monthlyRevenue.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No revenue data available</p>
            ) : (
              monthlyRevenue.map(([month, revenue]) => {
                const maxRevenue = Math.max(...monthlyRevenue.map(([, r]) => r));
                const percentage = (revenue / maxRevenue) * 100;
                const date = new Date(month + '-01');
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-700">{monthName}</span>
                      <span className="font-bold text-gray-900">${revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
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
    </div>
  );
}

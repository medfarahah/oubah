import { useEffect, useState } from 'react';
import { ShoppingBag, Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';
import { api } from '../../../lib/api';

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueChange: 12.5,
    ordersChange: 8.2,
    customersChange: 5.4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getCustomers(),
      ]);

      if (ordersResponse.success && ordersResponse.data &&
        productsResponse.success && productsResponse.data &&
        customersResponse.success && customersResponse.data) {
        const orders = ordersResponse.data;
        const products = productsResponse.data;
        const customers = customersResponse.data;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalOrders,
          totalRevenue,
          totalProducts: products.length,
          totalCustomers: customers.length,
          averageOrderValue,
          revenueChange: 12.5,
          ordersChange: 8.2,
          customersChange: 5.4,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  type StatCard = {
    title: string;
    value: string;
    change: string;
    changeType: 'up' | 'down' | 'neutral';
    icon: any;
    gradient: string;
    bgColor: string;
    iconBg: string;
    iconColor: string;
    textColor: string;
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      change: `+${stats.revenueChange}%`,
      changeType: 'up',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: `+${stats.ordersChange}%`,
      changeType: 'up',
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      change: 'Active',
      changeType: 'neutral',
      icon: Package,
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      change: `+${stats.customersChange}%`,
      changeType: 'up',
      icon: Users,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      textColor: 'text-amber-600',
    },
    {
      title: 'Avg Order Value',
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      change: '+5.3%',
      changeType: 'up',
      icon: TrendingUp,
      gradient: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      textColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-[24px] border border-slate-100 p-7 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  {stat.changeType === 'up' ? (
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase">
                      <ArrowUpRight size={12} strokeWidth={3} />
                      {stat.change}
                    </div>
                  ) : stat.changeType === 'down' ? (
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase">
                      <ArrowDownRight size={12} strokeWidth={3} />
                      {stat.change}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg font-black tracking-wider uppercase">
                      {stat.change}
                    </div>
                  )}
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.title}</h3>
                <p className={`text-3xl font-black ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-amber-50/50 rounded-[24px] border border-amber-100/50 p-7 hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h4 className="font-black text-slate-900 text-xl">Products</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Add, edit, and manage your product catalog with ease
          </p>
        </div>

        <div className="bg-blue-50/50 rounded-[24px] border border-blue-100/50 p-7 hover:shadow-lg hover:shadow-blue-200/20 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h4 className="font-black text-slate-900 text-xl">Orders</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            View and manage store orders, update statuses
          </p>
        </div>

        <div className="bg-purple-50/50 rounded-[24px] border border-purple-100/50 p-7 hover:shadow-lg hover:shadow-purple-200/20 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h4 className="font-black text-slate-900 text-xl">Analytics</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Track business performance and view detailed analytics
          </p>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full -ml-24 -mb-24" />

        <div className="relative flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <span className="text-white font-black text-2xl">N</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-2">Welcome to NŪRA Admin</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              Manage your NŪRA Collection store efficiently with powerful tools and insights. Monitor sales, manage inventory, and track orders all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">System Online</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-sm font-semibold">{stats.totalProducts} Products Active</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-sm font-semibold">{stats.totalCustomers} Customers</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-sm font-semibold">{stats.totalOrders} Total Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

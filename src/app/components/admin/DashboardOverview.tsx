import { useEffect, useState } from 'react';
import { getOrders } from '../../data/orders';
import { getProducts } from '../../data/products';
import { ShoppingBag, Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    revenueChange: 12.5,
    ordersChange: 8.2,
  });

  useEffect(() => {
    const orders = getOrders();
    const products = getProducts();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStats({
      totalOrders,
      totalRevenue,
      totalProducts: products.length,
      averageOrderValue,
      revenueChange: 12.5,
      ordersChange: 8.2,
    });
  }, []);

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
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: `+${stats.ordersChange}%`,
      changeType: 'up',
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      change: 'Active',
      changeType: 'neutral',
      icon: Package,
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Avg Order Value',
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      change: '+5.3%',
      changeType: 'up',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
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
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className={`${stat.iconBg} p-3.5 rounded-xl shadow-sm`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  {stat.changeType === 'up' ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg text-xs font-bold">
                      <ArrowUpRight size={12} strokeWidth={3} />
                      {stat.change}
                    </div>
                  ) : stat.changeType === 'down' ? (
                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg text-xs font-bold">
                      <ArrowDownRight size={12} strokeWidth={3} />
                      {stat.change}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg font-bold">
                      {stat.change}
                    </div>
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.title}</h3>
                <p className={`text-3xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200 p-6 hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-black text-slate-900 text-lg">Products</h4>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Add, edit, and manage your product catalog with ease
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 p-6 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-black text-slate-900 text-lg">Orders</h4>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            View and manage customer orders, update statuses
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 p-6 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-black text-slate-900 text-lg">Analytics</h4>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Track customer activity and view detailed analytics
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
              Manage your NŪRA Collection store efficiently with powerful tools and insights. Monitor sales, manage inventory, and track customer activity all in one place.
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
                <span className="text-sm font-semibold">{stats.totalOrders} Total Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

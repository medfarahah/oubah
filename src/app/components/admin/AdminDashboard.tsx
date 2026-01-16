import { useState } from 'react';
import { useAuth } from '../../auth';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, Settings, Bell, Search, Tag, BarChart3, FileText, Warehouse, Users } from 'lucide-react';
import { ProductsManagement } from './ProductsManagement';
import { OrdersManagement } from './OrdersManagement';
import { DashboardOverview } from './DashboardOverview';
import { CategoriesManagement } from './CategoriesManagement';
import { InventoryManagement } from './InventoryManagement';
import { SalesAnalytics } from './SalesAnalytics';
import { ReportsManagement } from './ReportsManagement';
import { SettingsManagement } from './SettingsManagement';
import { CustomersManagement } from './CustomersManagement';
import { OrderDetailsPage } from './OrderDetailsPage';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'inventory' | 'orders' | 'customers' | 'analytics' | 'reports' | 'settings' | 'orderDetails';

export function AdminDashboard() {
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard' as AdminPage, label: 'Overview', icon: LayoutDashboard },
        { id: 'products' as AdminPage, label: 'Products', icon: Package },
        { id: 'categories' as AdminPage, label: 'Categories', icon: Tag },
        { id: 'orders' as AdminPage, label: 'Orders', icon: ShoppingBag },
        { id: 'customers' as AdminPage, label: 'Customers', icon: Users },
        { id: 'inventory' as AdminPage, label: 'Inventory', icon: Warehouse },
      ]
    },
    {
      label: 'Analytics',
      items: [
        { id: 'analytics' as AdminPage, label: 'Sales & Analytics', icon: BarChart3 },
        { id: 'reports' as AdminPage, label: 'Reports', icon: FileText },
      ]
    },
    {
      label: 'System',
      items: [
        { id: 'settings' as AdminPage, label: 'Settings', icon: Settings },
      ]
    }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'products':
        return <ProductsManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return (
          <OrdersManagement
            onViewDetails={(id) => {
              setSelectedOrderId(id);
              setCurrentPage('orderDetails');
            }}
          />
        );
      case 'orderDetails':
        return selectedOrderId ? (
          <OrderDetailsPage
            orderId={selectedOrderId}
            onBack={() => setCurrentPage('orders')}
          />
        ) : (
          <OrdersManagement
            onViewDetails={(id) => {
              setSelectedOrderId(id);
              setCurrentPage('orderDetails');
            }}
          />
        );
      case 'customers':
        return <CustomersManagement />;
      case 'analytics':
        return <SalesAnalytics />;
      case 'reports':
        return <ReportsManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-[280px]' : 'w-0'
          } bg-[#0F172A] text-slate-300 transition-all duration-300 ease-in-out overflow-hidden fixed lg:static h-screen z-40 border-r border-slate-800 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                NŪRA <span className="text-amber-500 text-[10px] uppercase tracking-widest ml-1 font-black">Admin</span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto scrollbar-hide">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id || (item.id === 'orders' && currentPage === 'orderDetails');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                        ? 'bg-amber-500/10 text-amber-500 font-semibold'
                        : 'hover:bg-slate-800/50 hover:text-white'
                        }`}
                    >
                      <Icon size={18} className={`${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-300'} transition-colors`} />
                      <span className="text-[14px]">{item.label}</span>
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/30">
          <div className="flex items-center gap-3 px-3 py-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white ring-2 ring-slate-800">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              // Redirect to home after logout
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-[72px] bg-white/70 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`${sidebarOpen ? 'hidden' : 'flex'} lg:flex text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-all`}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 px-5 py-2.5 rounded-full border border-slate-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500/30 transition-all w-96">
              <Search className="text-slate-400 mr-3" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 border-2 border-white rounded-full"></span>
              <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block w-48 text-[10px] text-slate-500">
                You have 3 new notifications
              </div>
            </button>
            <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <Settings size={20} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 ml-1 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Admin Panel</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1 tracking-wider">Online</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 p-[2px] shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-black text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {menuGroups.flatMap(g => g.items).find(m => m.id === currentPage)?.label || 'Overview'}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-[13px] text-slate-400 font-bold">
                <span className="tracking-wide">NŪRA</span>
                <span className="text-slate-300">•</span>
                <span className="tracking-wide">Admin</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-900 tracking-wide">
                  {menuGroups.flatMap(g => g.items).find(m => m.id === currentPage)?.label || 'Overview'}
                </span>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

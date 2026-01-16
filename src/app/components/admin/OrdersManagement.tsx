import { useState, useEffect } from 'react';
import { Order } from '../../types';
import { Eye, Package, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../lib/api';

interface OrdersManagementProps {
  onViewDetails: (id: string) => void;
}

export function OrdersManagement({ onViewDetails }: OrdersManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
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
            category: item.product?.category || 'General',
            price: item.price,
            originalPrice: item.product?.originalPrice,
            image: item.product?.imageUrl || '/placeholder.jpg',
            description: item.product?.description || '',
            quantity: item.quantity,
            size: item.size,
          })) || [],
          subtotal: o.subtotal || 0,
          shipping: o.shipping || 0,
          total: o.total || 0,
          orderDate: o.createdAt ? new Date(o.createdAt) : new Date(),
          status: o.status || 'pending',
          shippingInfo: {
            firstName: o.customerName ? o.customerName.split(' ')[0] : 'Unknown',
            lastName: o.customerName ? o.customerName.split(' ').slice(1).join(' ') : 'Customer',
            email: o.email || '',
            phone: o.phone || '',
            whatsapp: o.whatsapp || '',
            quartier: o.quartier || '',
            placeToReceive: o.placeToReceive || '',
          },
          paymentInfo: {
            paymentMethod: o.paymentMethod || 'cash'
          }
        }));
        setOrders(convertedOrders);
      } else {
        toast.error((response as any).error || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: Clock,
          label: 'Pending',
        };
      case 'processing':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: Clock,
          label: 'Processing',
        };
      case 'shipped':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: Truck,
          label: 'Shipped',
        };
      case 'out-for-delivery':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: Truck,
          label: 'Out for Delivery',
        };
      case 'delivered':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: CheckCircle,
          label: 'Delivered',
        };
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: X,
          label: 'Cancelled',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: Package,
          label: 'Unknown',
        };
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => (o as any).status === filterStatus);

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter((o) => (o as any).status === 'pending').length },
    { value: 'processing', label: 'Processing', count: orders.filter((o) => (o as any).status === 'processing').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter((o) => (o as any).status === 'shipped').length },
    { value: 'out-for-delivery', label: 'Out for Delivery', count: orders.filter((o) => (o as any).status === 'out-for-delivery').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter((o) => (o as any).status === 'delivered').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter((o) => (o as any).status === 'cancelled').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${filterStatus === option.value
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterStatus === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {filterStatus === 'all'
              ? 'No orders have been placed yet.'
              : `No orders with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const status = (order as any).status || 'pending';
            const statusConfig = getStatusConfig(status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-[24px] border border-slate-100 p-7 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer"
                onClick={() => onViewDetails(order.id)}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 tracking-tight text-lg">Order #{order.id.includes('-') ? order.id.split('-')[1] : order.id.slice(-6).toUpperCase()}</h3>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase border-2 ${statusConfig.bg.replace('bg-', 'bg-opacity-10 bg-')} ${statusConfig.text} ${statusConfig.border.replace('border-', 'border-opacity-30 border-')}`}>
                    <StatusIcon size={12} strokeWidth={3} />
                    {statusConfig.label}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                    <span className="text-sm font-bold text-slate-900">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</span>
                    <span className="text-sm font-bold text-slate-900">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                    <span className="text-sm font-bold text-slate-900">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</span>
                    <span className="text-xl font-black text-amber-600 underline decoration-amber-500/30 decoration-4 underline-offset-4">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Eye size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

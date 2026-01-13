import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../data/orders';
import { Order } from '../../types';
import { Eye, Package, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
    toast.success('Order status updated successfully');
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus } as any);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
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
    { value: 'processing', label: 'Processing', count: orders.filter((o) => (o as any).status === 'processing').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter((o) => (o as any).status === 'shipped').length },
    { value: 'out-for-delivery', label: 'Out for Delivery', count: orders.filter((o) => (o as any).status === 'out-for-delivery').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter((o) => (o as any).status === 'delivered').length },
  ];

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
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                filterStatus === option.value
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filterStatus === option.value
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredOrders.map((order) => {
              const status = (order as any).status || 'processing';
              const statusConfig = getStatusConfig(status);
              const StatusIcon = statusConfig.icon;
              const isSelected = selectedOrder?.id === order.id;
              
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl shadow-sm border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">Order #{order.id.split('-')[1]}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Items</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{order.shippingInfo.email}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details Panel */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-900">{selectedOrder.id}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.slice(1).map((option) => {
                        const isCurrent = ((selectedOrder as any).status || 'processing') === option.value;
                        const config = getStatusConfig(option.value);
                        const Icon = config.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleStatusUpdate(selectedOrder.id, option.value)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                              isCurrent
                                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <Icon size={14} />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</p>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            {item.size && (
                              <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-gray-900 ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        {selectedOrder.shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${selectedOrder.shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</p>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-1 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}
                      </p>
                      <p>{selectedOrder.shippingInfo.address}</p>
                      {selectedOrder.shippingInfo.apartment && (
                        <p>{selectedOrder.shippingInfo.apartment}</p>
                      )}
                      <p>
                        {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}{' '}
                        {selectedOrder.shippingInfo.zipCode}
                      </p>
                      <p>{selectedOrder.shippingInfo.country}</p>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Phone: {selectedOrder.shippingInfo.phone}</p>
                        <p className="text-xs text-gray-500">Email: {selectedOrder.shippingInfo.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

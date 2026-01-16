import { useState, useEffect } from 'react';
import { Order } from '../../types';
import { Package, Truck, CheckCircle, Clock, X, ChevronLeft, Calendar, Phone, Mail, MapPin, CreditCard, ShoppingBag, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { api } from '../../../lib/api';

interface OrderDetailsPageProps {
    orderId: string;
    onBack: () => void;
}

export function OrderDetailsPage({ orderId, onBack }: OrderDetailsPageProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrderDetails();
    }, [orderId]);

    const loadOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await api.getOrder(orderId);
            if (response.success && response.data) {
                const o = response.data;
                const convertedOrder: Order = {
                    id: o.id,
                    items: o.items?.map((item: any) => ({
                        id: item.productId || item.id,
                        name: item.product?.name || 'Unknown Product',
                        category: item.product?.category || 'General',
                        price: item.price,
                        originalPrice: item.product?.originalPrice,
                        imageUrl: item.product?.imageUrl || '/placeholder.jpg',
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
                };
                setOrder(convertedOrder);
            } else {
                toast.error((response as any).error || 'Failed to load order details');
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const response = await api.updateOrder(orderId, { status: newStatus });
            if (response.success) {
                setOrder(prev => prev ? { ...prev, status: newStatus } : null);
                toast.success(`Order status updated to ${newStatus}`);
            } else {
                toast.error(response.error || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { bg: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Pending' };
            case 'processing': return { bg: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Processing' };
            case 'shipped': return { bg: 'bg-purple-100 text-purple-700', icon: Truck, label: 'Shipped' };
            case 'out-for-delivery': return { bg: 'bg-amber-100 text-amber-700', icon: Truck, label: 'Out for Delivery' };
            case 'delivered': return { bg: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' };
            case 'cancelled': return { bg: 'bg-red-100 text-red-700', icon: X, label: 'Cancelled' };
            default: return { bg: 'bg-gray-100 text-gray-700', icon: Package, label: status };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order not found</h2>
                <Button onClick={onBack} variant="outline">
                    <ChevronLeft className="mr-2 w-4 h-4" /> Go Back
                </Button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Print Only Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white !important; font-family: 'Inter', sans-serif !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                }
                .print-only { display: none; }
            `}} />

            {/* Receipt Component (Print Only) */}
            <div className="print-only mx-auto p-4 text-slate-900 bg-white" style={{ width: '80mm', minHeight: 'auto' }}>
                {/* Store Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black tracking-tighter mb-0.5">NŪRA</h1>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Receipt</p>
                    <p className="text-[7px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Hargeisa, Somaliland</p>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-300 my-4" />

                {/* Order Meta */}
                <div className="space-y-1 mb-4 text-[10px]">
                    <div className="flex justify-between">
                        <span className="font-bold text-slate-400 uppercase tracking-widest">Order ID:</span>
                        <span className="font-black text-slate-900 font-mono tracking-tight">#{order.id.includes('-') ? order.id.split('-')[1] : order.id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold text-slate-400 uppercase tracking-widest">Date:</span>
                        <span className="font-black text-slate-900">{order.orderDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold text-slate-400 uppercase tracking-widest">Payment:</span>
                        <span className="font-black text-slate-900 uppercase">{order.paymentInfo.paymentMethod}</span>
                    </div>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-300 my-4" />

                {/* Customer Section */}
                <div className="mb-4 text-[10px]">
                    <p className="font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Info</p>
                    <p className="font-black text-slate-900 text-xs leading-none mb-1">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p className="font-bold text-slate-600 mb-0.5">{order.shippingInfo.phone}</p>
                    {order.shippingInfo.whatsapp && <p className="font-bold text-emerald-600 mb-0.5">WA: {order.shippingInfo.whatsapp}</p>}
                    <p className="font-bold text-slate-600 italic mt-1 leading-tight">
                        Loc: {order.shippingInfo.quartier}, {order.shippingInfo.placeToReceive}
                    </p>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-300 my-4" />

                {/* Items Table */}
                <div className="mb-6">
                    <div className="flex text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                        <span className="flex-1">Description</span>
                        <span className="w-8 text-center">Qty</span>
                        <span className="w-16 text-right">Total</span>
                    </div>

                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex text-[10px] items-start px-1 leading-tight">
                                <div className="flex-1 pr-2">
                                    <p className="font-black text-slate-900">{item.name}</p>
                                    {item.size && <p className="text-[7px] font-black text-amber-600 uppercase tracking-widest mt-0.5">Size: {item.size}</p>}
                                </div>
                                <span className="w-8 text-center font-bold text-slate-600">{item.quantity}</span>
                                <span className="w-16 text-right font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-300 my-4" />

                {/* Totals Section */}
                <div className="space-y-1.5 px-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 mt-1.5 border-t border-slate-900">
                        <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Total</span>
                        <span className="text-xl font-black text-slate-900">${order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Receipt Footer */}
                <div className="mt-10 text-center space-y-4">
                    <div className="inline-block border-2 border-slate-900 px-4 py-2">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Thank You</p>
                    </div>
                    <div>
                        <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em]">www.nura-cosmetics.com</p>
                        <p className="text-[8px] font-black text-slate-900 mt-1">Visit us again!</p>
                    </div>
                    <div className="h-4" />
                </div>
            </div>

            {/* UI Version (Hidden on Print) */}
            <div className="no-print space-y-8">
                {/* Top Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center text-slate-500 hover:text-slate-900 font-semibold group transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-slate-300">
                            <ChevronLeft size={18} />
                        </div>
                        Back to Orders
                    </button>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => window.print()} className="hidden sm:flex hover:bg-slate-900 hover:text-white transition-all font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-2">
                            Print Receipt
                        </Button>
                    </div>
                </div>

                {/* Header Info */}
                <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${statusConfig.bg}`}>
                                <StatusIcon size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order #{order.id.includes('-') ? order.id.split('-')[1] : order.id.slice(-6).toUpperCase()}</h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${statusConfig.bg}`}>
                                        {statusConfig.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} strokeWidth={3} />
                                        {order.orderDate.toLocaleDateString('en-US', { dateStyle: 'full' })}
                                    </span>
                                    <span>•</span>
                                    <span>{order.items.length} Items</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['pending', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => {
                                const isActive = order.status === status;
                                const config = getStatusConfig(status);
                                return (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${isActive
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Items & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Table */}
                        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <ShoppingBag size={14} strokeWidth={3} />
                                    Order Items
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4 text-center">Qty</th>
                                            <th className="px-6 py-4 text-right">Price</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm leading-tight mb-1">{item.name}</p>
                                                            {item.size && (
                                                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Size: {item.size}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-bold text-slate-600">{item.quantity}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-bold text-slate-600">${item.price.toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Totals Section */}
                            <div className="p-8 bg-slate-50/30 border-t border-slate-100">
                                <div className="max-w-[240px] ml-auto space-y-3">
                                    <div className="flex justify-between text-sm font-bold text-slate-500">
                                        <span>Subtotal</span>
                                        <span>${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-slate-500">
                                        <span>Shipping</span>
                                        <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="h-[1px] bg-slate-200 my-2" />
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total</span>
                                        <span className="text-2xl font-black text-amber-600 underline decoration-amber-500/30 decoration-4 underline-offset-4">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <CreditCard size={14} strokeWidth={3} />
                                Payment Information
                            </h3>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Payment Method</p>
                                    <p className="font-bold text-slate-900 uppercase">{order.paymentInfo.paymentMethod}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Customer Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <Users size={14} strokeWidth={3} />
                                Customer Details
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-amber-600">
                                        {order.shippingInfo.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-lg leading-none mb-1">
                                            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                        </p>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">New Customer</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 truncate">{order.shippingInfo.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{order.shippingInfo.phone}</span>
                                    </div>
                                    {order.shippingInfo.whatsapp && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                <Phone size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600">WhatsApp: {order.shippingInfo.whatsapp}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <MapPin size={14} strokeWidth={3} />
                                Delivery Address
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quartier</p>
                                    <p className="text-slate-900 font-bold">{order.shippingInfo.quartier}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Drop-off Point</p>
                                    <p className="text-slate-900 font-bold">{order.shippingInfo.placeToReceive}</p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-100 flex items-start gap-3">
                                    <Truck size={14} className="text-slate-400 mt-1" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                        Expected delivery within 24-48 hours of processing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

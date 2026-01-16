import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { api } from '../../../lib/api';

interface CustomerSummary {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    totalOrders: number;
    lastOrderDate: string | null;
    createdAt: string;
}

export function CustomersManagement() {
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const response = await api.getCustomers();
            if (response.success && response.data) {
                setCustomers(response.data);
            } else {
                toast.error((response as any).error || 'Failed to load customers');
            }
        } catch (error) {
            console.error('Error loading customers:', error);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const loadCustomerDetails = async (id: string) => {
        try {
            const response = await api.getCustomer(id);
            if (response.success && response.data) {
                setSelectedCustomer(response.data);
            } else {
                toast.error((response as any).error || 'Failed to load customer details');
            }
        } catch (error) {
            console.error('Error loading customer details:', error);
            toast.error('Failed to load customer details');
        }
    };

    const filteredCustomers = customers.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
                    <p className="text-gray-600 mt-1">View and manage your customer base</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                <div className="relative group w-full md:w-96">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Orders</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Order</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading customers...</td>
                                        </tr>
                                    ) : filteredCustomers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No customers found</td>
                                        </tr>
                                    ) : (
                                        filteredCustomers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                                                onClick={() => loadCustomerDetails(customer.id)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                                                            {customer.firstName?.[0] || customer.lastName?.[0] || customer.email[0]?.toUpperCase() || 'C'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">
                                                                {customer.firstName || customer.lastName ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : 'Guest Customer'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                            <Mail size={12} />
                                                            {customer.email}
                                                        </div>
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                                <Phone size={12} />
                                                                {customer.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-900">
                                                        {customer.totalOrders}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders yet'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {selectedCustomer ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 sticky top-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
                                <button onClick={() => setSelectedCustomer(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl shadow-amber-500/20">
                                    {selectedCustomer.firstName?.[0] || selectedCustomer.email[0].toUpperCase()}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</h4>
                                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Info</h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Phone size={16} className="text-amber-600" />
                                            <span className="text-sm font-medium text-gray-700">{selectedCustomer.phone || 'No phone provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Mail size={16} className="text-amber-600" />
                                            <span className="text-sm font-medium text-gray-700 truncate">{selectedCustomer.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Orders</h5>
                                    <div className="space-y-3">
                                        {selectedCustomer.orders?.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic text-center py-4">No order history available</p>
                                        ) : (
                                            selectedCustomer.orders?.map((order: any) => (
                                                <div key={order.id} className="p-3 border border-gray-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/50 transition-all">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</span>
                                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase">{order.status}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                        <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            )).slice(0, 3)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 text-center h-[400px] flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Customer</h3>
                            <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Click on any customer row to see deep insights and order history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

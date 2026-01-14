import { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { User, Package, MapPin, Heart, Settings, LogOut, Edit2, Trash2, Plus, X, Eye } from 'lucide-react';
import { getOrders } from '../data/orders';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { api } from '../../lib/api';

type Tab = 'overview' | 'orders' | 'settings' | 'addresses' | 'wishlist';

interface Address {
    id: string;
    type: 'shipping' | 'billing';
    isDefault: boolean;
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}

interface DBAddress {
    id: string;
    type: string;
    isDefault: boolean;
    firstName: string | null;
    lastName: string | null;
    address: string;
    apartment: string | null;
    city: string;
    state: string | null;
    zipCode: string | null;
    country: string;
    phone: string | null;
    userId: string | null;
}

export function UserProfile() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [showOrderDetail, setShowOrderDetail] = useState<string | null>(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    const orders = getOrders();
    const userOrders = orders.filter(order => order.customerEmail === user?.email);

    // Convert DB address to frontend format
    const dbToFrontendAddress = (dbAddr: DBAddress): Address => ({
        id: dbAddr.id,
        type: dbAddr.type as 'shipping' | 'billing',
        isDefault: dbAddr.isDefault,
        fullName: `${dbAddr.firstName || ''} ${dbAddr.lastName || ''}`.trim() || 'N/A',
        street: dbAddr.address,
        city: dbAddr.city,
        state: dbAddr.state || '',
        zipCode: dbAddr.zipCode || '',
        country: dbAddr.country,
        phone: dbAddr.phone || '',
    });

    // Convert frontend address to DB format
    const frontendToDBAddress = (addr: Address | Omit<Address, 'id'>) => {
        const [firstName, ...lastNameParts] = addr.fullName.split(' ');
        return {
            type: addr.type,
            firstName: firstName || null,
            lastName: lastNameParts.join(' ') || null,
            address: addr.street,
            city: addr.city,
            state: addr.state || null,
            zipCode: addr.zipCode || null,
            country: addr.country,
            phone: addr.phone || null,
            isDefault: addr.isDefault,
        };
    };

    // Fetch addresses from API
    useEffect(() => {
        if (user?.id) {
            setLoadingAddresses(true);
            api.getAddresses(user.id)
                .then((response) => {
                    if (response.success && response.data) {
                        const converted = (response.data as DBAddress[]).map(dbToFrontendAddress);
                        setAddresses(converted);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch addresses:', error);
                    toast.error('Failed to load addresses');
                })
                .finally(() => {
                    setLoadingAddresses(false);
                });
        }
    }, [user?.id]);

    const tabs = [
        { id: 'overview' as Tab, label: 'Overview', icon: User },
        { id: 'orders' as Tab, label: 'Orders', icon: Package },
        { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
        { id: 'wishlist' as Tab, label: 'Wishlist', icon: Heart },
        { id: 'settings' as Tab, label: 'Settings', icon: Settings },
    ];

    const handleAddAddress = async (address: Omit<Address, 'id'>) => {
        if (!user?.id) {
            toast.error('You must be logged in to add an address');
            return;
        }

        try {
            const dbData = frontendToDBAddress(address);
            const response = await api.createAddress({
                userId: user.id,
                ...dbData,
            });

            if (response.success && response.data) {
                const newAddress = dbToFrontendAddress(response.data as DBAddress);
                setAddresses([...addresses, newAddress]);
                setShowAddressForm(false);
                toast.success('Address added successfully');
            } else {
                toast.error(response.error || 'Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error('Failed to add address');
        }
    };

    const handleUpdateAddress = async (address: Address) => {
        try {
            const dbData = frontendToDBAddress(address);
            const response = await api.updateAddress(address.id, dbData);

            if (response.success && response.data) {
                const updatedAddress = dbToFrontendAddress(response.data as DBAddress);
                setAddresses(addresses.map(a => a.id === address.id ? updatedAddress : a));
                setEditingAddress(null);
                toast.success('Address updated successfully');
            } else {
                toast.error(response.error || 'Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
            toast.error('Failed to update address');
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            const response = await api.deleteAddress(id);
            if (response.success) {
                setAddresses(addresses.filter(a => a.id !== id));
                toast.success('Address deleted');
            } else {
                toast.error(response.error || 'Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefaultAddress = async (id: string) => {
        try {
            const response = await api.setDefaultAddress(id);
            if (response.success && response.data) {
                const updatedAddress = dbToFrontendAddress(response.data as DBAddress);
                setAddresses(addresses.map(a => 
                    a.id === id ? updatedAddress : { ...a, isDefault: false }
                ));
                toast.success('Default address updated');
            } else {
                toast.error(response.error || 'Failed to set default address');
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error('Failed to set default address');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-serif text-gray-900">My Account</h1>
                            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                // Redirect to home after logout
                                window.location.href = '/';
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-amber-50 text-amber-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Orders</p>
                                                <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Addresses</p>
                                                <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                                <Heart className="w-6 h-6 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Wishlist Items</p>
                                                <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                                    {userOrders.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {userOrders.slice(0, 3).map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                                                    <div>
                                                        <p className="font-medium">Order #{order.id}</p>
                                                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                                {userOrders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No orders yet</p>
                                        <p className="text-sm text-gray-400 mt-2">Start shopping to see your orders here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:border-amber-300 transition-colors">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                                                        <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="border-t pt-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                                                            <p className="text-lg font-semibold mt-1">${order.total.toFixed(2)}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setShowOrderDetail(order.id)}
                                                            className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                                                        >
                                                            <Eye size={18} />
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Saved Addresses</h2>
                                    {!showAddressForm && !editingAddress && (
                                        <Button
                                            onClick={() => setShowAddressForm(true)}
                                            className="bg-amber-700 hover:bg-amber-800"
                                        >
                                            <Plus size={18} className="mr-2" />
                                            Add Address
                                        </Button>
                                    )}
                                </div>

                                {/* Address Form */}
                                {(showAddressForm || editingAddress) && (
                                    <AddressForm
                                        address={editingAddress}
                                        onSave={(address) => {
                                            if (editingAddress) {
                                                handleUpdateAddress({ ...address, id: editingAddress.id });
                                            } else {
                                                handleAddAddress(address);
                                            }
                                        }}
                                        onCancel={() => {
                                            setShowAddressForm(false);
                                            setEditingAddress(null);
                                        }}
                                    />
                                )}

                                {/* Addresses List */}
                                {loadingAddresses ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Loading addresses...</p>
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No addresses saved yet</p>
                                        <p className="text-sm text-gray-400 mt-2">Add your first address to get started</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-amber-300 transition-colors">
                                                {address.isDefault && (
                                                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded mb-3">
                                                        Default
                                                    </span>
                                                )}
                                                <h3 className="font-semibold text-lg mb-2">{address.fullName}</h3>
                                                <p className="text-gray-600 text-sm">{address.street}</p>
                                                <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                                                <p className="text-gray-600 text-sm">{address.country}</p>
                                                <p className="text-gray-600 text-sm mt-2">{address.phone}</p>

                                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                                    {!address.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefaultAddress(address.id)}
                                                            className="text-sm text-amber-700 hover:text-amber-800"
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setEditingAddress(address)}
                                                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                    >
                                                        <Edit2 size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                                <div className="text-center py-12">
                                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Your wishlist is empty</p>
                                    <p className="text-sm text-gray-400 mt-2">Save your favorite items here</p>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <Input defaultValue={user?.name} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <Input type="email" defaultValue={user?.email} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <Input type="tel" placeholder="+1 (555) 123-4567" />
                                    </div>

                                    <div className="pt-6 border-t">
                                        <h3 className="font-semibold mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                                <Input type="password" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                <Input type="password" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                                <Input type="password" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button className="bg-amber-700 hover:bg-amber-800">
                                            Save Changes
                                        </Button>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Address Form Component
function AddressForm({
    address,
    onSave,
    onCancel,
}: {
    address: Address | null;
    onSave: (address: Omit<Address, 'id'>) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<Omit<Address, 'id'>>({
        type: address?.type || 'shipping',
        isDefault: address?.isDefault || false,
        fullName: address?.fullName || '',
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        zipCode: address?.zipCode || '',
        country: address?.country || '',
        phone: address?.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.street || !formData.city || !formData.country) {
            toast.error('Please fill in all required fields');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{address ? 'Edit Address' : 'Add New Address'}</h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <Input
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="123 Main Street"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="New York"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <Input
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="NY"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                        <Input
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            placeholder="10001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <Input
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="United States"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                        Set as default address
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-amber-700 hover:bg-amber-800 flex-1">
                        {address ? 'Update Address' : 'Add Address'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

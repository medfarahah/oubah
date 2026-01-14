import { useState, useEffect } from 'react';
import { Save, Store, Mail, CreditCard, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '../../../lib/api';

interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  shippingCost: number;
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
}

const defaultSettings: Settings = {
  storeName: 'NŪRA Collection',
  storeEmail: 'info@nura.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Fashion Street, New York, NY 10001',
  currency: 'USD',
  taxRate: 8.5,
  freeShippingThreshold: 150,
  shippingCost: 15,
  enableNotifications: true,
  enableEmailNotifications: true,
};

export function SettingsManagement() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.getSettings();
        if (response.success && response.data) {
          // Merge fetched settings with defaults
          setSettings({ ...defaultSettings, ...response.data });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save each setting to the database
      const settingKeys: (keyof Settings)[] = [
        'storeName',
        'storeEmail',
        'storePhone',
        'storeAddress',
        'currency',
        'taxRate',
        'freeShippingThreshold',
        'shippingCost',
        'enableNotifications',
        'enableEmailNotifications',
      ];

      const savePromises = settingKeys.map(async (key) => {
        const value = settings[key];
        const type = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string';
        
        return api.updateSetting({
          key,
          value,
          type,
          description: `Store setting: ${key}`,
        });
      });

      await Promise.all(savePromises);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure your store settings and preferences</p>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Store Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
            <Input
              value={settings.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Store Email</label>
            <Input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => handleChange('storeEmail', e.target.value)}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Store Phone</label>
            <Input
              value={settings.storePhone}
              onChange={(e) => handleChange('storePhone', e.target.value)}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Store Address</label>
            <Input
              value={settings.storeAddress}
              onChange={(e) => handleChange('storeAddress', e.target.value)}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Payment & Shipping */}
      <div className="bg-white rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Payment & Shipping</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
            <Input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Threshold ($)</label>
            <Input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Standard Shipping Cost ($)</label>
            <Input
              type="number"
              value={settings.shippingCost}
              onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value))}
              className="border-gray-200 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Enable Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications for new orders and updates</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => handleChange('enableNotifications', e.target.checked)}
              className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
          </label>
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email alerts for important events</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableEmailNotifications}
              onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
              className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Admin Credentials:</strong> admin@nura.com / admin123
            </p>
            <p className="text-xs text-amber-700 mt-1">
              In production, implement proper authentication and password management.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/30 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} className="mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OrderStatus = 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

interface StatusInfo {
  label: string;
  description: string;
}

const STATUS_TEXT: Record<OrderStatus, StatusInfo> = {
  processing: {
    label: 'Processing',
    description: 'We have received your order and are preparing it.',
  },
  shipped: {
    label: 'Shipped',
    description: 'Your order has left our warehouse.',
  },
  out_for_delivery: {
    label: 'Out for delivery',
    description: 'Your order is on its way to you.',
  },
  delivered: {
    label: 'Delivered',
    description: 'Your order has been delivered.',
  },
};

function getStatusFromOrderId(orderId: string): { status: OrderStatus; placedAt: Date } | null {
  const match = /^ORD-(\d+)$/.exec(orderId.trim());
  if (!match) return null;

  const timestamp = Number(match[1]);
  if (Number.isNaN(timestamp)) return null;

  const placedAt = new Date(timestamp);
  const diffMs = Date.now() - timestamp;
  const diffHours = diffMs / (1000 * 60 * 60);

  let status: OrderStatus;
  if (diffHours < 1) status = 'processing';
  else if (diffHours < 12) status = 'shipped';
  else if (diffHours < 36) status = 'out_for_delivery';
  else status = 'delivered';

  return { status, placedAt };
}

export function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
  const [orderId, setOrderId] = useState('');
  const [lookedUpId, setLookedUpId] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof getStatusFromOrderId> | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = () => {
    setError(null);
    setResult(null);
    setLookedUpId(null);

    if (!orderId.trim()) {
      setError('Please enter your order number (e.g. ORD-1715678900000).');
      return;
    }

    const lookup = getStatusFromOrderId(orderId);
    if (!lookup) {
      setError('We could not find an order with that number. Please check and try again.');
      return;
    }

    setLookedUpId(orderId.trim());
    setResult(lookup);
  };

  const activeStatus = result?.status ?? null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[70]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="text-amber-700" size={22} />
              <h2 className="text-xl font-semibold">Track your order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Enter the order number shown on your confirmation screen (e.g. <span className="font-mono">ORD-1715678900000</span>).
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="ORD-..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTrack}>
              Track
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {result && lookedUpId && (
            <div className="mt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Order number</p>
                  <p className="font-mono text-sm">{lookedUpId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Placed on</p>
                  <p className="text-sm">
                    {result.placedAt.toLocaleDateString()} at{' '}
                    {result.placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="mt-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Status
                </p>
                <p className="text-sm font-medium">
                  {STATUS_TEXT[result.status].label}
                </p>
                <p className="text-xs text-gray-500">
                  {STATUS_TEXT[result.status].description}
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-3 border-t pt-3">
                <ol className="relative border-l border-gray-200 pl-4 space-y-4">
                  <li className="flex gap-3 items-start">
                    <span
                      className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                        'processing' === activeStatus ||
                        'shipped' === activeStatus ||
                        'out_for_delivery' === activeStatus ||
                        'delivered' === activeStatus
                          ? 'bg-amber-700'
                          : 'bg-gray-300'
                      }`}
                    >
                      <Clock size={10} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Order placed</p>
                      <p className="text-xs text-gray-500">
                        We&apos;ve received your order.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span
                      className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                        'shipped' === activeStatus ||
                        'out_for_delivery' === activeStatus ||
                        'delivered' === activeStatus
                          ? 'bg-amber-700'
                          : 'bg-gray-300'
                      }`}
                    >
                      <Truck size={10} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Shipped</p>
                      <p className="text-xs text-gray-500">
                        Your order has left our warehouse.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span
                      className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                        'out_for_delivery' === activeStatus ||
                        'delivered' === activeStatus
                          ? 'bg-amber-700'
                          : 'bg-gray-300'
                      }`}
                    >
                      <Truck size={10} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Out for delivery</p>
                      <p className="text-xs text-gray-500">
                        Our courier is on the way to you.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span
                      className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                        'delivered' === activeStatus ? 'bg-amber-700' : 'bg-gray-300'
                      }`}
                    >
                      <CheckCircle2 size={10} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Delivered</p>
                      <p className="text-xs text-gray-500">
                        Your order has been delivered to the address provided.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


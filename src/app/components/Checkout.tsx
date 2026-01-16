import { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check, CreditCard, Lock } from 'lucide-react';
import { CartItem, ShippingInfo, PaymentInfo, Order, Settings } from '../types';
import { useAuth } from '../auth';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { addOrder } from '../data/orders';
import { api } from '../../lib/api';

interface CheckoutProps {
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

export function Checkout({
  settings,
  isOpen,
  onClose,
  items,
  onOrderComplete,
}: CheckoutProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    whatsapp: '',
    quartier: '',
    placeToReceive: '',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'waafi',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + shipping + tax;

  const validateShipping = (): boolean => {
    const required = ['firstName', 'lastName', 'phone', 'quartier', 'placeToReceive'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (shippingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    // Both payment methods (waafi and cash) are valid for delivery
    return true;
  };

  const handleNext = () => {
    if (currentStep === 'shipping') {
      if (validateShipping()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      if (validatePayment()) {
        setCurrentStep('review');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Generate order ID
    const orderData = {
      customer: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      phone: shippingInfo.phone,
      email: shippingInfo.email,
      whatsapp: shippingInfo.whatsapp,
      quartier: shippingInfo.quartier,
      placeToReceive: shippingInfo.placeToReceive,
      items: items.map(item => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      })),
      subtotal,
      shipping: shipping,
      total,
      paymentMethod: paymentInfo.paymentMethod,
      userId: user?.id,
    };

    try {
      const response = await api.createOrder(orderData);
      if (response.success) {
        const newOrderId = response.data.id;
        setOrderId(newOrderId);

        // This keeps the local store in sync if needed, though the API is the source of truth now
        const localOrder: Order = {
          ...response.data,
          orderDate: new Date(response.data.createdAt)
        };
        addOrder(localOrder);

        toast.success(`Order #${newOrderId.split('-')[1]} placed successfully!`);
        setCurrentStep('confirmation');
      } else {
        toast.error(response.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('An unexpected error occurred while placing your order.');
    } finally {
      setIsProcessing(false);
    }

    // Call completion handler after a delay
    setTimeout(() => {
      onOrderComplete();
      onClose();
      // Reset form
      setCurrentStep('shipping');
      setOrderId('');
      setShippingInfo({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        whatsapp: '',
        quartier: '',
        placeToReceive: '',
      });
      setPaymentInfo({
        paymentMethod: 'waafi',
      });
    }, 3000);
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
      />

      {/* Checkout panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[600px] lg:w-[700px] bg-white z-[60] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Lock size={18} className="sm:w-5 sm:h-5 text-amber-700" />
            <h2 className="text-lg sm:text-xl font-semibold">Secure Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            aria-label="Close checkout"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        {currentStep !== 'confirmation' && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-white">
            {(['shipping', 'payment', 'review'] as const).map((step, index) => {
              const stepNames = { shipping: 'Shipping', payment: 'Payment', review: 'Review' };
              const isActive = (currentStep as string) === step;
              const isCompleted = (['shipping', 'payment', 'review'] as string[]).indexOf(currentStep) > index;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isActive
                        ? 'bg-amber-700 text-white'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {isCompleted ? <Check size={16} /> : index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 ${isActive ? 'text-amber-700 font-medium' : 'text-gray-500'
                        }`}
                    >
                      {stepNames[step as keyof typeof stepNames]}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'shipping' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Shipping Information</h3>
                <p className="text-gray-600 text-sm">Please provide your delivery details</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <Input
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name *</label>
                  <Input
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <Input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, phone: e.target.value })
                    }
                    placeholder="+252..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">WhatsApp No *</label>
                  <Input
                    type="tel"
                    value={shippingInfo.whatsapp}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, whatsapp: e.target.value })
                    }
                    placeholder="+252..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quartier (Neighborhood) *</label>
                <Input
                  value={shippingInfo.quartier}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, quartier: e.target.value })
                  }
                  placeholder="Enter your quartier"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">La place de resevoir (Drop-off Point) *</label>
                <Input
                  value={shippingInfo.placeToReceive}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, placeToReceive: e.target.value })
                  }
                  placeholder="Where would you like to receive it?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                <Input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Delivery Notes (optional)</label>
                <textarea
                  value={shippingInfo.deliveryNotes}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, deliveryNotes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[80px] resize-none"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Payment Method</h3>
                <p className="text-gray-600 text-sm">Choose your preferred payment method</p>
              </div>

              <div className="space-y-3">
                {(['waafi', 'cash'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentInfo({ ...paymentInfo, paymentMethod: method })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${paymentInfo.paymentMethod === method
                      ? 'border-amber-700 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentInfo.paymentMethod === method
                          ? 'border-amber-700'
                          : 'border-gray-300'
                          }`}
                      >
                        {paymentInfo.paymentMethod === method && (
                          <div className="w-3 h-3 rounded-full bg-amber-700" />
                        )}
                      </div>
                      <CreditCard size={20} className="text-gray-600" />
                      <span className="font-medium">
                        {method === 'waafi' ? 'WAAFI on Delivery' : 'Cash on Delivery'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {paymentInfo.paymentMethod === 'waafi' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Payment will be processed via WAAFI upon delivery. Please have your WAAFI account ready.
                  </p>
                </div>
              )}

              {paymentInfo.paymentMethod === 'cash' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Payment will be collected upon delivery. Please have exact change ready.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'review' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Order Review</h3>
                <p className="text-gray-600 text-sm">Please review your order before placing it</p>
              </div>

              {/* Order Items */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-lg">Order Items</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-20 h-24 bg-gray-100 flex-shrink-0 rounded">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">Delivery Details</h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p>Quartier: {shippingInfo.quartier}</p>
                  <p>Drop-off: {shippingInfo.placeToReceive}</p>
                  <div className="mt-2 pt-2 border-t flex flex-wrap gap-x-4 gap-y-1">
                    <p>Phone: {shippingInfo.phone}</p>
                    <p>WhatsApp: {shippingInfo.whatsapp}</p>
                    {shippingInfo.email && <p>Email: {shippingInfo.email}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">Payment Method</h4>
                <p className="text-sm text-gray-600">
                  {paymentInfo.paymentMethod === 'waafi' ? 'WAAFI on Delivery' : 'Cash on Delivery'}
                </p>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <h4 className="font-semibold">Order Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {settings.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({settings.taxRate}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'confirmation' && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={40} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-600">
                  Thank you for your purchase. You will receive a confirmation email shortly.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-xl font-semibold">{orderId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {currentStep !== 'confirmation' && (
          <div className="border-t p-6 bg-gray-50 space-y-4">
            {/* Order Summary (always visible) */}
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-semibold">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              {currentStep !== 'shipping' && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              )}
              {currentStep === 'review' ? (
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-amber-700 hover:bg-amber-800"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-amber-700 hover:bg-amber-800"
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

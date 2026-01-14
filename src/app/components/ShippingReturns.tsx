import { Package, Truck, RefreshCw, Clock, Shield, CheckCircle, MessageCircle } from 'lucide-react';

export function ShippingReturns() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">
                        Shipping & Returns
                    </h1>
                    <p className="text-xl text-gray-700">
                        Everything you need to know about our shipping and return policies
                    </p>
                </div>
            </section>

            {/* Shipping Information */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-serif mb-8 text-gray-900">Shipping Information</h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Standard Shipping</h3>
                            <p className="text-gray-700 mb-4">5-7 business days</p>
                            <p className="text-3xl font-bold text-blue-700 mb-2">FREE</p>
                            <p className="text-sm text-gray-600">On orders over $150</p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8">
                            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Express Shipping</h3>
                            <p className="text-gray-700 mb-4">2-3 business days</p>
                            <p className="text-3xl font-bold text-amber-700 mb-2">$15.99</p>
                            <p className="text-sm text-gray-600">Expedited delivery</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 mb-12">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Shipping Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Processing Time</h4>
                                    <p className="text-gray-700">Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">International Shipping</h4>
                                    <p className="text-gray-700">We ship to over 30 countries worldwide. International shipping takes 7-14 business days. Customs fees and import duties are the responsibility of the customer.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Order Tracking</h4>
                                    <p className="text-gray-700">Track your order anytime using the tracking number provided in your shipping confirmation email, or use our "Track Order" feature in the header.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Returns & Exchanges */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-serif mb-8 text-gray-900">Returns & Exchanges</h2>

                    <div className="bg-white rounded-2xl p-8 mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900">30-Day Return Policy</h3>
                                <p className="text-gray-600">Hassle-free returns within 30 days of delivery</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Return Eligibility</h4>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Items must be unworn, unwashed, and in original condition</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Original tags must be attached</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Items must be in original packaging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-600 mt-1">✗</span>
                                        <span>Sale items are final sale and cannot be returned</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">How to Return</h4>
                                <ol className="space-y-3 text-gray-700">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-amber-700">1.</span>
                                        <span>Contact our customer service team at support@nuracollection.com or call +1 (555) 123-4567</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-amber-700">2.</span>
                                        <span>We'll provide you with a return authorization number and shipping label</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-amber-700">3.</span>
                                        <span>Pack your items securely with the original packaging and tags</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-amber-700">4.</span>
                                        <span>Ship your return using the provided label</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-amber-700">5.</span>
                                        <span>Once we receive and inspect your return, we'll process your refund within 5-7 business days</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-6 h-6 text-amber-700" />
                                <h4 className="font-semibold text-gray-900">Refund Timeline</h4>
                            </div>
                            <p className="text-gray-700">Refunds are processed within 5-7 business days after we receive your return. Please allow an additional 3-5 business days for the refund to appear in your account.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-6 h-6 text-amber-700" />
                                <h4 className="font-semibold text-gray-900">Free Exchanges</h4>
                            </div>
                            <p className="text-gray-700">Need a different size or color? We offer free exchanges! Contact us to arrange an exchange, and we'll send your new item as soon as we receive your return.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-serif mb-4 text-gray-900">Questions About Shipping or Returns?</h2>
                    <p className="text-gray-700 mb-8">
                        Our customer service team is here to help with any questions or concerns.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@nuracollection.com"
                            className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors font-medium"
                        >
                            Email Support
                        </a>
                        <a
                            href="tel:+15551234567"
                            className="px-8 py-3 bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-700 rounded-lg transition-colors font-medium"
                        >
                            Call Us
                        </a>
                        <a
                            href="https://wa.me/25377213018"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    title: string;
    items: FAQItem[];
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const faqCategories: FAQCategory[] = [
        {
            title: 'Orders & Payment',
            items: [
                {
                    question: 'How do I place an order?',
                    answer: 'Simply browse our collection, add items to your cart, and proceed to checkout. You\'ll need to create an account or sign in to complete your purchase. Follow the prompts to enter your shipping information and payment details.',
                },
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted.',
                },
                {
                    question: 'Can I modify or cancel my order?',
                    answer: 'You can modify or cancel your order within 1 hour of placing it. Please contact our customer service team immediately at support@nuracollection.com or call us at +1 (555) 123-4567.',
                },
                {
                    question: 'Do you offer gift cards?',
                    answer: 'Yes! Gift cards are available in denominations of $25, $50, $100, and $200. They make perfect gifts and never expire.',
                },
            ],
        },
        {
            title: 'Shipping & Delivery',
            items: [
                {
                    question: 'How long does shipping take?',
                    answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. International shipping times vary by location.',
                },
                {
                    question: 'Do you ship internationally?',
                    answer: 'Yes, we ship to over 30 countries worldwide. Shipping costs and delivery times vary by destination. International customers are responsible for any customs fees or import duties.',
                },
                {
                    question: 'How can I track my order?',
                    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by clicking "Track Order" in the header and entering your order number.',
                },
                {
                    question: 'What if my package is lost or damaged?',
                    answer: 'If your package is lost or arrives damaged, please contact us within 48 hours of the expected delivery date. We\'ll work with the carrier to resolve the issue and send a replacement if necessary.',
                },
            ],
        },
        {
            title: 'Returns & Exchanges',
            items: [
                {
                    question: 'What is your return policy?',
                    answer: 'We offer a 30-day return policy for unworn, unwashed items with original tags attached. Items must be in their original condition. Sale items are final sale and cannot be returned.',
                },
                {
                    question: 'How do I return an item?',
                    answer: 'Contact our customer service team to initiate a return. We\'ll provide you with a return shipping label and instructions. Once we receive and inspect your return, we\'ll process your refund within 5-7 business days.',
                },
                {
                    question: 'Can I exchange an item?',
                    answer: 'Yes! We offer free exchanges for different sizes or colors. Contact us to arrange an exchange, and we\'ll send your new item as soon as we receive your return.',
                },
                {
                    question: 'Who pays for return shipping?',
                    answer: 'For defective items or our errors, we cover return shipping. For other returns, customers are responsible for return shipping costs unless you\'re exchanging for a different size.',
                },
            ],
        },
        {
            title: 'Products & Sizing',
            items: [
                {
                    question: 'How do I choose the right size?',
                    answer: 'Please refer to our Size Guide page for detailed measurements. If you\'re between sizes, we recommend sizing up. Our customer service team is also happy to help with sizing questions.',
                },
                {
                    question: 'What materials are your products made from?',
                    answer: 'We use premium materials including silk, chiffon, jersey, and cotton blends. Each product page lists the specific fabric composition and care instructions.',
                },
                {
                    question: 'Are your hijabs suitable for all seasons?',
                    answer: 'Yes! We offer lightweight fabrics for summer and warmer, heavier materials for winter. Check the product description for seasonal recommendations.',
                },
                {
                    question: 'Do you restock sold-out items?',
                    answer: 'Popular items are often restocked. Sign up for restock notifications on the product page, or contact us to inquire about specific items.',
                },
            ],
        },
        {
            title: 'Account & Privacy',
            items: [
                {
                    question: 'Do I need an account to shop?',
                    answer: 'While you can browse without an account, you\'ll need to create one to complete a purchase. Having an account also allows you to track orders, save favorites, and checkout faster.',
                },
                {
                    question: 'How is my personal information protected?',
                    answer: 'We take privacy seriously. All data is encrypted and stored securely. We never share your information with third parties. Read our Privacy Policy for full details.',
                },
                {
                    question: 'How do I update my account information?',
                    answer: 'Log in to your account and click on "My Profile" to update your personal information, shipping addresses, and payment methods.',
                },
                {
                    question: 'Can I delete my account?',
                    answer: 'Yes, you can request account deletion by contacting our customer service team. Please note that this action is permanent and cannot be undone.',
                },
            ],
        },
    ];

    const toggleFAQ = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-700">
                        Find answers to common questions about orders, shipping, returns, and more.
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {faqCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="mb-12">
                            <h2 className="text-3xl font-serif mb-6 text-gray-900">{category.title}</h2>
                            <div className="space-y-4">
                                {category.items.map((item, itemIndex) => {
                                    const key = `${categoryIndex}-${itemIndex}`;
                                    const isOpen = openIndex === key;

                                    return (
                                        <div
                                            key={itemIndex}
                                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-amber-300 transition-colors"
                                        >
                                            <button
                                                onClick={() => toggleFAQ(categoryIndex, itemIndex)}
                                                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-semibold text-gray-900 pr-8">{item.question}</span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-amber-700 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-6 bg-gray-50">
                                                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-20 bg-amber-50 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-serif mb-4 text-gray-900">Still Have Questions?</h2>
                    <p className="text-gray-700 mb-8">
                        Can't find what you're looking for? Our customer service team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@nuracollection.com"
                            className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors font-medium"
                        >
                            Email Us
                        </a>
                        <a
                            href="tel:+15551234567"
                            className="px-8 py-3 bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-700 rounded-lg transition-colors font-medium"
                        >
                            Call Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

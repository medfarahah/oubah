import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">Get in Touch</h1>
                    <p className="text-xl text-gray-700">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-serif mb-6 text-gray-900">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                    <Input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                                >
                                    <Send size={18} className="mr-2" />
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-serif mb-6 text-gray-900">Contact Information</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-amber-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">hello@nuracollection.com</p>
                                        <p className="text-gray-600">support@nuracollection.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-amber-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-sm text-gray-500">Mon-Fri: 9AM - 6PM EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                                        <a 
                                            href="https://wa.me/25377213018" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-green-600 transition-colors"
                                        >
                                            +253 77 21 30 18
                                        </a>
                                        <p className="text-sm text-gray-500">Available 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-amber-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                        <p className="text-gray-600">123 Fashion Avenue</p>
                                        <p className="text-gray-600">New York, NY 10001</p>
                                        <p className="text-gray-600">United States</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-12 h-12 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center transition-colors">
                                        <Instagram className="w-6 h-6 text-amber-700" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center transition-colors">
                                        <Facebook className="w-6 h-6 text-amber-700" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center transition-colors">
                                        <Twitter className="w-6 h-6 text-amber-700" />
                                    </a>
                                    <a 
                                        href="https://wa.me/25377213018" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                                        aria-label="Contact us on WhatsApp"
                                    >
                                        <MessageCircle className="w-6 h-6 text-green-600" />
                                    </a>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="mt-10 bg-amber-50 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Monday - Friday</span>
                                        <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Saturday</span>
                                        <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sunday</span>
                                        <span className="font-medium text-gray-900">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

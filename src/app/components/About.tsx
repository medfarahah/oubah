import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

export function About() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYWNjMTUiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCA0IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                <div className="relative text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-serif mb-4 text-gray-900">About NŪRA</h1>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
                        Redefining modest fashion with elegance and grace
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-serif mb-6 text-gray-900">Our Story</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Founded in 2020, NŪRA Collection was born from a simple vision: to create modest fashion that empowers women to express their faith and style with confidence.
                                </p>
                                <p>
                                    Our name, NŪRA, meaning "light" in Arabic, reflects our commitment to bringing radiance and beauty to modest wear. We believe that modesty and fashion are not mutually exclusive, but rather complementary expressions of personal identity.
                                </p>
                                <p>
                                    Every piece in our collection is thoughtfully designed and crafted with premium materials, ensuring that you feel as beautiful as you look.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 bg-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <span className="text-white text-6xl font-serif">N</span>
                                </div>
                                <p className="text-gray-700 italic">"Elegance in every thread"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-serif mb-12 text-center text-gray-900">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Quality First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We source only the finest fabrics and materials, ensuring every piece meets our exacting standards of quality and durability.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Ethical Production</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We partner with artisans and manufacturers who share our commitment to fair wages, safe working conditions, and sustainable practices.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Community Focus</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We're more than a brand—we're a community of women supporting each other in faith, fashion, and empowerment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold text-amber-700 mb-2">50K+</div>
                            <div className="text-gray-600">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-amber-700 mb-2">200+</div>
                            <div className="text-gray-600">Unique Designs</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-amber-700 mb-2">30+</div>
                            <div className="text-gray-600">Countries Served</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-amber-700 mb-2">4.9★</div>
                            <div className="text-gray-600">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-700 text-white px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif mb-6">Get in Touch</h2>
                    <p className="text-xl mb-8 text-amber-100">
                        Have questions or want to learn more about our collection? We'd love to hear from you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-amber-100">
                        <div className="flex items-center gap-2">
                            <Mail size={20} />
                            <span>hello@nuracollection.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={20} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <a 
                                href="https://wa.me/25377243018" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                +253 77 24 30 18
                            </a>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                        <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                            <Twitter size={20} />
                        </a>
                        <a 
                            href="https://wa.me/25377243018" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-green-500/20 hover:bg-green-500/30 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Contact us on WhatsApp"
                        >
                            <MessageCircle size={20} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

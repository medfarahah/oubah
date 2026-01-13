export function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">Privacy Policy</h1>
                    <p className="text-xl text-gray-700">Last updated: January 13, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto prose prose-lg">
                    <p className="text-gray-700 leading-relaxed mb-8">
                        At NŪRA Collection, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                    </p>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Information We Collect</h2>
                    <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Personal Information</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        When you create an account or make a purchase, we collect:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Name and contact information (email, phone number, shipping address)</li>
                        <li>Payment information (processed securely through our payment providers)</li>
                        <li>Order history and preferences</li>
                        <li>Account credentials</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Automatically Collected Information</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We automatically collect certain information when you visit our website:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Browser type and version</li>
                        <li>IP address and device information</li>
                        <li>Pages visited and time spent on our site</li>
                        <li>Referring website addresses</li>
                    </ul>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">How We Use Your Information</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We use your information to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Send marketing communications (with your consent)</li>
                        <li>Improve our website and customer experience</li>
                        <li>Prevent fraud and enhance security</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Information Sharing</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We do not sell your personal information. We may share your data with:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li><strong>Service Providers:</strong> Payment processors, shipping carriers, and email service providers who help us operate our business</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                    </ul>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Cookies and Tracking</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
                    </p>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Data Security</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                    </p>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Your Rights</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Access and update your personal information</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Object to certain data processing activities</li>
                        <li>Request a copy of your data</li>
                    </ul>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Children's Privacy</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Our website is not intended for children under 13. We do not knowingly collect personal information from children.
                    </p>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Changes to This Policy</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on our website.
                    </p>

                    <h2 className="text-3xl font-serif mt-12 mb-6 text-gray-900">Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you have questions about this Privacy Policy or how we handle your data, please contact us:
                    </p>
                    <div className="bg-amber-50 rounded-lg p-6 mb-6">
                        <p className="text-gray-700"><strong>Email:</strong> privacy@nuracollection.com</p>
                        <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                        <p className="text-gray-700"><strong>Address:</strong> 123 Fashion Avenue, New York, NY 10001</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

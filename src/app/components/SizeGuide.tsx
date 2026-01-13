import { Ruler } from 'lucide-react';

export function SizeGuide() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">Size Guide</h1>
                    <p className="text-xl text-gray-700">
                        Find your perfect fit with our comprehensive sizing information
                    </p>
                </div>
            </section>

            {/* How to Measure */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Ruler className="w-8 h-8 text-amber-700" />
                        <h2 className="text-4xl font-serif text-gray-900">How to Measure</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-amber-50 rounded-2xl p-8">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">For Hijabs</h3>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h4 className="font-semibold mb-2">Length</h4>
                                    <p>Measure from the top of your head to where you want the hijab to end (typically mid-back or waist).</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Width</h4>
                                    <p>Measure around your head where the hijab will sit, adding a few inches for comfort and styling.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-8">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">For Abayas</h3>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h4 className="font-semibold mb-2">Bust</h4>
                                    <p>Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Length</h4>
                                    <p>Measure from the highest point of your shoulder to your desired hem length.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Sleeve</h4>
                                    <p>Measure from shoulder to wrist with your arm slightly bent.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hijab Size Chart */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-serif mb-6 text-gray-900">Hijab Size Chart</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                                <thead className="bg-amber-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Size</th>
                                        <th className="px-6 py-4 text-left">Length</th>
                                        <th className="px-6 py-4 text-left">Width</th>
                                        <th className="px-6 py-4 text-left">Best For</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">Small</td>
                                        <td className="px-6 py-4">65-70 cm</td>
                                        <td className="px-6 py-4">170-180 cm</td>
                                        <td className="px-6 py-4">Petite frames, shorter styles</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">Medium</td>
                                        <td className="px-6 py-4">70-75 cm</td>
                                        <td className="px-6 py-4">180-190 cm</td>
                                        <td className="px-6 py-4">Average height, versatile styling</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">Large</td>
                                        <td className="px-6 py-4">75-80 cm</td>
                                        <td className="px-6 py-4">190-200 cm</td>
                                        <td className="px-6 py-4">Taller frames, fuller coverage</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">One Size</td>
                                        <td className="px-6 py-4">70-75 cm</td>
                                        <td className="px-6 py-4">185 cm</td>
                                        <td className="px-6 py-4">Universal fit, adjustable</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Abaya Size Chart */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-serif mb-6 text-gray-900">Abaya Size Chart</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                                <thead className="bg-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Size</th>
                                        <th className="px-6 py-4 text-left">Bust (cm)</th>
                                        <th className="px-6 py-4 text-left">Waist (cm)</th>
                                        <th className="px-6 py-4 text-left">Length (cm)</th>
                                        <th className="px-6 py-4 text-left">US Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">XS</td>
                                        <td className="px-6 py-4">81-86</td>
                                        <td className="px-6 py-4">66-71</td>
                                        <td className="px-6 py-4">140-145</td>
                                        <td className="px-6 py-4">0-2</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">S</td>
                                        <td className="px-6 py-4">86-91</td>
                                        <td className="px-6 py-4">71-76</td>
                                        <td className="px-6 py-4">145-150</td>
                                        <td className="px-6 py-4">4-6</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">M</td>
                                        <td className="px-6 py-4">91-97</td>
                                        <td className="px-6 py-4">76-81</td>
                                        <td className="px-6 py-4">150-155</td>
                                        <td className="px-6 py-4">8-10</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">L</td>
                                        <td className="px-6 py-4">97-102</td>
                                        <td className="px-6 py-4">81-86</td>
                                        <td className="px-6 py-4">155-160</td>
                                        <td className="px-6 py-4">12-14</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">XL</td>
                                        <td className="px-6 py-4">102-107</td>
                                        <td className="px-6 py-4">86-91</td>
                                        <td className="px-6 py-4">160-165</td>
                                        <td className="px-6 py-4">16-18</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">XXL</td>
                                        <td className="px-6 py-4">107-112</td>
                                        <td className="px-6 py-4">91-97</td>
                                        <td className="px-6 py-4">165-170</td>
                                        <td className="px-6 py-4">20-22</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Fit Tips */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8">
                        <h2 className="text-3xl font-serif mb-6 text-gray-900">Fit Tips</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Between Sizes?</h3>
                                <p className="text-gray-700">We recommend sizing up for a more comfortable, relaxed fit. Our garments are designed with modest coverage in mind.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Custom Alterations</h3>
                                <p className="text-gray-700">Many of our pieces can be altered for a perfect fit. Contact us for custom sizing options on select items.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Fabric Considerations</h3>
                                <p className="text-gray-700">Natural fabrics like cotton may shrink slightly after washing. Check care instructions and consider this when choosing your size.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                                <p className="text-gray-700">Our customer service team is happy to help with sizing questions. Contact us at support@nuracollection.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

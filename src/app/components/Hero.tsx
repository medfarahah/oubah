import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <div className="relative h-[500px] sm:h-[600px] md:h-[700px] bg-gradient-to-br from-amber-50 to-rose-50">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoaWphYiUyMGZhc2hpb258ZW58MXx8fHwxNzY4MjY0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Luxury Hijab Collection"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <div className="text-xs sm:text-sm tracking-widest text-amber-800 mb-3 sm:mb-4">WINTER 2026 COLLECTION</div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl mb-4 sm:mb-6 font-serif leading-tight">
            Elegant
            <br />
            <span className="italic">Modesty</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-lg">
            Discover our curated collection of premium hijabs and modest fashion crafted with the finest materials.
          </p>
          <button className="bg-gray-900 text-white px-6 sm:px-10 py-3 sm:py-4 hover:bg-amber-800 transition-colors text-sm sm:text-base font-semibold touch-manipulation">
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-tl-full" />
    </div>
  );
}

import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      id: 1,
      title: "China's Premium Special Oil Source",
      subtitle: "Direct Supply Chain from Bohai Bay to Global Markets",
      ctaText: "Explore Our Products",
      ctaLink: "/products",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Bohai%20Bay%20offshore%20drilling%20platform%20silhouette%2C%20deep%20blue%20color%2C%20industrial%20cinematic%20style%2C%20high%20contrast&sign=e81f5a5b6e3ca6e1f132b9baed80513c"
    },
  {
    id: 2,
    title: "High-Quality Special Oil",
    subtitle: "Compliant with Global Standards & Specifications",
    ctaText: "View Technical Specs",
    ctaLink: "/products/finished-lubricants",
    imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Golden%20lubricating%20oil%20pouring%20into%20machinery%20close%20up%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=e98dda1f40b359abeede5161ae03c5d4"
  },
    {
      id: 3,
      title: "Seamless Global Logistics",
      subtitle: "Reliable Shipping to 50+ Countries Worldwide",
      ctaText: "Check Logistics",
      ctaLink: "/logistics",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Port%20ISO%20Tank%20lifting%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=3dff7de8874ad1e6951f653bc316272e"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <div className="relative h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img 
              src={slide.imageUrl} 
              alt={slide.title || "Industrial lubricants"} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-white p-4">
              <div className="max-w-4xl text-center">
                 <h1 className="text-4xl md:text-6xl font-bold mb-4 font-['Montserrat'] tracking-tight text-white text-shadow-sm">
                   {slide.title}
                 </h1>
                {slide.subtitle && (
                   <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white text-balance">
                     {slide.subtitle}
                   </p>
                )}
                <Link 
                  to={slide.ctaLink}
                  className="inline-block bg-[var(--accent-brand)] text-white px-8 py-3 rounded-sm text-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-12' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

       {/* Trust & Certifications */}
      <section className="py-6 bg-[#003366] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <i className="fa-solid fa-certificate text-2xl mb-2 text-[#D4AF37]"></i>
              <p className="text-white">ISO 9001 Certified</p>
            </div>
            <div className="text-center">
              <i className="fa-solid fa-globe text-2xl mb-2 text-[#D4AF37]"></i>
              <p className="text-white">Export to 50+ Countries</p>
            </div>
            <div className="text-center">
              <i className="fa-solid fa-shield-alt text-2xl mb-2 text-[#D4AF37]"></i>
              <p className="text-white">Global Quality Standards</p>
            </div>
            <div className="text-center">
              <i className="fa-solid fa-truck-loading text-2xl mb-2 text-[#D4AF37]"></i>
              <p className="text-white">Reliable Supply Chain</p>
            </div>
            <div className="text-center">
              <i className="fa-solid fa-headset text-2xl mb-2 text-[#D4AF37]"></i>
              <p className="text-white">24/7 Technical Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Source Story Section */}
      <section className="py-20 bg-[#F4F6F9]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Bohai%20Bay%20Suizhong%2036-1%20oilfield%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=9f4c8c6ca66bbb1e614c3b21e28319c4" 
                alt="Bohai Bay Source" 
                className="w-full h-auto rounded-sm"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--primary-brand)] font-['Montserrat'] tracking-tight">
                Direct from China's Premium Oil Source
              </h2>
              <p className="text-lg text-[var(--text-body)] mb-6 leading-relaxed text-balance">
                As a professional supply chain platform for Chinese special oils, we provide direct access to the premium naphthenic crude from the Suizhong 36-1 oilfield in Bohai Bay, known for its naturally low sulfur content and exceptional properties.
              </p>
              <p className="text-lg text-[var(--text-body)] mb-8 leading-relaxed text-balance">
                Our advantage lies in connecting international buyers directly with China's top special oil manufacturers, ensuring quality, competitive pricing, and reliable supply. We handle all logistics, documentation, and quality control processes.
              </p>
              <Link 
                to="/about"
                className="inline-block border-2 border-[#003366] text-[#003366] px-8 py-3 rounded-sm text-lg font-semibold hover:bg-[#003366] hover:text-white transition-all"
              >
                Learn About Our Supply Chain
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories with Global Standards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#003366] font-['Montserrat']">
              China's Special Oil Portfolio
            </h2>
            <p className="text-lg text-[var(--text-body)] max-w-3xl mx-auto">
              We offer a comprehensive range of Chinese special oils that meet international standards and are exported to industrial clients worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--bg-light)] p-8 rounded-sm transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-[var(--primary-brand)] font-['Montserrat'] tracking-tight">
                  Transformer Oil
                </h3>
                <div className="bg-[#D4AF37] text-white px-3 py-1 text-sm rounded-sm">
                  ASTM D3487
                </div>
              </div>
              <div className="h-48 mb-6 overflow-hidden">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=High%20voltage%20substation%2C%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=e71969a158b69062605a8d012d4e2a1f" 
                  alt="Transformer Oil" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[var(--text-body)] mb-6 leading-relaxed text-balance">
                Premium naphthenic transformer oils with excellent dielectric properties and low sulfur content.
              </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Zero Corrosive Sulfur
                    </span>
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Arctic Grade (-45°C)
                    </span>
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      High Dielectric Strength
                    </span>
                  </div>
              <Link 
                to="/products/transformer-oil"
                className="inline-block bg-[var(--primary-brand)] text-white px-6 py-2 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                View Product
              </Link>
            </div>
            
            <div className="bg-[var(--bg-light)] p-8 rounded-sm transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-[var(--primary-brand)] font-['Montserrat'] tracking-tight">
                  Rubber Process Oil
                </h3>
                <div className="bg-[#D4AF37] text-white px-3 py-1 text-sm rounded-sm">
                  EU REACH
                </div>
              </div>
              <div className="h-48 mb-6 overflow-hidden">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rubber%20process%20oil%2C%20black%20tire%20with%20golden%20oil%2C%20industrial%20cinematic%20style&sign=bb0bd22e0f3ed8a2ffda720d447e836d" 
                  alt="Rubber Process Oil" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[var(--text-body)] mb-6 leading-relaxed text-balance">
                High solvency naphthenic oils for rubber compounding with low PAH content.
              </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Cn% &gt; 35%
                    </span>
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Low PAHs
                    </span>
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Tire Manufacturing
                    </span>
                  </div>
              <Link 
                to="/products/rubber-process-oil"
                className="inline-block bg-[var(--primary-brand)] text-white px-6 py-2 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                View Product
              </Link>
            </div>
            
            <div className="bg-[var(--bg-light)] p-8 rounded-sm transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-[var(--primary-brand)] font-['Montserrat'] tracking-tight">
                  Hydraulic Oil
                </h3>
                <div className="bg-[#D4AF37] text-white px-3 py-1 text-sm rounded-sm">
                  DIN 51524
                </div>
              </div>
              <div className="h-48 mb-6 overflow-hidden">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Hydraulic%20system%2C%20industrial%20equipment%2C%20lubricant%2C%20industrial%20cinematic%20style&sign=33609a34b59d1fb5fa3876bebfae685e" 
                  alt="Hydraulic Oil" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[var(--text-body)] mb-6 leading-relaxed text-balance">
                High-performance anti-wear hydraulic oils for industrial applications.
              </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      High Pressure
                    </span>
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Anti-Wear
                    </span>
                    <span className="text-xs px-3 py-1 bg-[var(--primary-brand)] bg-opacity-10 text-white rounded-full">
                      Wide Temp Range
                    </span>
                  </div>
              <Link 
                to="/products/finished-lubricants"
                className="inline-block bg-[var(--primary-brand)] text-white px-6 py-2 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Customer Benefits */}
      <section className="py-20 bg-[#003366] text-white">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold mb-12 text-center font-['Montserrat'] text-white">
            Why Buy Chinese Special Oil Through Us?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-8 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-6">
                <i className="fa-solid fa-dollar-sign"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-['Montserrat'] text-white">
                Competitive Pricing
              </h3>
              <p className="text-white/80">
                Direct factory access without middlemen markup, providing you with the best possible prices for premium Chinese special oils.
              </p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-6">
                <i className="fa-solid fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-['Montserrat'] text-white">
                Quality Assurance
              </h3>
              <p className="text-white/80">
                Rigorous pre-shipment inspection and testing to ensure products meet international standards and your specific requirements.
              </p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-6">
                <i className="fa-solid fa-truck"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-['Montserrat'] text-white">
                Hassle-Free Logistics
              </h3>
              <p className="text-white/80">
                Complete management of export documentation, customs clearance, and shipping to your destination port worldwide.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/contact"
              className="inline-block bg-[#D4AF37] text-white px-8 py-3 rounded-sm text-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
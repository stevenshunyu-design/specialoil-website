import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      id: 1,
      title: t('home.slides.slide1.title'),
      subtitle: t('home.slides.slide1.subtitle'),
      ctaText: t('home.slides.cta', 'Explore Our Products'),
      ctaLink: "/products",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Bohai%20Bay%20offshore%20drilling%20platform%20silhouette%2C%20deep%20blue%20color%2C%20industrial%20cinematic%20style%2C%20high%20contrast&sign=e81f5a5b6e3ca6e1f132b9baed80513c"
    },
    {
      id: 2,
      title: t('home.slides.slide2.title'),
      subtitle: t('home.slides.slide2.subtitle'),
      ctaText: t('home.slides.cta', 'View Technical Specs'),
      ctaLink: "/products/finished-lubricants",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Golden%20lubricating%20oil%20pouring%20into%20machinery%20close%20up%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=e98dda1f40b359abeede5161ae03c5d4"
    },
    {
      id: 3,
      title: t('home.slides.slide3.title'),
      subtitle: t('home.slides.slide3.subtitle'),
      ctaText: t('home.slides.cta', 'Check Logistics'),
      ctaLink: "/logistics",
      imageUrl: "/iso-tanks-port.jpg?v=4"
    }
  ];

  const features = [
    {
      icon: "fa-certificate",
      title: t('home.features.quality.title'),
      description: t('home.features.quality.description')
    },
    {
      icon: "fa-globe",
      title: "50+ Countries",
      description: "Global export network"
    },
    {
      icon: "fa-shield-halved",
      title: t('home.features.standards.title'),
      description: t('home.features.standards.description')
    },
    {
      icon: "fa-truck-fast",
      title: t('home.features.logistics.title'),
      description: t('home.features.logistics.description')
    },
    {
      icon: "fa-headset",
      title: t('home.features.support.title', '24/7 Support'),
      description: t('home.features.support.description', 'Technical assistance')
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-white)]">
      {/* Hero Slider */}
      <div className="relative h-[90vh] overflow-hidden bg-[var(--primary-900)]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-900)]/90 via-[var(--primary-800)]/85 to-[var(--primary-950)]/95 z-10"></div>
            <img
              src={slide.imageUrl}
              alt={slide.title || "Industrial lubricants"}
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-white p-6">
              <div className="max-w-5xl text-center">
                <h1 className="font-display text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight leading-tight">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="font-body text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90 font-light leading-relaxed">
                    {slide.subtitle}
                  </p>
                )}
                <Link
                  to={slide.ctaLink}
                  className="inline-block bg-[var(--accent-600)] text-white px-8 py-4 rounded-sm text-base font-medium hover:bg-[var(--accent-700)] transition-all duration-300 tracking-wider uppercase"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider indicators */}
        <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[var(--accent-600)] w-16'
                  : 'bg-white/40 w-8 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust & Certifications - Horizontal Bar */}
      <section className="py-16 bg-[var(--primary-900)] text-white border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="text-[var(--accent-600)] text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h3 className="font-display font-semibold text-base mb-1 text-white">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-white/60 font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source Story Section - Asymmetric Layout */}
      <section className="py-24 bg-[var(--bg-light)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-[var(--accent-600)]/10 rounded-sm"></div>
              <img
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Bohai%20Bay%20Suizhong%2036-1%20oilfield%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=9f4c8c6ca66bbb1e614c3b21e28319c4"
                alt="Supply Chain Operations"
                className="relative w-full h-auto rounded-sm shadow-xl"
              />
            </div>
            <div className="lg:w-1/2">
              <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-4 block font-medium">
                Your Supply Chain Partner
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-[var(--text-dark)] leading-tight">
                Your Trusted Gateway to China's Specialty Oil Supply Chain
              </h2>
              <p className="font-body text-lg text-[var(--text-body)] mb-6 leading-relaxed">
                As a professional supply chain service platform, we specialize in connecting international buyers with leading Chinese manufacturers of specialty oils—including transformer oil, white oil, rubber oil, and other refined oil products.
              </p>
              <p className="font-body text-lg text-[var(--text-body)] mb-8 leading-relaxed">
                We provide end-to-end solutions designed to streamline cross-border procurement. Our services cover the entire process: sourcing coordination, quality assurance, logistics, port consolidation, and export customs clearance. With a dedicated team and industry expertise, we ensure competitive pricing, reliable supply, and seamless transaction execution.
              </p>
              <Link
                to="/about"
                className="inline-block bg-[var(--primary-900)] text-white px-8 py-4 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 tracking-wider uppercase text-sm"
              >
                Learn About Our Supply Chain
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories - Clean Card Design */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
              Product Portfolio
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-[var(--text-dark)]">
              China's Special Oil Products
            </h2>
            <p className="font-body text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              We offer a comprehensive range of Chinese special oils that meet international standards and are exported to industrial clients worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="bg-[var(--bg-light)] overflow-hidden transition-all duration-300 hover:shadow-xl group">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-900)]/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=High%20voltage%20substation%2C%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=e71969a158b69062605a8d012d4e2a1f"
                  alt="Transformer Oil"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[var(--accent-600)] text-xs uppercase tracking-wider font-medium">
                    SpecVolt™ Series
                  </span>
                  <span className="bg-[var(--primary-900)] text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
                    ASTM D3487
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--text-dark)]">
                  Transformer Oil
                </h3>
                <p className="font-body text-[var(--text-body)] mb-6 leading-relaxed">
                  Premium naphthenic transformer oils with excellent dielectric properties and low sulfur content.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Zero Corrosive Sulfur', 'Arctic Grade', 'High Dielectric'].map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 bg-[var(--primary-100)] text-[var(--primary-700)] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/products/transformer-oil"
                  className="inline-block bg-[var(--primary-900)] text-white px-6 py-3 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 w-full text-center uppercase text-sm tracking-wider"
                >
                  View Product
                </Link>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-[var(--bg-light)] overflow-hidden transition-all duration-300 hover:shadow-xl group">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-900)]/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rubber%20process%20oil%2C%20black%20tire%20with%20golden%20oil%2C%20industrial%20cinematic%20style&sign=bb0bd22e0f3ed8a2ffda720d447e836d"
                  alt="Rubber Process Oil"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[var(--accent-600)] text-xs uppercase tracking-wider font-medium">
                    SpecFlex™ Series
                  </span>
                  <span className="bg-[var(--primary-900)] text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
                    EU REACH
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--text-dark)]">
                  Rubber Process Oil
                </h3>
                <p className="font-body text-[var(--text-body)] mb-6 leading-relaxed">
                  High solvency naphthenic oils for rubber compounding with low PAH content.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Cn% > 35%', 'Low PAHs', 'Tire Manufacturing'].map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 bg-[var(--primary-100)] text-[var(--primary-700)] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/products/rubber-process-oil"
                  className="inline-block bg-[var(--primary-900)] text-white px-6 py-3 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 w-full text-center uppercase text-sm tracking-wider"
                >
                  View Product
                </Link>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-[var(--bg-light)] overflow-hidden transition-all duration-300 hover:shadow-xl group">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-900)]/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Hydraulic%20system%2C%20industrial%20equipment%2C%20lubricant%2C%20industrial%20cinematic%20style&sign=33609a34b59d1fb5fa3876bebfae685e"
                  alt="Hydraulic Oil"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[var(--accent-600)] text-xs uppercase tracking-wider font-medium">
                    SpecLube™ Series
                  </span>
                  <span className="bg-[var(--primary-900)] text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
                    DIN 51524
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--text-dark)]">
                  Hydraulic Oil
                </h3>
                <p className="font-body text-[var(--text-body)] mb-6 leading-relaxed">
                  High-performance anti-wear hydraulic oils for industrial applications.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['High Pressure', 'Anti-Wear', 'Wide Temp Range'].map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 bg-[var(--primary-100)] text-[var(--primary-700)] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/products/finished-lubricants"
                  className="inline-block bg-[var(--primary-900)] text-white px-6 py-3 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 w-full text-center uppercase text-sm tracking-wider"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Benefits - Dark Section */}
      <section className="py-24 bg-[var(--primary-900)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent-600)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--accent-600)] rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
              Why Choose Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-white">
              Partner with Confidence
            </h2>
            <p className="font-body text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Experience the advantages of working with a dedicated Chinese special oil supply chain platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-sm border border-white/10 text-center transition-all duration-300 hover:border-[var(--accent-600)] hover:bg-white/10">
              <div className="text-[var(--accent-600)] text-5xl mb-6">
                <i className="fa-solid fa-tags"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-4 text-white">
                Competitive Pricing
              </h3>
              <p className="font-body text-white/70 leading-relaxed">
                Direct factory access without middlemen markup, providing you with the best possible prices for premium Chinese special oils.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-sm border border-white/10 text-center transition-all duration-300 hover:border-[var(--accent-600)] hover:bg-white/10">
              <div className="text-[var(--accent-600)] text-5xl mb-6">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-4 text-white">
                Quality Assurance
              </h3>
              <p className="font-body text-white/70 leading-relaxed">
                Rigorous pre-shipment inspection and testing to ensure products meet international standards and your specific requirements.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-sm border border-white/10 text-center transition-all duration-300 hover:border-[var(--accent-600)] hover:bg-white/10">
              <div className="text-[var(--accent-600)] text-5xl mb-6">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-4 text-white">
                Hassle-Free Logistics
              </h3>
              <p className="font-body text-white/70 leading-relaxed">
                Complete management of export documentation, customs clearance, and shipping to your destination port worldwide.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/contact"
              className="inline-block bg-[var(--accent-600)] text-white px-10 py-4 rounded-sm font-medium hover:bg-[var(--accent-700)] transition-all duration-300 tracking-wider uppercase text-sm"
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
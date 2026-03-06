import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const productCategories = [
    {
      id: 1,
      name: "Transformer Oil",
      brand: "SpecVolt™ Series",
      description: "Premium naphthenic transformer oils from China with excellent dielectric properties and low sulfur content, ideal for high-voltage applications.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=High%20voltage%20substation%20night%20scene%2C%20transformer%20oil%20application%2C%20industrial%20cinematic%20style&sign=19d76e3848b30fa9653f475f2f81548c",
      features: ["Zero Corrosive Sulfur", "Arctic Reliability (-45°C)", "High Dielectric Strength", "ASTM D3487 Compliant"],
      link: "/products/transformer-oil"
    },
    {
      id: 2,
      name: "Rubber Process Oil",
      brand: "SpecFlex™ Series",
      description: "High solvency naphthenic rubber process oils from China with low PAH content, perfect for tire manufacturing and rubber compounding.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Black%20tire%20macro%20texture%20with%20golden%20oil%20flow%2C%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=c976f81101f6ee1607c0bd9d1d6ae29c",
      features: ["Cn% > 35%", "EU REACH Compliant", "Low PAHs", "Excellent Compatibility"],
      link: "/products/rubber-process-oil"
    },
    {
      id: 3,
      name: "Hydraulic & Industrial Oils",
      brand: "SpecLube™ Series",
      description: "High-performance hydraulic oils and industrial lubricants from China, engineered for extreme conditions and heavy-duty applications.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Hydraulic%20system%20close%20up%2C%20finished%20lubricants%2C%20industrial%20cinematic%20style&sign=caf8afa1997dfaf80a075b52078cd58a",
      features: ["ISO 68/46/32 Grades", "DIN 51524 Compliant", "Anti-Wear Protection", "Wide Temperature Range"],
      link: "/products/finished-lubricants"
    }
  ];

  const chinaAdvantages = [
    { icon: "fa-tags", title: "Competitive Pricing" },
    { icon: "fa-microchip", title: "Advanced Technology" },
    { icon: "fa-users", title: "Skilled Workforce" },
    { icon: "fa-network-wired", title: "Complete Supply Chain" }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-white)] pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="relative h-[500px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-900)]/90 via-[var(--primary-800)]/80 to-transparent z-10"></div>
            <img
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Chinese%20special%20oil%20product%20range%2C%20factory%20exterior%2C%20industrial%20cinematic%20style&sign=8dc2b0f7876a82fe71cd8f4c18f087ab"
              alt="China Special Oil Product Range"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center p-6">
              <div className="max-w-3xl">
                <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-4 block font-medium">
                  Product Portfolio
                </span>
                <h1 className="font-display text-5xl md:text-6xl font-semibold mb-6 text-white leading-tight">
                  China's Premium Special Oil Products
                </h1>
                <p className="font-body text-lg text-white/80 leading-relaxed max-w-2xl">
                  Discover our comprehensive range of high-quality Chinese special oils that meet international standards and serve industrial clients worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Chinese Special Oils Banner */}
        <section className="mb-20 bg-[var(--primary-900)] text-white p-12 rounded-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-600)] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Why Source Special Oils from China?
              </h2>
              <p className="font-body text-white/80 mb-8 leading-relaxed">
                China has emerged as a leading producer of high-quality special oils with advanced refining technology and competitive pricing.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {chinaAdvantages.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-[var(--accent-600)] rounded-sm mr-4">
                      <i className={`fa-solid ${item.icon} text-white`}></i>
                    </div>
                    <span className="font-body font-medium text-white">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <Link
                to="/about"
                className="inline-block bg-white text-[var(--primary-900)] px-8 py-4 rounded-sm font-medium hover:bg-[var(--primary-100)] transition-all duration-300 text-center uppercase tracking-wider text-sm"
              >
                Learn About China's Advantages
              </Link>
              <Link
                to="/contact"
                className="inline-block bg-[var(--accent-600)] text-white px-8 py-4 rounded-sm font-medium hover:bg-[var(--accent-700)] transition-all duration-300 text-center uppercase tracking-wider text-sm"
              >
                Get Competitive Quote
              </Link>
            </div>
          </div>
        </section>
        
        {/* Product Categories */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
              Our Products
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-[var(--text-dark)]">
              China Special Oil Product Range
            </h2>
            <p className="font-body text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              Comprehensive solutions for industrial applications, manufactured to meet global standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category) => (
              <div
                key={category.id}
                className="bg-[var(--bg-light)] overflow-hidden transition-all duration-300 hover:shadow-xl group"
              >
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-900)]/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="font-mono text-[var(--accent-600)] text-xs uppercase tracking-wider mb-3 font-medium">
                    {category.brand}
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--text-dark)]">
                    {category.name}
                  </h3>
                  <p className="font-body text-[var(--text-body)] mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-body font-semibold text-[var(--text-dark)] mb-4 uppercase text-xs tracking-wider">
                      Key Features:
                    </h4>
                    <ul className="space-y-3">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="flex items-center justify-center w-5 h-5 bg-[var(--accent-600)] rounded-sm mr-3 flex-shrink-0">
                            <i className="fa-solid fa-check text-white text-xs"></i>
                          </div>
                          <span className="font-body text-[var(--text-body)] text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={category.link}
                    className="inline-block bg-[var(--primary-900)] text-white px-6 py-4 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 w-full text-center uppercase tracking-wider text-sm"
                  >
                    View Specifications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Standards & Certifications */}
        <section className="bg-[var(--bg-light)] p-12 rounded-sm mb-20">
          <div className="text-center mb-16">
            <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
              Compliance & Standards
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-[var(--text-dark)]">
              International Standards & Compliance
            </h2>

            <p className="font-body text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              All our Chinese special oil products meet or exceed international standards, ensuring quality and reliability for your industrial applications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { title: "ISO 9001", desc: "Quality Management System" },
              { title: "ISO 14001", desc: "Environmental Management System" },
              { title: "EU REACH", desc: "Low PAH Content Compliance" },
              { title: "ASTM / DIN", desc: "International Product Standards" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-sm text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-[var(--accent-600)] text-5xl mb-4">
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-[var(--text-dark)]">
                  {item.title}
                </h3>
                <p className="font-body text-[var(--text-muted)] text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Production Capacity", value: "200,000+", unit: "Metric Tons Annually", desc: "Our partner factories in China have extensive production capacity to meet large volume orders." },
              { title: "Quality Control", value: "100%", unit: "Pre-Shipment Inspection", desc: "All products undergo rigorous testing before shipment to ensure compliance with specifications." },
              { title: "Export Experience", value: "50+", unit: "Countries Exported", desc: "Extensive experience in exporting Chinese special oils to industrial clients worldwide." }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-display text-xl font-semibold mb-6 text-[var(--text-dark)]">
                  {item.title}
                </h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="font-mono text-5xl font-bold text-[var(--accent-600)] mb-2">{item.value}</div>
                    <div className="font-body text-[var(--text-muted)]">{item.unit}</div>
                  </div>
                </div>
                <p className="font-body text-[var(--text-muted)] text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Product Brochure CTA */}
        <section className="text-center mb-16 bg-white p-12 border border-[var(--primary-200)] rounded-sm">
          <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
            Resources
          </span>
          <h2 className="font-display text-3xl font-semibold mb-4 text-[var(--text-dark)]">
            Download Our Chinese Special Oil Guide
          </h2>
          <p className="font-body text-[var(--text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Get detailed information about specifications, applications, and benefits of Chinese special oils for your industry.
          </p>
          <a
            href="#"
            className="inline-block bg-[var(--primary-900)] text-white px-10 py-4 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 uppercase tracking-wider text-sm"
          >
            <i className="fa-solid fa-download mr-2"></i> Download Guide (PDF)
          </a>
        </section>

        {/* Inquiry CTA */}
        <section className="bg-[var(--accent-600)] text-white p-12 rounded-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Interested in Chinese Special Oils?
              </h2>
              <p className="font-body text-white/90 leading-relaxed">
                Contact our team for personalized recommendations and competitive pricing.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-block bg-white text-[var(--primary-900)] px-10 py-4 rounded-sm font-medium hover:bg-[var(--primary-100)] transition-all duration-300 uppercase tracking-wider text-sm whitespace-nowrap"
            >
              Request a Free Quote
            </Link>
          </div>
        </section>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex z-40">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[var(--primary-900)] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span className="font-medium text-sm">Call Us</span>
        </a>
        <a href="https://wa.me/8613793280176" className="flex-1 py-4 bg-[var(--accent-600)] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span className="font-medium text-sm">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Products;
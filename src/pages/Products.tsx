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
      features: ["Zero Corrosive Sulfur", "Arctic Reliability (-45°C)", "High Dielectric Strength", "ASTM D3487 Compliant"],link: "/products/transformer-oil"
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
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Chinese%20special%20oil%20product%20range%2C%20factory%20exterior%2C%20industrial%20cinematic%20style&sign=8dc2b0f7876a82fe71cd8f4c18f087ab" 
              alt="China Special Oil Product Range" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight text-center px-4">
                China's Premium Special Oil Products
              </h1>
            </div>
          </div>
        </section>
        
        {/* Why Choose Chinese Special Oils Banner */}
        <section className="mb-16 bg-[#003366] text-white p-8 rounded-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-['Montserrat']">
                Why Source Special Oils from China?
              </h2>
              <p className="text-white/80 mb-4">
                China has emerged as a leading producer of high-quality special oils with advanced refining technology and competitive pricing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3 text-xl"></i>
                  <span>Competitive Pricing</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3 text-xl"></i>
                  <span>Advanced Technology</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3 text-xl"></i>
                  <span>Skilled Workforce</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3 text-xl"></i>
                  <span>Complete Supply Chain</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/about"
                className="inline-block bg-white text-[#003366] px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all text-center"
              >
                Learn About China's优势
              </Link>
              <Link 
                to="/contact"
                className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all text-center"
              >
                Get Competitive Quote
              </Link>
            </div>
          </div>
        </section>
        
        {/* Product Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#003366] font-['Montserrat']">
            China Special Oil Product Range
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-[#F4F6F9] rounded-sm overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="h-60 overflow-hidden">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-[#D4AF37] font-semibold mb-2">
                    {category.brand}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {category.name}
                  </h3>
                  <p className="text-[#333333] mb-6">
                    {category.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#222222] mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link 
                    to={category.link}
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all w-full text-center"
                  >
                    View Specifications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Product Standards & Certifications */}
        <section className="bg-[#F4F6F9] p-8 rounded-sm mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#003366] font-['Montserrat']">
            International Standards & Compliance
          </h2>
          
          <p className="text-[#333333] mb-8 text-center max-w-3xl mx-auto">
            All our Chinese special oil products meet or exceed international standards, ensuring quality and reliability for your industrial applications.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                ISO 9001
              </h3>
              <p className="text-[#333333] text-sm">
                Quality Management System
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                ISO 14001
              </h3>
              <p className="text-[#333333] text-sm">
                Environmental Management System
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                EU REACH
              </h3>
              <p className="text-[#333333] text-sm">
                Low PAH Content Compliance
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                ASTM / DIN
              </h3>
              <p className="text-[#333333] text-sm">
                International Product Standards
              </p>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                Production Capacity
              </h3>
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37]">200,000+</div>
                  <div className="text-[#333333]">Metric Tons Annually</div>
                </div>
              </div>
              <p className="text-[#333333] text-center">
                Our partner factories in China have extensive production capacity to meet large volume orders.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                Quality Control
              </h3>
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37]">100%</div>
                  <div className="text-[#333333]">Pre-Shipment Inspection</div>
                </div>
              </div>
              <p className="text-[#333333] text-center">
                All products undergo rigorous testing before shipment to ensure compliance with specifications.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                Export Experience
              </h3>
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37]">50+</div>
                  <div className="text-[#333333]">Countries Exported</div>
                </div>
              </div>
              <p className="text-[#333333] text-center">
                Extensive experience in exporting Chinese special oils to industrial clients worldwide.
              </p>
            </div>
          </div>
        </section>
        
        {/* Product Brochure CTA */}
        <section className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
            Download Our Chinese Special Oil Guide
          </h2>
          <p className="text-[#333333] mb-6 max-w-2xl mx-auto">
            Get detailed information about specifications, applications, and benefits of Chinese special oils for your industry.
          </p>
          <a 
            href="#" 
            className="inline-block bg-white border-2 border-[#003366] text-[#003366] px-8 py-3 rounded-sm font-semibold hover:bg-[#003366] hover:text-white transition-all"
          >
            <i className="fa-solid fa-download mr-2"></i> Download Guide (PDF)
          </a>
        </section>
        
        {/* Inquiry CTA */}
        <section className="bg-[#D4AF37] text-white p-8 rounded-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-['Montserrat']">
                Interested in Chinese Special Oils?
              </h2>
              <p className="text-white/80">
                Contact our team for personalized recommendations and competitive pricing.
              </p>
            </div>
            <Link 
              to="/contact"
              className="inline-block bg-white text-[#003366] px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Request a Free Quote
            </Link>
          </div>
        </section>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613800138000" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>Call Us</span>
        </a>
        <a href="https://wa.me/8613800138000" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Products;
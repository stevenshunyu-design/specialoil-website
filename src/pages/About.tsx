import React from 'react';
import { useState } from 'react';

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=China%20special%20oil%20supply%20chain%20logistics%2C%20container%20terminal%2C%20industrial%20cinematic%20style%2C%20high%20contrast&sign=20fc27cc019828efd55ec3d6241a91db" 
              alt="China Special Oil Supply Chain" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight">
                China Special Oil Supply Chain
              </h1>
            </div>
          </div>
        </section>
        
        {/* Navigation Tabs */}
        <div className="mb-12 flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'story' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('story')}
          >
            Our Story
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'supply-chain' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('supply-chain')}
          >
            Supply Chain
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'quality' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('quality')}
          >
            Quality Control
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'global' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('global')}
          >
            Global Markets
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm">
          {activeTab === 'story' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                 <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  Connecting China's Premium Special Oils to Global Markets
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  Founded in 2025, we have quickly established ourselves as a dedicated supply chain platform with a clear mission: to provide the world with access to premium quality special oils from China's most reputable manufacturers.
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  Our core expertise lies in sourcing and delivering high-quality Chinese special oils, particularly those derived from the premium naphthenic crude of Bohai Bay's Suizhong 36-1 oilfield, to industrial clients across the globe.
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  With a team of industry professionals who bring extensive experience in the oil and gas sector, we've built strong partnerships with manufacturers to ensure our customers receive exceptional products at competitive prices, every time.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">15+</div>
                    <div className="text-[#333333]">Years of Experience</div>
                  </div>
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">50+</div>
                    <div className="text-[#333333]">Countries Served</div>
                  </div>
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">10k+</div>
                    <div className="text-[#333333]">Successful Shipments</div>
                  </div>
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">20+</div>
                    <div className="text-[#333333]">Partner Factories</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=China%20oil%20refinery%20with%20modern%20technology%2C%20industrial%20cinematic%20style&sign=24373ebd131ea32d9f5b84c0eaabeca9" 
                  alt="Modern Chinese refinery" 
                  className="w-full h-auto rounded-sm mb-6"
                />
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=International%20business%20team%20working%20together%2C%20industrial%20cinematic%20style&sign=292d3f52b092f6a0b42599148e5bbfe9" 
                  alt="Our international team" 
                  className="w-full h-auto rounded-sm"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'supply-chain' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Bohai%20Bay%20offshore%20oil%20platform%2C%20Suizhong%2036-1%20oilfield%2C%20industrial%20cinematic%20style&sign=89d170a2b1d9901f57812c5b2223421d" 
                  alt="Bohai Bay Source" 
                  className="w-full h-auto rounded-sm mb-6"
                />
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Supply%20chain%20logistics%20process%20flow%20chart%2C%20industrial%20style&sign=61f21c3313e4658415c053fa1390019a" 
                  alt="Supply Chain Flow" 
                  className="w-full h-auto rounded-sm"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  Our Complete Supply Chain Solution
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  We offer a seamless supply chain solution that covers every step from sourcing to delivery, ensuring our customers receive high-quality Chinese special oils efficiently and reliably.
                </p>
                
                <div className="relative pl-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#D4AF37]">
                  <div className="mb-8 relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">1</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">Sourcing & Selection</h3>
                  <p className="text-[#333333]">Direct access to premium special oil manufacturers in China, with rigorous supplier qualification processes.</p>
                  
                  <div className="mb-8 relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">2</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">Quality Control</h3>
                  <p className="text-[#333333]">Comprehensive testing and inspection at multiple stages to ensure products meet international standards.</p>
                  
                  <div className="mb-8 relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">3</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">Documentation & Compliance</h3>
                  <p className="text-[#333333]">Complete handling of export documentation, customs clearance, and compliance with international trade regulations.</p>
                  
                  <div className="relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">4</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">Logistics & Delivery</h3>
                  <p className="text-[#333333]">Reliable shipping solutions to ports worldwide, with flexible options to meet your specific needs.</p>
                </div>
                
                <div className="mt-8">
                  <a 
                    href="/logistics" 
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Learn About Our Logistics
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'quality' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  Rigorous Quality Control
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  We understand that quality is paramount for industrial lubricants. Our comprehensive quality control system ensures that every product meets the highest international standards and your specific requirements.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-white p-6 rounded-sm">
                    <h3 className="text-xl font-semibold text-[#222222] mb-4 flex items-center">
                      <i className="fa-solid fa-flask text-[#D4AF37] mr-3"></i>
                      Laboratory Testing
                    </h3>
                    <p className="text-[#333333] mb-4">Our products undergo rigorous testing in ISO-certified laboratories to ensure they meet all technical specifications.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>Physical and chemical analysis</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>Performance testing under various conditions</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>Third-party verification available</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-sm">
                    <h3 className="text-xl font-semibold text-[#222222] mb-4 flex items-center">
                      <i className="fa-solid fa-industry text-[#D4AF37] mr-3"></i>
                      Supplier Audits
                    </h3>
                    <p className="text-[#333333] mb-4">We conduct regular audits of our partner factories to ensure consistent quality and compliance with our standards.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>Production process evaluation</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>Quality management system review</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i><span>Continuous improvement monitoring</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <a 
                  href="/quality" 
                  className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                >
                  View Detailed Quality Process
                </a>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Advanced%20laboratory%20for%20oil%20testing%2C%20industrial%20cinematic%20style&sign=dc5437f0d815b47d8c107804641683a8" 
                  alt="Quality Testing Lab" 
                  className="w-full h-auto rounded-sm mb-6"
                />
                <div className="bg-white p-6 rounded-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Certifications & Standards
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">ISO 9001</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">ISO 14001</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">EU REACH</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">ASTM Standards</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">DIN Standards</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">GB Standards</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'global' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Our Global Presence
              </h2>
              <p className="text-[#333333] mb-8 leading-relaxed">
                We have successfully delivered Chinese special oils to industrial customers in more than 50 countries worldwide. Our experience in international trade ensures smooth transactions and on-time deliveries.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-4xl mb-4">
                    <i className="fa-solid fa-map-marker-alt"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">Regional Distribution</h3>
                  <p className="text-[#333333]">Strategically located warehouses in key regions to ensure prompt delivery and local support.</p>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                   <div className="text-[#D4AF37] text-4xl mb-4">
                    <i className="fa-solid fa-language"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">Multilingual Support</h3>
                  <p className="text-[#333333]">Our team speaks English and Chinese to better serve our global customers.</p>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-4xl mb-4">
                    <i className="fa-solid fa-ship"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">Flexible Shipping</h3>
                  <p className="text-[#333333]">Various shipping options including FOB, CFR, CIF, and DDP to meet your specific requirements.</p>
                </div>
              </div>
              
              {/* Strategic Partners Section */}
              <div className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl p-8 mb-12">
                <h3 className="text-2xl font-bold mb-2 text-white font-['Montserrat']">
                  Strategic Partners
                </h3>
                <p className="text-white/80 mb-8">
                  We collaborate with China's leading special oil manufacturers to deliver premium quality products to global markets.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* PetroChina / CNPC */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-red-600 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-2xl font-bold">CNPC</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">PetroChina</h4>
                    <p className="text-sm text-gray-500 text-center">中国石油</p>
                  </div>
                  
                  {/* Sinopec */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-red-700 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl font-bold">Sinopec</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">Sinopec</h4>
                    <p className="text-sm text-gray-500 text-center">中国石化</p>
                  </div>
                  
                  {/* CNOOC */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-blue-600 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-2xl font-bold">CNOOC</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">CNOOC</h4>
                    <p className="text-sm text-gray-500 text-center">中国海油</p>
                  </div>
                  
                  {/* Yanchang Petroleum */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-yellow-600 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-lg font-bold">YCPC</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">Yanchang Petroleum</h4>
                    <p className="text-sm text-gray-500 text-center">延长石油</p>
                  </div>
                  
                  {/* Sinochem */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-blue-800 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-lg font-bold">Sinochem</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">Sinochem</h4>
                    <p className="text-sm text-gray-500 text-center">中化集团</p>
                  </div>
                  
                  {/* Hengli Petrochemical */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-orange-600 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-lg font-bold">Hengli</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">Hengli Petrochemical</h4>
                    <p className="text-sm text-gray-500 text-center">恒力石化</p>
                  </div>
                  
                  {/* Zhejiang Petroleum */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-teal-600 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-lg font-bold">ZPC</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">Zhejiang Petroleum</h4>
                    <p className="text-sm text-gray-500 text-center">浙江石化</p>
                  </div>
                  
                  {/* CICC */}
                  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center bg-green-700 rounded-full group-hover:scale-110 transition-transform">
                      <span className="text-white text-lg font-bold">CIMC</span>
                    </div>
                    <h4 className="font-bold text-[#003366] text-center">CIMC Enric</h4>
                    <p className="text-sm text-gray-500 text-center">中集安瑞科</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-white/60 text-sm">
                    * Partner logos represent our supply chain relationships. All partnerships are subject to formal agreements.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">Major Export Markets</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>Europe (Germany, Italy, France, Spain)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>North America (USA, Canada, Mexico)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>Middle East (Saudi Arabia, UAE, Qatar)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>Southeast Asia (Indonesia, Malaysia, Thailand)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>Africa (South Africa, Nigeria, Egypt)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>South America (Brazil, Argentina, Chile)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">Customer Testimonials</h3>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <div className="text-[#D4AF37] mb-2">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p className="text-[#333333] mb-3 italic">"The quality of Chinese special oils we received was exceptional, and the supply chain service made the entire process seamless."</p>
                      <div className="font-semibold">— European Manufacturing Company</div>
                    </div>
                    <div>
                      <div className="text-[#D4AF37] mb-2">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p className="text-[#333333] mb-3 italic">"We've been importing transformer oil from China through this platform for 5 years now. Consistent quality and reliable deliveries every time."</p>
                      <div className="font-semibold">— Middle Eastern Power Utility</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80 rounded-sm overflow-hidden">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=World%20map%20highlighting%20China%20export%20routes%2C%20industrial%20style&sign=ac7d91dd81e1fbe8a456ae4218c6cfed" 
                  alt="Global Export Map" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8612345678910" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>Contact Us</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default About;
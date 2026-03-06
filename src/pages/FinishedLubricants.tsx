import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const FinishedLubricants = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const productCategories = [
    {
      category: "Hydraulic Oils",
      description: "High-performance hydraulic oils engineered for extreme pressure applications and wide temperature ranges.",
      grades: [
        "L-HM (High Pressure)",
        "L-HV (Low Temperature)",
        "L-HS (Synthetic)"
      ],
      standard: "Meets DIN 51524"
    },
    {
      category: "Gear Oils",
      description: "Premium gear oils designed to protect against wear, scuffing and micropitting in industrial gear systems.",
      grades: [
        "L-CKD (Heavy Duty)",
        "L-CKE/P (Extreme Pressure)",
        "Synthetic Gear Oils"
      ],
      standard: "Meets DIN 51517"
    },
    {
      category: "Commercial Fleet",
      description: "High-performance engine oils for commercial vehicles and heavy-duty applications.",
      grades: [
        "Diesel Engine Oil (CJ-4/CH-4)",
        "Gasoline Engine Oil (API SN)",
        "Multi-Grade Engine Oils"
      ],
      standard: "Meets API Specifications"
    },
    {
      category: "Specialty Lubricants",
      description: "Specialized lubricants for unique industrial applications with specific performance requirements.",
      grades: [
        "Turbine Oil (L-TSA)",
        "Heat Transfer Oil (L-QD)",
        "Compressor Oils",
        "Food Grade Lubricants"
      ],
      standard: "Various Industry Standards"
    }
  ];
  
  const packagingOptions = [
    {
      type: "200L Steel Drum",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=200L%20steel%20drum%20of%20industrial%20lubricant%2C%20industrial%20cinematic%20style&sign=026ffe8d63c2e8c1d948516cf4cf33ea",
      description: "Heavy-duty steel drums with secure sealing for industrial applications"
    },
    {
      type: "1000L IBC Tank",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=1000L%20IBC%20tank%20of%20industrial%20lubricant%2C%20industrial%20cinematic%20style&sign=de533e25af1363e17d26dd460be7a97a",
      description: "Intermediate bulk containers for efficient storage and handling"
    },
    {
      type: "18L Plastic Bucket",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=18L%20plastic%20bucket%20of%20industrial%20lubricant%2C%20industrial%20cinematic%20style&sign=307f4e6b19403d8fa7fb793d6211d610",
      description: "Convenient plastic buckets for smaller applications and maintenance"
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
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Hydraulic%20system%20close%20up%2C%20high%20pressure%20industrial%20equipment%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=5d9c331728ef8a23af7149bf6f935db2" 
              alt="SpecLube Finished Lubricants" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  Premium Finished Lubricants
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                  SpecLube™ Series
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  Engineered for extreme conditions and maximum performance
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Product Tabs */}
        <div className="mb-12 flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'product-lineup' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('product-lineup')}
          >
            Product Lineup
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'hydraulic-oils' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('hydraulic-oils')}
          >
            Hydraulic Oils
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'packaging' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('packaging')}
          >
            Packaging
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'overview' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  Advanced Industrial Lubrication Solutions
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  SpecLube™ Finished Lubricants are premium formulated lubricants designed to provide exceptional protection and performance in the most demanding industrial applications.
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  Using our unique naphthenic base oils derived from the Suizhong 36-1 oilfield in Bohai Bay, combined with advanced additive technology, our lubricants deliver superior performance, extended equipment life, and reduced maintenance costs.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Key Performance Characteristics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-shield-alt"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Exceptional Wear Protection</h4>
                      <p className="text-sm text-[#333333]">Extends equipment life in high-load applications</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Wide Temperature Range</h4>
                      <p className="text-sm text-[#333333]">Performs from arctic to extreme heat conditions</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-tint-slash"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Water Resistance</h4>
                      <p className="text-sm text-[#333333]">Maintains performance in wet environments</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-high"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Oxidation Stability</h4>
                      <p className="text-sm text-[#333333]">Extended service life and reduced deposits</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold text-center hover:bg-opacity-90 transition-all"
                  >
                    Request a Quote
                  </Link>
                  <Link 
                    to="#"
                    className="inline-block bg-white border-2 border-[#003366] text-[#003366] px-6 py-3 rounded-sm font-semibold text-center hover:bg-[#003366] hover:text-white transition-all"
                  >
                    Download Product Guide
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Industrial%20machinery%20using%20hydraulic%20oil%2C%20industrial%20cinematic%20style&sign=3fdd4434e320978fa77073cc8051ad94" 
                    alt="Industrial Machinery" 
                    className="w-full h-auto rounded-sm"
                  />
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Lubricant%20testing%20in%20laboratory%2C%20industrial%20cinematic%20style&sign=d1290e1a5fc509de0b126e8d478482e7" 
                    alt="Lubricant Testing" 
                    className="w-full h-auto rounded-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'product-lineup' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Our Product Lineup
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                SpecLube™ offers a comprehensive range of high-performance lubricants designed to meet the specific needs of various industrial applications. Each product is formulated with our premium naphthenic base oils and advanced additive packages.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productCategories.map((category, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm">
                    <h3 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                      {category.category}
                    </h3>
                    <p className="text-[#333333] mb-4">
                      {category.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#222222] mb-2">Available Grades:</h4>
                      <ul className="space-y-2">
                        {category.grades.map((grade, idx) => (
                          <li key={idx} className="flex items-center">
                            <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                            <span>{grade}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-[#D4AF37] font-semibold">
                      {category.standard}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  to="/contact"
                  className="inline-block bg-[#003366] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                >
                  Contact Our Technical Team for Product Selection
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'hydraulic-oils' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  High-Performance Hydraulic Oils
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  Our hydraulic oils are specially formulated to provide exceptional protection and performance in modern high-pressure hydraulic systems operating under severe conditions.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-cog"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">SpecLube L-HM (High Pressure)</h3>
                      <p className="text-[#333333]">
                        Advanced anti-wear hydraulic oil designed for high-pressure systems operating at normal to elevated temperatures. Meets DIN 51524 Part 2 specifications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-temperature-low"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">SpecLube L-HV (Low Temperature)</h3>
                      <p className="text-[#333333]">
                        Premium hydraulic oil with excellent low-temperature fluidity for systems operating in cold climates. Provides superior protection at temperatures as low as -40°C.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">SpecLube L-HS (Synthetic)</h3>
                      <p className="text-[#333333]">
                        Full synthetic hydraulic oil for extreme applications requiring maximum protection against wear, oxidation, and thermal degradation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Extended pump and component life</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Improved system efficiency and energy savings</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Reduced maintenance costs and downtime</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Excellent filterability and system cleanliness</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Compatibility with seal materials</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Technical Specifications
                  </h3>
                  
                  {/* Table with horizontal scroll for mobile */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#F4F6F9]">
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">Property</th>
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">L-HM 32</th>
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">L-HM 46</th>
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">L-HV 46</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">Viscosity @40°C (cSt)</td>
                          <td className="p-3 border-b border-gray-200 text-sm">32</td>
                          <td className="p-3 border-b border-gray-200 text-sm">46</td>
                          <td className="p-3 border-b border-gray-200 text-sm">46</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">Viscosity Index</td>
                          <td className="p-3 border-b border-gray-200 text-sm">95</td>
                          <td className="p-3 border-b border-gray-200 text-sm">95</td>
                          <td className="p-3 border-b border-gray-200 text-sm">140</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">Pour Point (°C)</td>
                          <td className="p-3 border-b border-gray-200 text-sm">-24</td>
                          <td className="p-3 border-b border-gray-200 text-sm">-24</td>
                          <td className="p-3 border-b border-gray-200 text-sm">-40</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">Flash Point (°C)</td>
                          <td className="p-3 border-b border-gray-200 text-sm">220</td>
                          <td className="p-3 border-b border-gray-200 text-sm">225</td>
                          <td className="p-3 border-b border-gray-200 text-sm">230</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 text-sm">Anti-Wear (4-Ball, mm)</td>
                          <td className="p-3 text-sm">&lt; 0.5</td>
                          <td className="p-3 text-sm">&lt; 0.5</td>
                          <td className="p-3 text-sm">&lt; 0.4</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Recommended Applications
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-industry"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Industrial Hydraulics</h4>
                        <p className="text-[#333333]">Injection molding machines, presses, machine tools, and other industrial equipment</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-truck"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Mobile Equipment</h4>
                        <p className="text-[#333333]">Construction machinery, agricultural equipment, and material handling systems</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-water"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Marine Applications</h4>
                        <p className="text-[#333333]">Hydraulic systems on ships and offshore platforms</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Cold Climate Operations</h4>
                        <p className="text-[#333333]">Refrigeration systems and outdoor equipment in cold regions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Request a Product Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'packaging' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Packaging & Delivery
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                SpecLube™ Finished Lubricants are available in a comprehensive range of packaging options to meet the specific needs of your operation, from small maintenance applications to large-scale industrial use.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {packagingOptions.map((option, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm text-center">
                    <div className="h-48 mb-4 flex items-center justify-center">
                      <img 
                        src={option.imageUrl} 
                        alt={option.type} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                      {option.type}
                    </h3>
                    <p className="text-[#333333]">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Bulk Delivery Options
                </h3>
                <p className="text-[#333333] mb-6">
                  For large volume requirements, we offer efficient bulk delivery options to minimize packaging waste and reduce costs:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-tanker"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Tanker Trucks</h4>
                      <p className="text-[#333333]">Bulk road transport for deliveries within 500km of our facilities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-ship"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">ISO Tank Containers</h4>
                      <p className="text-[#333333]">26,000L stainless steel tanks for international shipping</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/logistics"
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Learn More About Our Logistics
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#003366] font-['Montserrat']">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Transformer%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=824699da089ce9e551d24ae9c46f9496" 
                alt="Transformer Oil" 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  SpecVolt™ Series
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  Transformer Oil
                </h3>
                <p className="text-[#333333] mb-4">
                  Premium naphthenic transformer oils for high-voltage applications.
                </p>
                <Link 
                  to="/products/transformer-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  View Product <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Rubber%20process%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=22da0e2e71da5f920708c7ab5d2e20f4" 
                alt="Rubber Process Oil" 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  SpecFlex™ Series
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  Rubber Process Oil
                </h3>
                <p className="text-[#333333] mb-4">
                  High solvency naphthenic oils for rubber compounding.
                </p>
                <Link 
                  to="/products/rubber-process-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  View Product <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>
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

export default FinishedLubricants;
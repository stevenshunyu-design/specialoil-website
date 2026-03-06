import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const TransformerOil = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const productGrades = [
    {
      grade: "SpecVolt I-20X",
      viscosity: "10-12 cSt",
      pourPoint: "-22°C",
      dielectricStrength: ">70kV"
    },
    {
      grade: "SpecVolt I-30X",
      viscosity: "9-11 cSt",
      pourPoint: "-30°C",
      dielectricStrength: ">70kV"
    },
    {
      grade: "SpecVolt I-40X",
      viscosity: "<12 cSt",
      pourPoint: "-45°C",
      dielectricStrength: ">70kV"
    }
  ];
  
  const applications = [
    {
      title: "High-Voltage Transformers",
      description: "Ideal for power generation and transmission transformers operating under extreme conditions.",
      icon: "fa-bolt"
    },
    {
      title: "Distribution Transformers",
      description: "Provides excellent protection for medium and low voltage distribution networks.",
      icon: "fa-network-wired"
    },
    {
      title: "Instrument Transformers",
      description: "Ensures reliable performance for current and voltage transformers in metering systems.",
      icon: "fa-tachometer-alt"
    },
    {
      title: "Switchgear Equipment",
      description: "Offers superior insulation and cooling properties for circuit breakers and switchgear.",
      icon: "fa-plug"
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
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=High%20voltage%20substation%20night%20scene%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=9fc6f95b6469c7480fa036faaa25c0e3" 
              alt="SpecVolt Transformer Oil" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  Premium Transformer Oil
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                  SpecVolt™ Series
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  Engineered for the most demanding high-voltage applications
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
              activeTab === 'specifications' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'applications' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'benefits' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('benefits')}
          >
            Benefits
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
                  Superior Transformer Protection
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  SpecVolt™ Transformer Oils are premium naphthenic-based lubricants specifically designed to provide exceptional insulation, cooling, and protection for high-voltage transformers and electrical equipment.
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">Derived from the unique Suizhong 36-1 oilfield in Bohai Bay, our transformer oils offer naturally low sulfur content and superior dielectric properties, ensuring reliable performance even in the most demanding conditions.
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
                      <h4 className="font-semibold text-[#222222] mb-1">Zero Corrosive Sulfur</h4>
                      <p className="text-sm text-[#333333]">Prevents copper corrosion in transformers</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Arctic Reliability</h4>
                      <p className="text-sm text-[#333333]">Performs down to -45°C</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-tint-slash"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Low Moisture Content</h4>
                      <p className="text-sm text-[#333333]">Enhanced dielectric strength</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-high"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Thermal Stability</h4>
                      <p className="text-sm text-[#333333]">Resists oxidation at high temperatures</p>
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
                    Download Datasheet
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Transformer%20oil%20testing%20in%20laboratory%2C%20industrial%20cinematic%20style&sign=4fe00fe6345ebad04fdb9f93a78889c1" 
                    alt="Transformer Oil Testing" 
                    className="w-full h-auto rounded-sm"
                  />
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Transformer%20oil%20being%20poured%20into%20equipment%2C%20industrial%20cinematic%20style&sign=2cf8c4f43697c955f422b4156d5d80ad" 
                    alt="Transformer Oil Application" 
                    className="w-full h-auto rounded-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Product Specifications
              </h2>
              
              <div className="mb-8">
                <p className="text-[#333333] mb-6 leading-relaxed">
                  SpecVolt™ Transformer Oils are available in three premium grades, each designed to meet specific application requirements and operating conditions. All grades meet or exceed international standards for transformer oils.
                </p>
                
                {/* Table with horizontal scroll for mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#003366] text-white">
                        <th className="p-4 text-left font-semibold">Product Grade</th>
                        <th className="p-4 text-left font-semibold">Viscosity (40°C)</th>
                        <th className="p-4 text-left font-semibold">Pour Point</th>
                        <th className="p-4 text-left font-semibold">Dielectric Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productGrades.map((grade, index) => (
                        <tr 
                          key={index} 
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]'} hover:bg-[#E8EBF2] transition-colors`}
                        >
                          <td className="p-4 border-t border-gray-200 font-semibold">{grade.grade}</td>
                          <td className="p-4 border-t border-gray-200">{grade.viscosity}</td>
                          <td className="p-4 border-t border-gray-200">{grade.pourPoint}</td>
                          <td className="p-4 border-t border-gray-200">{grade.dielectricStrength}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Technical Specifications
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Base Oil Type:</span>
                      <span className="font-semibold">Naphthenic</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Flash Point (COC):</span>
                      <span className="font-semibold">&gt; 140°C</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Fire Point (COC):</span>
                      <span className="font-semibold">&gt; 160°C</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Acidity (TAN):</span>
                      <span className="font-semibold">&lt; 0.03 mg KOH/g</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Interfacial Tension:</span>
                      <span className="font-semibold">&gt; 35 mN/m</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Resistivity (90°C):</span>
                      <span className="font-semibold">&gt; 10^12 Ω·m</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#333333]">Oxidation Stability:</span>
                      <span className="font-semibold">Excellent</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Compliance Standards
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>ASTM D3487</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>IEC 60296</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>BS 148</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>GB 2536</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>TOST compliant</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>PCB-free</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>RoHS compliant</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Applications
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                SpecVolt™ Transformer Oils are designed for use in a wide range of electrical equipment where excellent insulation properties, heat transfer capabilities, and oxidation resistance are critical requirements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {applications.map((app, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="text-[#D4AF37] text-3xl mb-4">
                      <i className={`fa-solid ${app.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                      {app.title}
                    </h3>
                    <p className="text-[#333333]">
                      {app.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Recommended Applications by Grade
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F4F6F9]">
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Product Grade</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Best Applications</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Operating Environment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">SpecVolt I-20X</td>
                        <td className="p-4 border-b border-gray-200">Distribution transformers, medium-voltage equipment</td>
                        <td className="p-4 border-b border-gray-200">Temperate climates, standard applications</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">SpecVolt I-30X</td>
                        <td className="p-4 border-b border-gray-200">Power transformers, industrial applications</td>
                        <td className="p-4 border-b border-gray-200">Cold climates, outdoor installations</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">SpecVolt I-40X</td>
                        <td className="p-4 border-b border-gray-200">High-voltage transformers, critical applications</td>
                        <td className="p-4 border-b border-gray-200">Extremely cold climates, Arctic regions</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'benefits' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  Performance Benefits
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  SpecVolt™ Transformer Oils provide numerous advantages over conventional transformer oils, helping to extend equipment life, improve reliability, and reduce maintenance costs.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">Enhanced Dielectric Strength</h3>
                      <p className="text-[#333333]">Superior insulation properties that maintain system integrity under high voltage stress.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">Extended Service Life</h3>
                      <p className="text-[#333333]">Excellent oxidation resistance that extends oil life and reduces maintenance frequency.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-temperature-high"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">Superior Heat Transfer</h3>
                      <p className="text-[#333333]">Optimized thermal properties that improve cooling efficiency and reduce hot spots.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-shield-alt"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">Equipment Protection</h3>
                      <p className="text-[#333333]">Zero corrosive sulfur formulation that prevents copper corrosion and sludge formation.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Economic Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Reduced maintenance costs due to extended oil life</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Lower equipment replacement costs through better protection</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Minimized downtime and improved system reliability</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Energy efficiency improvements through optimized cooling</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Long-term cost savings compared to conventional oils</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Environmental Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Naturally low sulfur content reduces environmental impact</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Extended oil life reduces waste generation and disposal needs</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Compliant with international environmental regulations</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Recyclable product that supports circular economy principles</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Contact Our Technical Team
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
                SpecVolt™ Transformer Oils are available in a variety of packaging options to meet your specific requirements, from small containers for maintenance to bulk deliveries for large installations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=18L%20plastic%20bucket%20of%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=425b53a5abb836f4f979453333728eeb" 
                      alt="18L Plastic Bucket" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    18L Plastic Bucket
                  </h3>
                  <p className="text-[#333333] mb-4">Ideal for small maintenance jobs and topping up</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    18L / 5 Gal
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=200L%20steel%20drum%20of%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=91f2503b281304a0e983fa78ccde3e5c" 
                      alt="200L Steel Drum" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    200L Steel Drum
                  </h3>
                  <p className="text-[#333333] mb-4">Perfect for medium-sized installations and projects</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    200L / 55 Gal
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=1000L%20IBC%20tank%20of%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=d855582dcb23ca9e4eff88b4eacd6130" 
                      alt="1000L IBC Tank" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    1000L IBC Tank
                  </h3>
                  <p className="text-[#333333] mb-4">For larger industrial applications and projects</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    1000L / 275 Gal
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Bulk Delivery Options
                </h3>
                <p className="text-[#333333] mb-6">
                  For large volume requirements, we offer bulk delivery options to minimize packaging waste and reduce costs:
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
                  High solvency naphthenic oils for rubber compounding and tire manufacturing.
                </p>
                <Link 
                  to="/products/rubber-process-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  View Product <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Hydraulic%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=d4a95ae5a02fd7828ee311313c00e1e8" 
                alt="Hydraulic Oil" 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  SpecLube™ Series
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  Hydraulic Oil
                </h3>
                <p className="text-[#333333] mb-4">
                  High-performance hydraulic oils for industrial and mobile equipment.
                </p>
                <Link 
                  to="/products/finished-lubricants"
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

export default TransformerOil;
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RubberProcessOil = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const productGrades = [
    {
      grade: "SpecFlex 4006",
      application: "EPDM & Shoe Soles",
      solvency: "Cn% > 35%",
      viscosity: "60-70 cSt"
    },
    {
      grade: "SpecFlex 4010",
      application: "High-performance Tires",
      solvency: "Cn% > 35%",
      viscosity: "90-110 cSt"
    },
    {
      grade: "SpecFlex 4016",
      application: "Conveyor Belts",
      solvency: "Cn% > 35%",
      viscosity: "150-170 cSt"
    }
  ];
  
  const benefits = [
    {
      title: "Enhanced Processing",
      description: "Improves rubber flow properties and mold filling during processing.",
      icon: "fa-industry"
    },
    {
      title: "Excellent Compatibility",
      description: "Compatible with natural rubber and various synthetic rubber types.",
      icon: "fa-puzzle-piece"
    },
    {
      title: "Improved Flexibility",
      description: "Enhances the flexibility and low-temperature properties of rubber products.",
      icon: "fa-expand-alt"
    },
    {
      title: "Color Stability",
      description: "Minimal impact on the color of finished rubber products.",
      icon: "fa-palette"
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
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Black%20tire%20macro%20texture%20with%20golden%20oil%20flow%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=3da3c0377dc034ae185014d8a72153f8" 
              alt="SpecFlex Rubber Process Oil" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  Premium Rubber Process Oil
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                  SpecFlex™ Series
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  Engineered for superior rubber processing and end-product performance
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
                  Superior Rubber Processing Solutions
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  SpecFlex™ Rubber Process Oils are premium naphthenic-based oils specifically designed to enhance the processing and performance of rubber compounds.
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  Derived from the unique Suizhong 36-1 oilfield in Bohai Bay, our rubber process oils offer naturally high solvency (Cn% {'>'} 35%) and excellent compatibility with various rubber types, making them ideal for demanding applications.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Key Performance Characteristics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-flask"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">High Solvency</h4>
                      <p className="text-sm text-[#333333]">Cn% {'>'} 35% for excellent rubber penetration</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-certificate"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">EU REACH Compliant</h4>
                      <p className="text-sm text-[#333333]">Low PAHs content for regulatory compliance</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Low Pour Point</h4>
                      <p className="text-sm text-[#333333]">Excellent cold temperature performance</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-shield-alt"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">Oxidation Stability</h4>
                      <p className="text-sm text-[#333333]">Resists degradation during processing</p>
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
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rubber%20processing%20plant%20interior%2C%20industrial%20cinematic%20style&sign=4bc156e85f82f0f7cdc6ff8b452a4e06" 
                    alt="Rubber Processing Plant" 
                    className="w-full h-auto rounded-sm"
                  />
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rubber%20compound%20testing%20in%20laboratory%2C%20industrial%20cinematic%20style&sign=336267effe37f95f6b355a884b288458" 
                    alt="Rubber Compound Testing" 
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
                  SpecFlex™ Rubber Process Oils are available in three carefully formulated grades to meet the specific requirements of different rubber applications, from shoe soles to high-performance tires.
                </p>
                
                {/* Table with horizontal scroll for mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#003366] text-white">
                        <th className="p-4 text-left font-semibold">Product Grade</th>
                        <th className="p-4 text-left font-semibold">Recommended Application</th>
                        <th className="p-4 text-left font-semibold">Solvency (Cn%)</th>
                        <th className="p-4 text-left font-semibold">Viscosity (40°C)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productGrades.map((grade, index) => (
                        <tr 
                          key={index} 
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]'} hover:bg-[#E8EBF2] transition-colors`}
                        >
                          <td className="p-4 border-t border-gray-200 font-semibold">{grade.grade}</td>
                          <td className="p-4 border-t border-gray-200">{grade.application}</td>
                          <td className="p-4 border-t border-gray-200">{grade.solvency}</td>
                          <td className="p-4 border-t border-gray-200">{grade.viscosity}</td>
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
                      <span className="font-semibold">&gt; 200°C</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Pour Point:</span>
                      <span className="font-semibold">&lt; -15°C</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Aniline Point:</span>
                      <span className="font-semibold">&lt; 80°C</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Sulfur Content:</span>
                      <span className="font-semibold">&lt; 0.5%</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">Color (Saybolt):</span>
                      <span className="font-semibold">+20 to +30</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#333333]">Density (15°C):</span>
                      <span className="font-semibold">0.91-0.95 g/cm³</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Regulatory Compliance
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>EU REACH Regulation (EC 1907/2006)</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Low PAHs (Polycyclic Aromatic Hydrocarbons)</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>RoHS Compliant</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>FDA 21 CFR 178.3620(a) for indirect food contact</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Non-carcinogenic (as per IARC guidelines)</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>ISO 9001 Quality Management System</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>ISO 14001 Environmental Management System</span>
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
                SpecFlex™ Rubber Process Oils are designed for use in a wide range of rubber products and applications, providing excellent processing properties and enhancing end-product performance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Shoe%20soles%20manufacturing%20process%2C%20industrial%20cinematic%20style&sign=608cb882763e05a544d7b81c14f04064" 
                      alt="Shoe Soles" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    Shoe Soles & Footwear
                  </h3>
                  <p className="text-[#333333] mb-4">
                    SpecFlex 4006 provides excellent flexibility and durability for shoe soles and other footwear components.
                  </p>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    Recommended Grade: SpecFlex 4006
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Tire%20manufacturing%20plant%2C%20industrial%20cinematic%20style&sign=59565037b7918f9173645ed6277b866f" 
                      alt="Tire Manufacturing" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    Tires & Automotive
                  </h3>
                  <p className="text-[#333333] mb-4">
                    SpecFlex 4010 offers superior performance for high-performance tires, providing excellent grip and wear resistance.
                  </p>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    Recommended Grade: SpecFlex 4010
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Conveyor%20belts%20in%20factory%2C%20industrial%20cinematic%20style&sign=3e89dbb35adb58ddfa95f988f4877a1e" 
                      alt="Conveyor Belts" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    Industrial Belts
                  </h3>
                  <p className="text-[#333333] mb-4">
                    SpecFlex 4016 is ideal for conveyor belts and industrial rubber products requiring high durability and strength.
                  </p>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    Recommended Grade: SpecFlex 4016
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Other Applications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-gasket"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Seals & Gaskets</h4>
                      <p className="text-[#333333]">Provides excellent flexibility and resistance to environmental factors</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-plug"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Cable & Wire Insulation</h4>
                      <p className="text-[#333333]">Enhances electrical properties and flexibility of rubber insulation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-car"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Automotive Components</h4>
                      <p className="text-[#333333]">Ideal for weather strips, hoses, and other automotive rubber parts</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-home"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Building & Construction</h4>
                      <p className="text-[#333333]">Suitable for gaskets, roofing membranes, and waterproofing materials</p>
                    </div>
                  </div>
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
                  SpecFlex™ Rubber Process Oils provide numerous advantages in rubber processing and end-product performance, helping manufacturers achieve better quality and efficiency.
                </p>
                
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <i className={`fa-solid ${benefit.icon}`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[#222222] mb-2">{benefit.title}</h3>
                        <p className="text-[#333333]">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Processing Advantages
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Improved dispersion of fillers and additives</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Reduced energy consumption during mixing</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Lower processing temperatures and cycle times</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Enhanced mold flow and cavity filling</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Reduced scrap rates and production waste</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    End-Product Improvements
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Enhanced flexibility and low-temperature properties</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Improved tensile strength and elongation</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Superior resistance to aging and environmental factors</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Consistent quality and performance batch-to-batch</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>Compliance with international regulatory standards</span>
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
                SpecFlex™ Rubber Process Oils are available in a variety of packaging options to meet your specific production requirements, from small batches to large-scale manufacturing needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=18L%20plastic%20bucket%20of%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=498e49068aa8b9d3e17a3028bd8f8ff5" 
                      alt="18L Plastic Bucket" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    18L Plastic Bucket
                  </h3>
                  <p className="text-[#333333] mb-4">Perfect for small-batch production and testing</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    18L / 5 Gal
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=200L%20steel%20drum%20of%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=a16ddc357774afca14dfa168dd91d917" 
                      alt="200L Steel Drum" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    200L Steel Drum
                  </h3>
                  <p className="text-[#333333] mb-4">Ideal for medium-sized manufacturing operations</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    200L / 55 Gal
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=1000L%20IBC%20tank%20of%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=2c1bcb354709017a29d33a855ba70371" 
                      alt="1000L IBC Tank" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    1000L IBC Tank
                  </h3>
                  <p className="text-[#333333] mb-4">For large-scale production facilities</p>
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
                  For large volume requirements, we offer efficient bulk delivery options:
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
              /><div className="flex-grow">
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
                  High-performance hydraulic oils for industrial equipment.
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

export default RubberProcessOil;
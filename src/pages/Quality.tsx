import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Quality = () => {
  const [activeTab, setActiveTab] = useState('process');
  
  const certificates = [
    {
      name: "ISO 9001",
      description: "Quality Management System",
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ISO%209001%20certification%20icon%2C%20vector%20style&sign=6853a89bf8d82e2d04dbfd3b9f727537"
    },
    {
      name: "ISO 14001",
      description: "Environmental Management System",
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ISO%2014001%20certification%20icon%2C%20vector%20style&sign=01e72eed2d0ac6c236a7de0544159180"
    },
    {
      name: "ISO 45001",
      description: "Occupational Health and Safety",
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ISO%2045001%20certification%20icon%2C%20vector%20style&sign=8b8569c7cb051c735c0285a2946a1bbd"
    },
    {
      name: "OHSAS 18001",
      description: "Occupational Health and Safety Assessment",
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=OHSAS%2018001%20certification%20icon%2C%20vector%20style&sign=879a9136139c509021192cd1319cd0bc"
    }
  ];
  
  const qualityStandards = [
    {
      standard: "ASTM International",
      description: "American Society for Testing and Materials standards for petroleum products",
      icon: "fa-check-circle"
    },
    {
      standard: "ISO Standards",
      description: "International Organization for Standardization specifications for lubricants",
      icon: "fa-check-circle"
    },
    {
      standard: "DIN Standards",
      description: "Deutsches Institut für Normung specifications for industrial applications",
      icon: "fa-check-circle"
    },
    {
      standard: "GB Standards",
      description: "Chinese national standards for petroleum and chemical products",
      icon: "fa-check-circle"
    },
    {
      standard: "API Specifications",
      description: "American Petroleum Institute performance standards for engine oils",
      icon: "fa-check-circle"
    },
    {
      standard: "REACH Compliance",
      description: "Registration, Evaluation, Authorization and Restriction of Chemicals",
      icon: "fa-check-circle"
    }
  ];
  
  const testMethods = [
    {
      method: "Viscosity Measurement",
      description: "Testing of oil viscosity at various temperatures to ensure proper lubrication properties",
      icon: "fa-temperature-high"
    },
    {
      method: "Flash Point Testing",
      description: "Determination of the lowest temperature at which the oil vapors ignite",
      icon: "fa-fire"
    },
    {
      method: "Pour Point Testing",
      description: "Measurement of the lowest temperature at which the oil remains fluid",
      icon: "fa-temperature-low"
    },
    {
      method: "Acid Number Determination",
      description: "Testing of acidic properties to evaluate oxidation and degradation levels",
      icon: "fa-flask"
    },
    {
      method: "Elemental Analysis",
      description: "Measurement of additive elements concentration using advanced spectroscopy techniques",
      icon: "fa-microscope"
    },
    {
      method: "Particle Counting",
      description: "Evaluation of the cleanliness level of lubricants using laser particle counters",
      icon: "fa-filter"
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
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Quality%20control%20laboratory%20with%20scientists%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=0ce2d7720d0756c39cc74b5df3f99223" 
              alt="Quality & Compliance" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight text-center px-4">
                Quality & Compliance
              </h1>
            </div>
          </div>
        </section>
        
        {/* Quality Tabs */}
        <div className="mb-12 flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'process' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('process')}
          >
            Quality Process
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'certificates' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'standards' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('standards')}
          >
            Standards
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'testing' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('testing')}
          >
            Testing Methods
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'process' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Our Quality Process
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                At CN-SpecLube Chain, we maintain rigorous quality control throughout our entire supply chain, from raw material sourcing to finished product delivery. Our commitment to quality ensures that every product meets the highest industry standards.
              </p>
              
              {/* Process Flow */}
              <div className="relative mb-12">
                {/* Process Steps */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#D4AF37] -translate-x-1/2"></div>
                
                <div className="space-y-12 relative">
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                      <h3 className="text-2xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                        Strategic Sourcing
                      </h3>
                      <p className="text-[#333333]">
                        We partner with leading Chinese specialty oil manufacturers, carefully selecting suppliers known for their exceptional quality standards and consistent product excellence.
                      </p>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-[#003366] text-white items-center justify-center z-10">
                      <span className="font-bold text-xl">1</span>
                    </div>
                    <div className="md:block hidden md:w-1/2 md:pl-8">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Bohai%20Bay%20oilfield%2C%20offshore%20platform%2C%20industrial%20cinematic%20style&sign=e65d65fd032ab8e40831b935e3ce9026" 
                        alt="Quality Control" 
                        className="w-full h-60 object-cover rounded-sm"
                      />
                    </div>
                    <div className="md:hidden w-full mb-4">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Bohai%20Bay%20oilfield%2C%20offshore%20platform%2C%20industrial%20cinematic%20style&sign=e65d65fd032ab8e40831b935e3ce9026" 
                        alt="Quality Control" 
                        className="w-full h-48 object-cover rounded-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="hidden md:block md:w-1/2 md:pr-8 order-1 md:order-2">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Oil%20refinery%20hydro-treating%20process%2C%20industrial%20cinematic%20style&sign=d2e891c6843cd53a917e1bdbeb26d286" 
                        alt="Hydro-treating Process" 
                        className="w-full h-60 object-cover rounded-sm"
                      />
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-[#003366] text-white items-center justify-center z-10">
                      <span className="font-bold text-xl">2</span>
                    </div>
                    <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0 order-2 md:order-1">
                      <h3 className="text-2xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                        Hydro-treating
                      </h3>
                      <p className="text-[#333333]">
                        Our advanced hydro-treating process removes impurities and stabilizes the base oil, ensuring superior performance characteristics and extended service life.
                      </p>
                    </div>
                    <div className="md:hidden w-full mb-4">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Oil%20refinery%20hydro-treating%20process%2C%20industrial%20cinematic%20style&sign=d2e891c6843cd53a917e1bdbeb26d286" 
                        alt="Hydro-treating Process" 
                        className="w-full h-48 object-cover rounded-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                      <h3 className="text-2xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                        CNAS Lab Test
                      </h3>
                      <p className="text-[#333333]">
                        All our products undergo rigorous testing in our CNAS-accredited laboratory, ensuring compliance with international standards and specifications.
                      </p>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-[#003366] text-white items-center justify-center z-10">
                      <span className="font-bold text-xl">3</span>
                    </div>
                    <div className="md:block hidden md:w-1/2 md:pl-8">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=CNAS%20accredited%20laboratory%20testing%20equipment%2C%20industrial%20cinematic%20style&sign=7e062f635ef32eb65db19e2e6b17b297" 
                        alt="CNAS Lab Test" 
                        className="w-full h-60 object-cover rounded-sm"
                      />
                    </div>
                    <div className="md:hidden w-full mb-4">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=CNAS%20accredited%20laboratory%20testing%20equipment%2C%20industrial%20cinematic%20style&sign=7e062f635ef32eb65db19e2e6b17b297" 
                        alt="CNAS Lab Test" 
                        className="w-full h-48 object-cover rounded-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="hidden md:block md:w-1/2 md:pr-8 order-1 md:order-2">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Shipping%20container%20being%20loaded%20with%20lubricant%20drums%2C%20industrial%20cinematic%20style&sign=758b9c21930d210f4d65ec4070c8ddb7" 
                        alt="Shipment" 
                        className="w-full h-60 object-cover rounded-sm"
                      />
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-[#003366] text-white items-center justify-center z-10">
                      <span className="font-bold text-xl">4</span>
                    </div>
                    <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0 order-2 md:order-1">
                      <h3 className="text-2xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                        Shipment
                      </h3>
                      <p className="text-[#333333]">
                        We ensure proper packaging and handling during shipment to maintain product integrity, with complete documentation for customs clearance and quality assurance.
                      </p>
                    </div>
                    <div className="md:hidden w-full">
                      <img 
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Shipping%20container%20being%20loaded%20with%20lubricant%20drums%2C%20industrial%20cinematic%20style&sign=758b9c21930d210f4d65ec4070c8ddb7" 
                        alt="Shipment" 
                        className="w-full h-48 object-cover rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Quality Management System
                </h3>
                <p className="text-[#333333] mb-6">
                  Our ISO 9001-certified Quality Management System ensures consistent product quality and continuous improvement throughout our operations. Key elements include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] text-3xl mr-4">
                      <i className="fa-solid fa-file-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Documentation Control</h4>
                      <p className="text-sm text-[#333333]">Comprehensive documentation of all processes and procedures</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] text-3xl mr-4">
                      <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Employee Training</h4>
                      <p className="text-sm text-[#333333]">Regular training programs to ensure staff competence</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] text-3xl mr-4">
                      <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Performance Metrics</h4>
                      <p className="text-sm text-[#333333]">Monitoring and measurement of key quality indicators</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] text-3xl mr-4">
                      <i className="fa-solid fa-correct"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Corrective Actions</h4>
                      <p className="text-sm text-[#333333]">Systematic approach to addressing non-conformities</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] text-3xl mr-4">
                      <i className="fa-solid fa-comment-dots"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Customer Feedback</h4>
                      <p className="text-sm text-[#333333]">Continuous improvement based on customer input</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] text-3xl mr-4">
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">Internal Audits</h4>
                      <p className="text-sm text-[#333333]">Regular auditing to ensure compliance with standards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'certificates' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Our Certifications
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                We hold various certifications that demonstrate our commitment to quality, environmental responsibility, and occupational health and safety. These certifications validate our adherence to international standards.
              </p>
              
              {/* Certificates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {certificates.map((certificate, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm flex items-center">
                    <div className="w-32 h-32 mr-6 flex items-center justify-center">
                      <img 
                        src={certificate.icon} 
                        alt={certificate.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                        {certificate.name}
                      </h3>
                      <p className="text-[#333333]">
                        {certificate.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional Certifications */}
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Product-Specific Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">Transformer Oil Certifications</h4>
                    <p className="text-sm text-[#333333]">ASTM D3487, IEC 60296, BS 148, GB 2536</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-car"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">Automotive Certifications</h4>
                    <p className="text-sm text-[#333333]">API, ACEA, OEM approvals</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-globe"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">Environmental Certifications</h4>
                    <p className="text-sm text-[#333333]">REACH, RoHS, FDA compliant</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Request Certificate Copies
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'standards' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Quality Standards
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                Our products meet or exceed various international quality standards, ensuring compatibility and performance in global markets. We continuously monitor and adapt to changes in industry standards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {qualityStandards.map((standard, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className={`fa-solid ${standard.icon}`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                        {standard.standard}
                      </h3>
                      <p className="text-[#333333]">
                        {standard.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Industry-Specific Standards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-3">Hydraulic Oils</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>DIN 51524</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>ISO 11158</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>ASTM D6158</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>GB 11118.1</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-3">Gear Oils</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>DIN 51517</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>ISO 12925-1</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>AGMA 9005-E02</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>GB 5903</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-3">Transformer Oils</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>ASTM D3487</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>IEC 60296</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>BS 148</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>GB 2536</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'testing' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Testing Methods
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                Our CNAS-accredited laboratory is equipped with state-of-the-art testing equipment to ensure that every batch of our products meets the highest quality standards. We employ various testing methods throughout the production process.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {testMethods.map((test, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="text-[#D4AF37] text-3xl mb-4">
                      <i className={`fa-solid ${test.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                      {test.method}
                    </h3>
                    <p className="text-[#333333]">
                      {test.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Laboratory Capabilities
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Physical and chemical property testing</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Spectroscopic analysis for elemental composition</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Wear testing using four-ball and FZG methods</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Oxidation stability testing (TOST)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Particle counting and cleanliness analysis</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Environmental testing (temperature, humidity)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Quality Assurance Process
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-[#003366] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#222222] mb-1">Incoming Raw Material Inspection</h4>
                        <p className="text-sm text-[#333333]">Comprehensive testing of all incoming raw materials before production</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#003366] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#222222] mb-1">In-Process Quality Control</h4>
                        <p className="text-sm text-[#333333]">Regular monitoring and testing during the production process</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#003366] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#222222] mb-1">Finished Product Testing</h4>
                        <p className="text-sm text-[#333333]">Final inspection and testing before product release</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#003366] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#222222] mb-1">Batch Traceability</h4>
                        <p className="text-sm text-[#333333]">Complete traceability of all products from raw material to delivery</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Learn More About Our Testing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quality Commitment */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#003366] font-['Montserrat']">
            Our Commitment to Quality
          </h2>
          
          <div className="bg-[#F4F6F9] p-8 rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-[#D4AF37] text-4xl mb-4">
                  <i className="fa-solid fa-award"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                  Excellence
                </h3>
                <p className="text-[#333333]">
                  We strive for excellence in everything we do, from product development to customer service
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-[#D4AF37] text-4xl mb-4">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                  Compliance
                </h3>
                <p className="text-[#333333]">
                  Full compliance with international standards and regulations for quality and safety
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-[#D4AF37] text-4xl mb-4">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                  Continuous Improvement
                </h3>
                <p className="text-[#333333]">
                  Ongoing efforts to improve our products, processes, and systems
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-[#D4AF37] text-4xl mb-4">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                  Customer Satisfaction
                </h3>
                <p className="text-[#333333]">
                  Meeting and exceeding customer expectations through quality products and services
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-[#003366] text-white p-8 rounded-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-['Montserrat'] text-white">
                Confidence in Every Drop
              </h2>
              <p className="text-white/80">
                Our commitment to quality ensures that you receive the best products for your industrial needs
              </p>
            </div>
            <Link 
              to="/contact"
              className="inline-block bg-[#D4AF37] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Request Product Samples
            </Link>
          </div>
        </section>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
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

export default Quality;
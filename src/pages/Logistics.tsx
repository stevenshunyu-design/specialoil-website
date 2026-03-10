import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Logistics = () => {
  const [activeTab, setActiveTab] = useState('bulk');
  
  const bulkOptions = [
    {
      type: "ISO Tank",
      capacity: "26,000L",
      description: "Stainless steel tanks designed for safe and efficient transportation of bulk liquids.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=ISO%20Tank%20container%20being%20loaded%2C%20industrial%20cinematic%20style&sign=d1bbe8356677a37d216f4b20d88c9fd0"
    },
    {
      type: "Flexibag",
      capacity: "20ft container",
      description: "Flexible intermediate bulk containers with heating pad available for temperature-sensitive products.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Flexibag%20inside%20shipping%20container%2C%20industrial%20cinematic%20style&sign=3abcf2a13c5e0d6bb1669392fa3ac224"
    }
  ];
  
  const packagedOptions = [
    {
      type: "Drums",
      details: "4 drums/pallet, stretch film reinforced",
      description: "200L steel drums securely packed on wooden pallets for stability during transport.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Steel%20drums%20on%20pallet%2C%20industrial%20cinematic%20style&sign=3f1a56a743867f9638250c3526d7a9b2"
    },
    {
      type: "IBC",
      details: "Forklift handling示意",
      description: "1000L intermediate bulk containers designed for efficient storage and handling with forklifts or pallet jacks.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Forklift%20handling%20IBC%20tank%2C%20industrial%20cinematic%20style&sign=e3c9278c5710ce80ecd895412642912e"
    },
    {
      type: "Small Packs",
      details: "Carton packaging示意",
      description: "18L plastic buckets and smaller containers packed in sturdy cartons for safe transportation.",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Small%20lubricant%20packs%20in%20carton%20boxes%2C%20industrial%20cinematic%20style&sign=106494f85fbcc68e927b65deed90f8a9"
    }
  ];
  
  const shippingRoutes = [
    {
      route: "Asia to Europe",
      transitTime: "21-28 days",
      mainPorts: "Shanghai, Ningbo → Rotterdam, Hamburg"
    },
    {
      route: "Asia to North America",
      transitTime: "18-25 days",
      mainPorts: "Qingdao, Tianjin → Los Angeles, New York"
    },
    {
      route: "Asia to South America",
      transitTime: "30-40 days",
      mainPorts: "Shanghai → Santos, Buenos Aires"
    },
    {
      route: "Asia to Oceania",
      transitTime: "12-18 days",
      mainPorts: "Shanghai → Sydney, Melbourne"
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
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Logistics%20port%20with%20cranes%20and%20containers%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=4f8d1217a6c7b79e0eb41f7c2f748601" 
              alt="Logistics & Packaging" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight text-center px-4">
                Logistics & Packaging Solutions
              </h1>
            </div>
          </div>
        </section>
        
        {/* Logistics Tabs */}
        <div className="mb-12 flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'bulk' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('bulk')}
          >
            Bulk Liquid Transport
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'packaged' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('packaged')}
          >
            Packaged Goods Transport
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'shipping' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            Global Shipping Routes
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'customs' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('customs')}
          >
            Customs & Compliance
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'bulk' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Bulk Liquid Transportation
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                We offer efficient and cost-effective bulk liquid transportation solutions for our raw materials, designed to meet the specific requirements of the oil and lubricants industry.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {bulkOptions.map((option, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="h-60 mb-6 overflow-hidden">
                      <img 
                        src={option.imageUrl} 
                        alt={option.type} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                      {option.type}
                    </h3>
                    <div className="text-[#D4AF37] font-semibold mb-4">
                      Capacity: {option.capacity}
                    </div>
                    <p className="text-[#333333] mb-6">
                      {option.description}
                    </p>
                    {option.type === "Flexibag" && (
                      <div className="inline-block bg-[#D4AF37] text-white px-4 py-2 rounded-sm text-sm font-semibold">
                        Heating Pad Available
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Benefits of Bulk Liquid Transport
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-dollar-sign"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">Cost Efficient</h4>
                    <p className="text-sm text-[#333333]">Reduced packaging costs and lower handling expenses</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-recycle"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">Environmentally Friendly</h4>
                    <p className="text-sm text-[#333333]">Minimized packaging waste and reduced carbon footprint</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-truck-loading"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">Efficient Handling</h4>
                    <p className="text-sm text-[#333333]">Simplified logistics and faster loading/unloading processes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'packaged' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Packaged Goods Transportation
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                Our finished lubricants are available in various packaging options, each designed to ensure product integrity during transportation and storage.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {packagedOptions.map((option, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="h-52 mb-6 overflow-hidden">
                      <img 
                        src={option.imageUrl} 
                        alt={option.type} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                      {option.type}
                    </h3>
                    <div className="text-[#D4AF37] font-semibold mb-4">
                      {option.details}
                    </div>
                    <p className="text-[#333333]">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Packaging Specifications
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F4F6F9]">
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Packaging Type</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Capacity</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Quantity per Pallet</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">Quantity per 20ft Container</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">18L Plastic Bucket</td>
                        <td className="p-4 border-b border-gray-200">18L</td>
                        <td className="p-4 border-b border-gray-200">48 buckets</td>
                        <td className="p-4 border-b border-gray-200">1,152 buckets</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">200L Steel Drum</td>
                        <td className="p-4 border-b border-gray-200">200L</td>
                        <td className="p-4 border-b border-gray-200">4 drums</td>
                        <td className="p-4 border-b border-gray-200">80 drums</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">1000L IBC Tank</td>
                        <td className="p-4 border-b border-gray-200">1000L</td>
                        <td className="p-4 border-b border-gray-200">1 IBC</td>
                        <td className="p-4 border-b border-gray-200">18 IBCs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'shipping' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Global Shipping Routes
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                We have established reliable shipping routes to ensure timely delivery of our products to customers worldwide. Our global logistics network covers all major regions.
              </p>
              
              <div className="mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Major Shipping Routes
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#003366] text-white">
                          <th className="p-4 text-left font-semibold">Route</th>
                          <th className="p-4 text-left font-semibold">Transit Time</th>
                          <th className="p-4 text-left font-semibold">Main Ports</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shippingRoutes.map((route, index) => (
                          <tr 
                            key={index} 
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]'} hover:bg-[#E8EBF2] transition-colors`}
                          >
                            <td className="p-4 border-t border-gray-200 font-semibold">{route.route}</td>
                            <td className="p-4 border-t border-gray-200">{route.transitTime}</td>
                            <td className="p-4 border-t border-gray-200">{route.mainPorts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="relative h-96 rounded-sm overflow-hidden">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=World%20map%20with%20shipping%20routes%20highlighted%2C%20industrial%20style&sign=b423ee5722b30ac5431b668208f5d913" 
                    alt="Global Shipping Routes" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Shipping Methods
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-ship"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Ocean Freight</h4>
                        <p className="text-[#333333]">Most economical option for large volumes, available in FCL (Full Container Load) and LCL (Less than Container Load)</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-plane"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Air Freight</h4>
                        <p className="text-[#333333]">Expedited shipping for urgent orders, ideal for small volumes and time-sensitive deliveries</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-truck"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">Land Transportation</h4>
                        <p className="text-[#333333]">Trucking services for inland deliveries and cross-border transportation in neighboring countries</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Incoterms Options
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">EXW</span>
                      <span className="text-[#333333]">Ex Works</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">FOB</span>
                      <span className="text-[#333333]">Free On Board</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">CFR</span>
                      <span className="text-[#333333]">Cost and Freight</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">CIF</span>
                      <span className="text-[#333333]">Cost, Insurance and Freight</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">DAP</span>
                      <span className="text-[#333333]">Delivered At Place</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold">DDP</span>
                      <span className="text-[#333333]">Delivered Duty Paid</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Request Shipping Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'customs' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                Customs & Compliance
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                We have extensive experience in international trade regulations and customs procedures, ensuring smooth and compliant shipments to destinations worldwide.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Documentation Services
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Commercial Invoice</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Packing List</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Bill of Lading/Airway Bill</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Certificate of Origin</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Insurance Certificate (for CIF shipments)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>MSDS (Material Safety Data Sheet)</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Technical Certificates</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    Regulatory Compliance
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>ADR/RID for dangerous goods transportation</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>IMO regulations for maritime transport</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>ICAO/IATA regulations for air transport</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>EU REACH compliance</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>US EPA regulations</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Customs clearance assistance worldwide</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>Tariff classification expertise</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-2">
                      What documentation do I need to provide for international shipping?
                    </h4>
                    <p className="text-[#333333]">
                      For most international shipments, we require your company details, port of destination, and preferred Incoterms. We will handle the preparation of all necessary shipping documents based on your specific requirements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-2">
                      How do you ensure compliance with international regulations?
                    </h4>
                    <p className="text-[#333333]">
                      Our logistics team stays updated on the latest international trade regulations and maintains close relationships with regulatory authorities. We conduct regular training and audits to ensure full compliance with all applicable laws and standards.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-2">
                      Can you assist with customs clearance at the destination port?
                    </h4>
                    <p className="text-[#333333]">
                      Yes, we have a global network of customs brokers and agents who can assist with customs clearance at virtually any destination port worldwide. We can provide DDP (Delivered Duty Paid) services for a complete door-to-door solution.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Contact Our Logistics Team
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Logistics Advantage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#003366] font-['Montserrat']">
            Our Logistics Advantage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                Global Network
              </h3>
              <p className="text-[#333333]">
                Comprehensive logistics network covering all major regions worldwide
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                Product Safety
              </h3>
              <p className="text-[#333333]">
                Stringent safety protocols to ensure product integrity during transportation
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-clock"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                On-Time Delivery
              </h3>
              <p className="text-[#333333]">
                Reliable transportation solutions with commitment to delivery schedules
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-headset"></i>
              </div><h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                Dedicated Support
              </h3>
              <p className="text-[#333333]">
                Expert logistics team providing personalized support throughout the shipping process
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-[#003366] text-white p-8 rounded-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-['Montserrat']">
                Ready to Ship Your Order?
              </h2>
              <p className="text-white/80">
                Our logistics experts are ready to provide you with a customized shipping solution
              </p>
            </div>
            <Link 
              to="/contact"
              className="inline-block bg-[#D4AF37] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Get a Shipping Quote
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

export default Logistics;
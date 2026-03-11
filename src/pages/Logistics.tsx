import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Logistics = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('bulk');
  
  const bulkOptions = [
    {
      type: t('logistics.bulk.isoTank.title'),
      capacity: t('logistics.bulk.isoTank.capacity'),
      description: t('logistics.bulk.isoTank.description'),
      imageUrl: "/iso-tank-card.jpg"
    },
    {
      type: t('logistics.bulk.flexibag.title'),
      capacity: t('logistics.bulk.flexibag.capacity'),
      description: t('logistics.bulk.flexibag.description'),
      badge: t('logistics.bulk.flexibag.badge'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Flexibag%20inside%20shipping%20container%2C%20industrial%20cinematic%20style&sign=3abcf2a13c5e0d6bb1669392fa3ac224"
    }
  ];
  
  const packagedOptions = [
    {
      type: t('logistics.packaged.drums.title'),
      details: t('logistics.packaged.drums.details'),
      description: t('logistics.packaged.drums.description'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Steel%20drums%20on%20pallet%2C%20industrial%20cinematic%20style&sign=3f1a56a743867f9638250c3526d7a9b2"
    },
    {
      type: t('logistics.packaged.ibc.title'),
      details: t('logistics.packaged.ibc.details'),
      description: t('logistics.packaged.ibc.description'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Forklift%20handling%20IBC%20tank%2C%20industrial%20cinematic%20style&sign=e3c9278c5710ce80ecd895412642912e"
    },
    {
      type: t('logistics.packaged.smallPacks.title'),
      details: t('logistics.packaged.smallPacks.details'),
      description: t('logistics.packaged.smallPacks.description'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Small%20lubricant%20packs%20in%20carton%20boxes%2C%20industrial%20cinematic%20style&sign=106494f85fbcc68e927b65deed90f8a9"
    }
  ];
  
  const shippingRoutes = [
    {
      route: t('logistics.shipping.asiaEurope.route'),
      transitTime: t('logistics.shipping.asiaEurope.transitTime'),
      mainPorts: t('logistics.shipping.asiaEurope.ports')
    },
    {
      route: t('logistics.shipping.asiaNorthAmerica.route'),
      transitTime: t('logistics.shipping.asiaNorthAmerica.transitTime'),
      mainPorts: t('logistics.shipping.asiaNorthAmerica.ports')
    },
    {
      route: t('logistics.shipping.asiaSouthAmerica.route'),
      transitTime: t('logistics.shipping.asiaSouthAmerica.transitTime'),
      mainPorts: t('logistics.shipping.asiaSouthAmerica.ports')
    },
    {
      route: t('logistics.shipping.asiaOceania.route'),
      transitTime: t('logistics.shipping.asiaOceania.transitTime'),
      mainPorts: t('logistics.shipping.asiaOceania.ports')
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
              alt={t('logistics.hero.title')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight text-center px-4">
                {t('logistics.hero.title')}
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
            {t('logistics.tabs.bulk')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'packaged' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('packaged')}
          >
            {t('logistics.tabs.packaged')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'shipping' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            {t('logistics.tabs.shipping')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'customs' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('customs')}
          >
            {t('logistics.tabs.customs')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'bulk' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('logistics.bulk.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('logistics.bulk.description')}
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
                      {t('logistics.packaged.specs.capacityCol')}: {option.capacity}
                    </div>
                    <p className="text-[#333333] mb-6">
                      {option.description}
                    </p>
                    {option.badge && (
                      <div className="inline-block bg-[#D4AF37] text-white px-4 py-2 rounded-sm text-sm font-semibold">
                        {option.badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('logistics.bulk.benefits.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-dollar-sign"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">{t('logistics.bulk.benefits.cost.title')}</h4>
                    <p className="text-sm text-[#333333]">{t('logistics.bulk.benefits.cost.description')}</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-recycle"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">{t('logistics.bulk.benefits.environment.title')}</h4>
                    <p className="text-sm text-[#333333]">{t('logistics.bulk.benefits.environment.description')}</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-[#D4AF37] text-3xl mb-3">
                      <i className="fa-solid fa-truck-loading"></i>
                    </div>
                    <h4 className="font-semibold text-[#222222] mb-2">{t('logistics.bulk.benefits.handling.title')}</h4>
                    <p className="text-sm text-[#333333]">{t('logistics.bulk.benefits.handling.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'packaged' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('logistics.packaged.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('logistics.packaged.description')}
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
                  {t('logistics.packaged.specs.title')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F4F6F9]">
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('logistics.packaged.specs.type')}</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('logistics.packaged.specs.capacityCol')}</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('logistics.packaged.specs.perPallet')}</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('logistics.packaged.specs.perContainer')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">{t('logistics.packaged.specs.bucket18L.name')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.bucket18L.capacity')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.bucket18L.pallet')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.bucket18L.container')}</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">{t('logistics.packaged.specs.drum200L.name')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.drum200L.capacity')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.drum200L.pallet')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.drum200L.container')}</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">{t('logistics.packaged.specs.ibc1000L.name')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.ibc1000L.capacity')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.ibc1000L.pallet')}</td>
                        <td className="p-4 border-b border-gray-200">{t('logistics.packaged.specs.ibc1000L.container')}</td>
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
                {t('logistics.shipping.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('logistics.shipping.description')}
              </p>
              
              <div className="mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('logistics.shipping.routesTitle')}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#003366] text-white">
                          <th className="p-4 text-left font-semibold">{t('logistics.shipping.route')}</th>
                          <th className="p-4 text-left font-semibold">{t('logistics.shipping.transitTime')}</th>
                          <th className="p-4 text-left font-semibold">{t('logistics.shipping.mainPorts')}</th>
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
                    alt={t('logistics.shipping.title')} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('logistics.shipping.methods.title')}
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-ship"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('logistics.shipping.methods.ocean.title')}</h4>
                        <p className="text-[#333333]">{t('logistics.shipping.methods.ocean.description')}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-plane"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('logistics.shipping.methods.air.title')}</h4>
                        <p className="text-[#333333]">{t('logistics.shipping.methods.air.description')}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-truck"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('logistics.shipping.methods.land.title')}</h4>
                        <p className="text-[#333333]">{t('logistics.shipping.methods.land.description')}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('logistics.shipping.incoterms.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">EXW</span>
                      <span className="text-[#333333]">{t('logistics.shipping.incoterms.exw')}</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">FOB</span>
                      <span className="text-[#333333]">{t('logistics.shipping.incoterms.fob')}</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">CFR</span>
                      <span className="text-[#333333]">{t('logistics.shipping.incoterms.cfr')}</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">CIF</span>
                      <span className="text-[#333333]">{t('logistics.shipping.incoterms.cif')}</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-semibold">DAP</span>
                      <span className="text-[#333333]">{t('logistics.shipping.incoterms.dap')}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold">DDP</span>
                      <span className="text-[#333333]">{t('logistics.shipping.incoterms.ddp')}</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      {t('logistics.shipping.quoteButton')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'customs' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('logistics.customs.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('logistics.customs.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('logistics.customs.documentation.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.commercialInvoice')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.packingList')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.billOfLading')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.certificateOfOrigin')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.insuranceCertificate')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.msds')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.documentation.technicalCertificates')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('logistics.customs.regulatory.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.adr')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.imo')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.icao')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.reach')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.epa')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.clearance')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('logistics.customs.regulatory.tariff')}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('logistics.customs.faq.title')}
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-2">
                      {t('logistics.customs.faq.q1')}
                    </h4>
                    <p className="text-[#333333]">
                      {t('logistics.customs.faq.a1')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-2">
                      {t('logistics.customs.faq.q2')}
                    </h4>
                    <p className="text-[#333333]">
                      {t('logistics.customs.faq.a2')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#222222] mb-2">
                      {t('logistics.customs.faq.q3')}
                    </h4>
                    <p className="text-[#333333]">
                      {t('logistics.customs.faq.a3')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    {t('logistics.customs.faq.contactButton')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Logistics Advantage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#003366] font-['Montserrat']">
            {t('logistics.advantage.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                {t('logistics.advantage.globalNetwork.title')}
              </h3>
              <p className="text-[#333333]">
                {t('logistics.advantage.globalNetwork.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-shield-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                {t('logistics.advantage.productSafety.title')}
              </h3>
              <p className="text-[#333333]">
                {t('logistics.advantage.productSafety.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-clock"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                {t('logistics.advantage.onTimeDelivery.title')}
              </h3>
              <p className="text-[#333333]">
                {t('logistics.advantage.onTimeDelivery.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">
                <i className="fa-solid fa-headset"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                {t('logistics.advantage.dedicatedSupport.title')}
              </h3>
              <p className="text-[#333333]">
                {t('logistics.advantage.dedicatedSupport.description')}
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-[#003366] text-white p-8 rounded-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-['Montserrat'] text-white">
                {t('logistics.cta.title')}
              </h2>
              <p className="text-white/80">
                {t('logistics.cta.description')}
              </p>
            </div>
            <Link 
              to="/contact"
              className="inline-block bg-[#D4AF37] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              {t('logistics.cta.button')}
            </Link>
          </div>
        </section>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>{t('logistics.mobileFooter.contact')}</span>
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

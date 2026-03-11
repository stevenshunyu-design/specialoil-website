import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSEO from '@/hooks/useSEO';

const Quality = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('process');
  
  // Initialize SEO for this page
  useSEO('quality');
  
  const certificates = [
    {
      name: "ISO 9001",
      description: t('quality.certificates.iso9001'),
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ISO%209001%20certification%20icon%2C%20vector%20style&sign=6853a89bf8d82e2d04dbfd3b9f727537"
    },
    {
      name: "ISO 14001",
      description: t('quality.certificates.iso14001'),
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ISO%2014001%20certification%20icon%2C%20vector%20style&sign=01e72eed2d0ac6c236a7de0544159180"
    },
    {
      name: "ISO 45001",
      description: t('quality.certificates.iso45001'),
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ISO%2045001%20certification%20icon%2C%20vector%20style&sign=8b8569c7cb051c735c0285a2946a1bbd"
    },
    {
      name: "OHSAS 18001",
      description: t('quality.certificates.ohsas'),
      icon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=OHSAS%2018001%20certification%20icon%2C%20vector%20style&sign=879a9136139c509021192cd1319cd0bc"
    }
  ];
  
  const qualityStandards = [
    { standard: "ASTM International", description: t('quality.standards.astm'), icon: "fa-check-circle" },
    { standard: "ISO Standards", description: t('quality.standards.iso'), icon: "fa-check-circle" },
    { standard: "DIN Standards", description: t('quality.standards.din'), icon: "fa-check-circle" },
    { standard: "GB Standards", description: t('quality.standards.gb'), icon: "fa-check-circle" },
    { standard: "API Specifications", description: t('quality.standards.api'), icon: "fa-check-circle" },
    { standard: "REACH Compliance", description: t('quality.standards.reach'), icon: "fa-check-circle" }
  ];
  
  const testMethods = [
    { method: t('quality.testing.viscosity.name'), description: t('quality.testing.viscosity.desc'), icon: "fa-temperature-high" },
    { method: t('quality.testing.flashPoint.name'), description: t('quality.testing.flashPoint.desc'), icon: "fa-fire" },
    { method: t('quality.testing.pourPoint.name'), description: t('quality.testing.pourPoint.desc'), icon: "fa-temperature-low" },
    { method: t('quality.testing.acidNumber.name'), description: t('quality.testing.acidNumber.desc'), icon: "fa-flask" },
    { method: t('quality.testing.elemental.name'), description: t('quality.testing.elemental.desc'), icon: "fa-microscope" },
    { method: t('quality.testing.particle.name'), description: t('quality.testing.particle.desc'), icon: "fa-filter" }
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
                {t('quality.hero.title')}
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
            {t('quality.tabs.process')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'certificates' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('certificates')}
          >
            {t('quality.tabs.certificates')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'standards' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('standards')}
          >
            {t('quality.tabs.standards')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'testing' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('testing')}
          >
            {t('quality.tabs.testing')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'process' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('quality.process.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('quality.process.intro')}
              </p>
              
              {/* Process Flow */}
              <div className="relative mb-12">
                {/* Process Steps */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#D4AF37] -translate-x-1/2"></div>
                
                <div className="space-y-12 relative">
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                      <h3 className="text-2xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                        {t('quality.process.step1.title')}
                      </h3>
                      <p className="text-[#333333]">
                        {t('quality.process.step1.desc')}
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
                        {t('quality.process.step2.title')}
                      </h3>
                      <p className="text-[#333333]">
                        {t('quality.process.step2.desc')}
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
                        {t('quality.process.step3.title')}
                      </h3>
                      <p className="text-[#333333]">
                        {t('quality.process.step3.desc')}
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
                        {t('quality.process.step4.title')}
                      </h3>
                      <p className="text-[#333333]">
                        {t('quality.process.step4.desc')}
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
                  {t('quality.process.qms.title')}
                </h3>
                <p className="text-[#333333] mb-6">
                  {t('quality.process.qms.intro')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#D4AF37] rounded-sm mr-4 flex-shrink-0">
                      <i className="fa-solid fa-check text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#333333] mb-1">{t('quality.process.qms.item1')}</h4>
                      <p className="text-sm text-[#666666]">{t('quality.process.qms.item1Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#D4AF37] rounded-sm mr-4 flex-shrink-0">
                      <i className="fa-solid fa-check text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#333333] mb-1">{t('quality.process.qms.item2')}</h4>
                      <p className="text-sm text-[#666666]">{t('quality.process.qms.item2Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#D4AF37] rounded-sm mr-4 flex-shrink-0">
                      <i className="fa-solid fa-check text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#333333] mb-1">{t('quality.process.qms.item3')}</h4>
                      <p className="text-sm text-[#666666]">{t('quality.process.qms.item3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'certificates' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('quality.certificates.title')}
              </h2>
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('quality.certificates.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm flex items-center">
                    <div className="w-20 h-20 mr-6 flex-shrink-0">
                      <img src={cert.icon} alt={cert.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">{cert.name}</h3>
                      <p className="text-[#333333]">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'standards' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('quality.standards.title')}
              </h2>
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('quality.standards.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {qualityStandards.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#D4AF37] rounded-sm mr-4 flex-shrink-0">
                      <i className={`fa-solid ${item.icon} text-white`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#003366] font-['Montserrat'] mb-2">{item.standard}</h3>
                      <p className="text-[#333333]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'testing' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('quality.testing.title')}
              </h2>
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('quality.testing.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testMethods.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-sm shadow-sm flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#D4AF37] rounded-sm mr-4 flex-shrink-0">
                      <i className={`fa-solid ${item.icon} text-white`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#003366] font-['Montserrat'] mb-2">{item.method}</h3>
                      <p className="text-[#333333]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* CTA Section */}
        <section className="bg-[#D4AF37] text-white p-12 rounded-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                {t('quality.cta.title')}
              </h2>
              <p className="font-body text-white/90 leading-relaxed">
                {t('quality.cta.desc')}
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-block bg-white text-[var(--primary-900)] px-10 py-4 rounded-sm font-medium hover:bg-[var(--primary-100)] transition-all duration-300 uppercase tracking-wider text-sm whitespace-nowrap"
            >
              {t('quality.cta.button')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Quality;

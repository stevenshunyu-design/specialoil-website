import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSEO from '@/hooks/useSEO';

const TransformerOil = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize SEO for this page
  useSEO('transformerOil');
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=High%20voltage%20substation%20night%20scene%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=9fc6f95b6469c7480fa036faaa25c0e3" 
              alt={t('transformerOil.hero.title')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  {t('transformerOil.hero.tag')}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                  {t('transformerOil.hero.title')}
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  {t('transformerOil.hero.subtitle')}
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
            {t('transformerOil.tabs.overview')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'specifications' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('specifications')}
          >
            {t('transformerOil.tabs.specifications')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'applications' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            {t('transformerOil.tabs.applications')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'benefits' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('benefits')}
          >
            {t('transformerOil.tabs.benefits')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'packaging' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('packaging')}
          >
            {t('transformerOil.tabs.packaging')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'overview' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('transformerOil.overview.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('transformerOil.overview.description1')}
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('transformerOil.overview.description2')}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.overview.keyFeatures')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-shield-alt"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('transformerOil.overview.feature1.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('transformerOil.overview.feature1.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('transformerOil.overview.feature2.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('transformerOil.overview.feature2.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-tint-slash"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('transformerOil.overview.feature3.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('transformerOil.overview.feature3.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-high"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('transformerOil.overview.feature4.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('transformerOil.overview.feature4.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold text-center hover:bg-opacity-90 transition-all"
                  >
                    {t('transformerOil.overview.requestQuote')}
                  </Link>
                  <Link 
                    to="#"
                    className="inline-block bg-white border-2 border-[#003366] text-[#003366] px-6 py-3 rounded-sm font-semibold text-center hover:bg-[#003366] hover:text-white transition-all"
                  >
                    {t('transformerOil.overview.downloadDatasheet')}
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
                {t('transformerOil.specifications.title')}
              </h2>
              
              <div className="mb-8">
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('transformerOil.specifications.description')}
                </p>
                
                {/* Table with horizontal scroll for mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#003366] text-white">
                        <th className="p-4 text-left font-semibold">{t('transformerOil.specifications.table.grade')}</th>
                        <th className="p-4 text-left font-semibold">{t('transformerOil.specifications.table.viscosity')}</th>
                        <th className="p-4 text-left font-semibold">{t('transformerOil.specifications.table.pourPoint')}</th>
                        <th className="p-4 text-left font-semibold">{t('transformerOil.specifications.table.dielectricStrength')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white hover:bg-[#E8EBF2] transition-colors">
                        <td className="p-4 border-t border-gray-200 font-semibold">{t('transformerOil.specifications.grades.i20x.name')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i20x.viscosity')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i20x.pourPoint')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i20x.dielectric')}</td>
                      </tr>
                      <tr className="bg-[#F4F6F9] hover:bg-[#E8EBF2] transition-colors">
                        <td className="p-4 border-t border-gray-200 font-semibold">{t('transformerOil.specifications.grades.i30x.name')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i30x.viscosity')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i30x.pourPoint')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i30x.dielectric')}</td>
                      </tr>
                      <tr className="bg-white hover:bg-[#E8EBF2] transition-colors">
                        <td className="p-4 border-t border-gray-200 font-semibold">{t('transformerOil.specifications.grades.i40x.name')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i40x.viscosity')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i40x.pourPoint')}</td>
                        <td className="p-4 border-t border-gray-200">{t('transformerOil.specifications.grades.i40x.dielectric')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.specifications.technical.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.baseOilType')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.baseOilValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.flashPoint')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.flashPointValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.firePoint')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.firePointValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.acidity')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.acidityValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.interfacialTension')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.interfacialTensionValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.resistivity')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.resistivityValue')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#333333]">{t('transformerOil.specifications.technical.oxidationStability')}</span>
                      <span className="font-semibold">{t('transformerOil.specifications.technical.oxidationStabilityValue')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.specifications.compliance.title')}
                  </h3>
                  <ul className="space-y-3">
                    {(t('transformerOil.specifications.compliance.items', { returnObjects: true }) as string[]).map((item, index) => (
                      <li key={index} className="flex items-center pb-2 border-b border-gray-100">
                        <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('transformerOil.applications.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('transformerOil.applications.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-3xl mb-4">
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.applications.items.highVoltage.title')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('transformerOil.applications.items.highVoltage.description')}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-3xl mb-4">
                    <i className="fa-solid fa-network-wired"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.applications.items.distribution.title')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('transformerOil.applications.items.distribution.description')}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-3xl mb-4">
                    <i className="fa-solid fa-tachometer-alt"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.applications.items.instrument.title')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('transformerOil.applications.items.instrument.description')}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-3xl mb-4">
                    <i className="fa-solid fa-plug"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.applications.items.switchgear.title')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('transformerOil.applications.items.switchgear.description')}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('transformerOil.applications.recommendedTitle')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F4F6F9]">
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('transformerOil.applications.recommendedTable.grade')}</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('transformerOil.applications.recommendedTable.bestApplications')}</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-200">{t('transformerOil.applications.recommendedTable.operatingEnvironment')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">{t('transformerOil.specifications.grades.i20x.name')}</td>
                        <td className="p-4 border-b border-gray-200">{t('transformerOil.applications.recommendedTable.i20x.applications')}</td>
                        <td className="p-4 border-b border-gray-200">{t('transformerOil.applications.recommendedTable.i20x.environment')}</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">{t('transformerOil.specifications.grades.i30x.name')}</td>
                        <td className="p-4 border-b border-gray-200">{t('transformerOil.applications.recommendedTable.i30x.applications')}</td>
                        <td className="p-4 border-b border-gray-200">{t('transformerOil.applications.recommendedTable.i30x.environment')}</td>
                      </tr>
                      <tr className="hover:bg-[#F4F6F9] transition-colors">
                        <td className="p-4 border-b border-gray-200 font-semibold">{t('transformerOil.specifications.grades.i40x.name')}</td>
                        <td className="p-4 border-b border-gray-200">{t('transformerOil.applications.recommendedTable.i40x.applications')}</td>
                        <td className="p-4 border-b border-gray-200">{t('transformerOil.applications.recommendedTable.i40x.environment')}</td>
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
                  {t('transformerOil.benefits.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('transformerOil.benefits.description')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('transformerOil.benefits.performance.dielectric.title')}</h3>
                      <p className="text-[#333333]">{t('transformerOil.benefits.performance.dielectric.description')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('transformerOil.benefits.performance.serviceLife.title')}</h3>
                      <p className="text-[#333333]">{t('transformerOil.benefits.performance.serviceLife.description')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-temperature-high"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('transformerOil.benefits.performance.heatTransfer.title')}</h3>
                      <p className="text-[#333333]">{t('transformerOil.benefits.performance.heatTransfer.description')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-shield-alt"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('transformerOil.benefits.performance.protection.title')}</h3>
                      <p className="text-[#333333]">{t('transformerOil.benefits.performance.protection.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.benefits.economic.title')}
                  </h3>
                  <ul className="space-y-3">
                    {(t('transformerOil.benefits.economic.items', { returnObjects: true }) as string[]).map((item, index) => (
                      <li key={index} className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.benefits.environmental.title')}
                  </h3>
                  <ul className="space-y-3">
                    {(t('transformerOil.benefits.environmental.items', { returnObjects: true }) as string[]).map((item, index) => (
                      <li key={index} className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      {t('transformerOil.benefits.environmental.contactButton')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'packaging' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('transformerOil.packaging.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('transformerOil.packaging.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=18L%20plastic%20bucket%20of%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=425b53a5abb836f4f979453333728eeb" 
                      alt={t('transformerOil.packaging.options.bucket18L.title')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.packaging.options.bucket18L.title')}
                  </h3>
                  <p className="text-[#333333] mb-4">{t('transformerOil.packaging.options.bucket18L.description')}</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    {t('transformerOil.packaging.options.bucket18L.capacity')}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=200L%20steel%20drum%20of%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=91f2503b281304a0e983fa78ccde3e5c" 
                      alt={t('transformerOil.packaging.options.drum200L.title')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.packaging.options.drum200L.title')}
                  </h3>
                  <p className="text-[#333333] mb-4">{t('transformerOil.packaging.options.drum200L.description')}</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    {t('transformerOil.packaging.options.drum200L.capacity')}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=1000L%20IBC%20tank%20of%20transformer%20oil%2C%20industrial%20cinematic%20style&sign=d855582dcb23ca9e4eff88b4eacd6130" 
                      alt={t('transformerOil.packaging.options.ibc1000L.title')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('transformerOil.packaging.options.ibc1000L.title')}
                  </h3>
                  <p className="text-[#333333] mb-4">{t('transformerOil.packaging.options.ibc1000L.description')}</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    {t('transformerOil.packaging.options.ibc1000L.capacity')}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('transformerOil.packaging.bulkTitle')}
                </h3>
                <p className="text-[#333333] mb-6">
                  {t('transformerOil.packaging.bulkDescription')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-tanker"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('transformerOil.packaging.bulkOptions.tanker.title')}</h4>
                      <p className="text-[#333333]">{t('transformerOil.packaging.bulkOptions.tanker.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-ship"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('transformerOil.packaging.bulkOptions.isoTank.title')}</h4>
                      <p className="text-[#333333]">{t('transformerOil.packaging.bulkOptions.isoTank.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/logistics"
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    {t('transformerOil.packaging.learnMoreLogistics')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#003366] font-['Montserrat']">
            {t('transformerOil.relatedProducts.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Rubber%20process%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=22da0e2e71da5f920708c7ab5d2e20f4" 
                alt={t('transformerOil.relatedProducts.rubberOil.title')} 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  {t('transformerOil.relatedProducts.rubberOil.series')}
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  {t('transformerOil.relatedProducts.rubberOil.title')}
                </h3>
                <p className="text-[#333333] mb-4">
                  {t('transformerOil.relatedProducts.rubberOil.description')}
                </p>
                <Link 
                  to="/products/rubber-process-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  {t('transformerOil.relatedProducts.rubberOil.viewProduct')} <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Hydraulic%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=d4a95ae5a02fd7828ee311313c00e1e8" 
                alt={t('transformerOil.relatedProducts.hydraulicOil.title')} 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  {t('transformerOil.relatedProducts.hydraulicOil.series')}
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  {t('transformerOil.relatedProducts.hydraulicOil.title')}
                </h3>
                <p className="text-[#333333] mb-4">
                  {t('transformerOil.relatedProducts.hydraulicOil.description')}
                </p>
                <Link 
                  to="/products/finished-lubricants"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  {t('transformerOil.relatedProducts.hydraulicOil.viewProduct')} <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>{t('transformerOil.mobile.contact')}</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>{t('transformerOil.mobile.whatsapp')}</span>
        </a>
      </div>
    </div>
  );
};

export default TransformerOil;
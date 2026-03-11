import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FinishedLubricants = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Hydraulic%20system%20close%20up%2C%20high%20pressure%20industrial%20equipment%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=5d9c331728ef8a23af7149bf6f935db2" 
              alt={t('finishedLubricants.hero.title')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  {t('finishedLubricants.hero.tag')}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                  {t('finishedLubricants.hero.title')}
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  {t('finishedLubricants.hero.subtitle')}
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
            {t('finishedLubricants.tabs.overview')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'product-lineup' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('product-lineup')}
          >
            {t('finishedLubricants.tabs.productLineup')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'hydraulic-oils' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('hydraulic-oils')}
          >
            {t('finishedLubricants.tabs.hydraulicOils')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'packaging' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('packaging')}
          >
            {t('finishedLubricants.tabs.packaging')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'overview' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('finishedLubricants.overview.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('finishedLubricants.overview.description1')}
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('finishedLubricants.overview.description2')}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.overview.keyFeatures')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-shield-alt"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('finishedLubricants.overview.feature1.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('finishedLubricants.overview.feature1.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('finishedLubricants.overview.feature2.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('finishedLubricants.overview.feature2.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-tint-slash"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('finishedLubricants.overview.feature3.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('finishedLubricants.overview.feature3.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-high"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('finishedLubricants.overview.feature4.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('finishedLubricants.overview.feature4.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold text-center hover:bg-opacity-90 transition-all"
                  >
                    {t('finishedLubricants.overview.requestQuote')}
                  </Link>
                  <Link 
                    to="#"
                    className="inline-block bg-white border-2 border-[#003366] text-[#003366] px-6 py-3 rounded-sm font-semibold text-center hover:bg-[#003366] hover:text-white transition-all"
                  >
                    {t('finishedLubricants.overview.downloadGuide')}
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Industrial%20machinery%20using%20hydraulic%20oil%2C%20industrial%20cinematic%20style&sign=3fdd4434e320978fa77073cc8051ad94" 
                    alt={t('finishedLubricants.title')} 
                    className="w-full h-auto rounded-sm"
                  />
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Lubricant%20testing%20in%20laboratory%2C%20industrial%20cinematic%20style&sign=d1290e1a5fc509de0b126e8d478482e7" 
                    alt={t('finishedLubricants.title')} 
                    className="w-full h-auto rounded-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'product-lineup' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('finishedLubricants.productLineup.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('finishedLubricants.productLineup.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div key="hydraulic" className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.productLineup.categories.hydraulic.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('finishedLubricants.productLineup.categories.hydraulic.description')}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#222222] mb-2">{t('finishedLubricants.productLineup.availableGrades')}</h4>
                    <ul className="space-y-2">
                      {(t('finishedLubricants.productLineup.categories.hydraulic.grades', { returnObjects: true }) as string[]).map((grade: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                          <span>{grade}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('finishedLubricants.productLineup.categories.hydraulic.standard')}
                  </div>
                </div>
                
                <div key="gear" className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.productLineup.categories.gear.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('finishedLubricants.productLineup.categories.gear.description')}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#222222] mb-2">{t('finishedLubricants.productLineup.availableGrades')}</h4>
                    <ul className="space-y-2">
                      {(t('finishedLubricants.productLineup.categories.gear.grades', { returnObjects: true }) as string[]).map((grade: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                          <span>{grade}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('finishedLubricants.productLineup.categories.gear.standard')}
                  </div>
                </div>
                
                <div key="fleet" className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.productLineup.categories.fleet.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('finishedLubricants.productLineup.categories.fleet.description')}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#222222] mb-2">{t('finishedLubricants.productLineup.availableGrades')}</h4>
                    <ul className="space-y-2">
                      {(t('finishedLubricants.productLineup.categories.fleet.grades', { returnObjects: true }) as string[]).map((grade: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                          <span>{grade}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('finishedLubricants.productLineup.categories.fleet.standard')}
                  </div>
                </div>
                
                <div key="specialty" className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.productLineup.categories.specialty.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('finishedLubricants.productLineup.categories.specialty.description')}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#222222] mb-2">{t('finishedLubricants.productLineup.availableGrades')}</h4>
                    <ul className="space-y-2">
                      {(t('finishedLubricants.productLineup.categories.specialty.grades', { returnObjects: true }) as string[]).map((grade: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                          <span>{grade}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('finishedLubricants.productLineup.categories.specialty.standard')}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  to="/contact"
                  className="inline-block bg-[#003366] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                >
                  {t('finishedLubricants.productLineup.contactTeam')}
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'hydraulic-oils' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('finishedLubricants.hydraulicOils.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('finishedLubricants.hydraulicOils.description')}
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-cog"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('finishedLubricants.hydraulicOils.products.lhm.name')}</h3>
                      <p className="text-[#333333]">
                        {t('finishedLubricants.hydraulicOils.products.lhm.description')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-temperature-low"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('finishedLubricants.hydraulicOils.products.lhv.name')}</h3>
                      <p className="text-[#333333]">
                        {t('finishedLubricants.hydraulicOils.products.lhv.description')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('finishedLubricants.hydraulicOils.products.lhs.name')}</h3>
                      <p className="text-[#333333]">
                        {t('finishedLubricants.hydraulicOils.products.lhs.description')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.hydraulicOils.benefits.title')}
                  </h3>
                  <ul className="space-y-3">
                    {(t('finishedLubricants.hydraulicOils.benefits.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.hydraulicOils.specifications.title')}
                  </h3>
                  
                  {/* Table with horizontal scroll for mobile */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#F4F6F9]">
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">{t('finishedLubricants.hydraulicOils.specifications.property')}</th>
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">{t('finishedLubricants.hydraulicOils.specifications.lhm32')}</th>
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">{t('finishedLubricants.hydraulicOils.specifications.lhm46')}</th>
                          <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">{t('finishedLubricants.hydraulicOils.specifications.lhv46')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">{t('finishedLubricants.hydraulicOils.specifications.viscosity40')}</td>
                          <td className="p-3 border-b border-gray-200 text-sm">32</td>
                          <td className="p-3 border-b border-gray-200 text-sm">46</td>
                          <td className="p-3 border-b border-gray-200 text-sm">46</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">{t('finishedLubricants.hydraulicOils.specifications.viscosityIndex')}</td>
                          <td className="p-3 border-b border-gray-200 text-sm">95</td>
                          <td className="p-3 border-b border-gray-200 text-sm">95</td>
                          <td className="p-3 border-b border-gray-200 text-sm">140</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">{t('finishedLubricants.hydraulicOils.specifications.pourPoint')}</td>
                          <td className="p-3 border-b border-gray-200 text-sm">-24</td>
                          <td className="p-3 border-b border-gray-200 text-sm">-24</td>
                          <td className="p-3 border-b border-gray-200 text-sm">-40</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 border-b border-gray-200 text-sm">{t('finishedLubricants.hydraulicOils.specifications.flashPoint')}</td>
                          <td className="p-3 border-b border-gray-200 text-sm">220</td>
                          <td className="p-3 border-b border-gray-200 text-sm">225</td>
                          <td className="p-3 border-b border-gray-200 text-sm">230</td>
                        </tr>
                        <tr className="hover:bg-[#F4F6F9] transition-colors">
                          <td className="p-3 text-sm">{t('finishedLubricants.hydraulicOils.specifications.antiWear')}</td>
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
                    {t('finishedLubricants.hydraulicOils.applications.title')}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-industry"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('finishedLubricants.hydraulicOils.applications.industrial.name')}</h4>
                        <p className="text-[#333333]">{t('finishedLubricants.hydraulicOils.applications.industrial.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-truck"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('finishedLubricants.hydraulicOils.applications.mobile.name')}</h4>
                        <p className="text-[#333333]">{t('finishedLubricants.hydraulicOils.applications.mobile.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-water"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('finishedLubricants.hydraulicOils.applications.marine.name')}</h4>
                        <p className="text-[#333333]">{t('finishedLubricants.hydraulicOils.applications.marine.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('finishedLubricants.hydraulicOils.applications.coldClimate.name')}</h4>
                        <p className="text-[#333333]">{t('finishedLubricants.hydraulicOils.applications.coldClimate.description')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      {t('finishedLubricants.hydraulicOils.requestConsultation')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'packaging' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('finishedLubricants.packaging.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('finishedLubricants.packaging.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=200L%20steel%20drum%20of%20industrial%20lubricant%2C%20industrial%20cinematic%20style&sign=026ffe8d63c2e8c1d948516cf4cf33ea"
                      alt={t('finishedLubricants.packaging.options.drum200l.name')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.packaging.options.drum200l.name')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('finishedLubricants.packaging.options.drum200l.description')}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=1000L%20IBC%20tank%20of%20industrial%20lubricant%2C%20industrial%20cinematic%20style&sign=de533e25af1363e17d26dd460be7a97a"
                      alt={t('finishedLubricants.packaging.options.ibc1000l.name')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.packaging.options.ibc1000l.name')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('finishedLubricants.packaging.options.ibc1000l.description')}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=18L%20plastic%20bucket%20of%20industrial%20lubricant%2C%20industrial%20cinematic%20style&sign=307f4e6b19403d8fa7fb793d6211d610"
                      alt={t('finishedLubricants.packaging.options.bucket18l.name')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('finishedLubricants.packaging.options.bucket18l.name')}
                  </h3>
                  <p className="text-[#333333]">
                    {t('finishedLubricants.packaging.options.bucket18l.description')}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('finishedLubricants.packaging.bulkDelivery.title')}
                </h3>
                <p className="text-[#333333] mb-6">
                  {t('finishedLubricants.packaging.bulkDelivery.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-tanker"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('finishedLubricants.packaging.bulkDelivery.tankerTrucks.name')}</h4>
                      <p className="text-[#333333]">{t('finishedLubricants.packaging.bulkDelivery.tankerTrucks.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-ship"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('finishedLubricants.packaging.bulkDelivery.isoTanks.name')}</h4>
                      <p className="text-[#333333]">{t('finishedLubricants.packaging.bulkDelivery.isoTanks.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/logistics"
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    {t('finishedLubricants.packaging.learnMoreLogistics')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#003366] font-['Montserrat']">
            {t('finishedLubricants.relatedProducts.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Transformer%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=824699da089ce9e551d24ae9c46f9496" 
                alt={t('finishedLubricants.relatedProducts.transformerOil.name')} 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  {t('finishedLubricants.relatedProducts.transformerOil.series')}
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  {t('finishedLubricants.relatedProducts.transformerOil.name')}
                </h3>
                <p className="text-[#333333] mb-4">
                  {t('finishedLubricants.relatedProducts.transformerOil.description')}
                </p>
                <Link 
                  to="/products/transformer-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  {t('finishedLubricants.relatedProducts.viewProduct')} <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Rubber%20process%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=22da0e2e71da5f920708c7ab5d2e20f4" 
                alt={t('finishedLubricants.relatedProducts.rubberOil.name')} 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  {t('finishedLubricants.relatedProducts.rubberOil.series')}
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  {t('finishedLubricants.relatedProducts.rubberOil.name')}
                </h3>
                <p className="text-[#333333] mb-4">
                  {t('finishedLubricants.relatedProducts.rubberOil.description')}
                </p>
                <Link 
                  to="/products/rubber-process-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  {t('finishedLubricants.relatedProducts.viewProduct')} <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
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
          <span>{t('finishedLubricants.mobileFooter.contactUs')}</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>{t('finishedLubricants.mobileFooter.whatsapp')}</span>
        </a>
      </div>
    </div>
  );
};

export default FinishedLubricants;
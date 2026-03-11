import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RubberProcessOil = () => {
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
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Black%20tire%20macro%20texture%20with%20golden%20oil%20flow%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=3da3c0377dc034ae185014d8a72153f8" 
              alt={t('rubberProcessOil.hero.title')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  {t('rubberProcessOil.hero.tag')}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                  {t('rubberProcessOil.hero.title')}
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  {t('rubberProcessOil.hero.subtitle')}
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
            {t('rubberProcessOil.tabs.overview')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'specifications' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('specifications')}
          >
            {t('rubberProcessOil.tabs.specifications')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'applications' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            {t('rubberProcessOil.tabs.applications')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'benefits' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('benefits')}
          >
            {t('rubberProcessOil.tabs.benefits')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'packaging' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('packaging')}
          >
            {t('rubberProcessOil.tabs.packaging')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          {activeTab === 'overview' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('rubberProcessOil.overview.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('rubberProcessOil.overview.description1')}
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('rubberProcessOil.overview.description2')}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.overview.keyFeatures')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-flask"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('rubberProcessOil.overview.feature1.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('rubberProcessOil.overview.feature1.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-certificate"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('rubberProcessOil.overview.feature2.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('rubberProcessOil.overview.feature2.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-temperature-low"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('rubberProcessOil.overview.feature3.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('rubberProcessOil.overview.feature3.description')}</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                      <div className="text-[#D4AF37] text-2xl mb-2">
                        <i className="fa-solid fa-shield-alt"></i>
                      </div>
                      <h4 className="font-semibold text-[#222222] mb-1">{t('rubberProcessOil.overview.feature4.title')}</h4>
                      <p className="text-sm text-[#333333]">{t('rubberProcessOil.overview.feature4.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact"
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold text-center hover:bg-opacity-90 transition-all"
                  >
                    {t('rubberProcessOil.overview.requestQuote')}
                  </Link>
                  <Link 
                    to="#"
                    className="inline-block bg-white border-2 border-[#003366] text-[#003366] px-6 py-3 rounded-sm font-semibold text-center hover:bg-[#003366] hover:text-white transition-all"
                  >
                    {t('rubberProcessOil.overview.downloadDatasheet')}
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rubber%20processing%20plant%20interior%2C%20industrial%20cinematic%20style&sign=4bc156e85f82f0f7cdc6ff8b452a4e06" 
                    alt={t('rubberProcessOil.hero.title')} 
                    className="w-full h-auto rounded-sm"
                  />
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rubber%20compound%20testing%20in%20laboratory%2C%20industrial%20cinematic%20style&sign=336267effe37f95f6b355a884b288458" 
                    alt={t('rubberProcessOil.hero.title')} 
                    className="w-full h-auto rounded-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('rubberProcessOil.specifications.title')}
              </h2>
              
              <div className="mb-8">
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('rubberProcessOil.specifications.description')}
                </p>
                
                {/* Table with horizontal scroll for mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#003366] text-white">
                        <th className="p-4 text-left font-semibold">{t('rubberProcessOil.specifications.table.grade')}</th>
                        <th className="p-4 text-left font-semibold">{t('rubberProcessOil.specifications.table.application')}</th>
                        <th className="p-4 text-left font-semibold">{t('rubberProcessOil.specifications.table.solvency')}</th>
                        <th className="p-4 text-left font-semibold">{t('rubberProcessOil.specifications.table.viscosity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white hover:bg-[#E8EBF2] transition-colors">
                        <td className="p-4 border-t border-gray-200 font-semibold">{t('rubberProcessOil.specifications.grades.4006.name')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4006.application')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4006.solvency')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4006.viscosity')}</td>
                      </tr>
                      <tr className="bg-[#F4F6F9] hover:bg-[#E8EBF2] transition-colors">
                        <td className="p-4 border-t border-gray-200 font-semibold">{t('rubberProcessOil.specifications.grades.4010.name')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4010.application')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4010.solvency')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4010.viscosity')}</td>
                      </tr>
                      <tr className="bg-white hover:bg-[#E8EBF2] transition-colors">
                        <td className="p-4 border-t border-gray-200 font-semibold">{t('rubberProcessOil.specifications.grades.4016.name')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4016.application')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4016.solvency')}</td>
                        <td className="p-4 border-t border-gray-200">{t('rubberProcessOil.specifications.grades.4016.viscosity')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.specifications.technical.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.baseOilType')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.baseOilValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.flashPoint')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.flashPointValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.pourPoint')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.pourPointValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.anilinePoint')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.anilinePointValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.sulfurContent')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.sulfurContentValue')}</span>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.color')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.colorValue')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#333333]">{t('rubberProcessOil.specifications.technical.density')}</span>
                      <span className="font-semibold">{t('rubberProcessOil.specifications.technical.densityValue')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.specifications.regulatory.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.0')}</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.1')}</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.2')}</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.3')}</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.4')}</span>
                    </li>
                    <li className="flex items-center pb-2 border-b border-gray-100">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.5')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check-circle text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.specifications.regulatory.items.6')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('rubberProcessOil.applications.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('rubberProcessOil.applications.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Shoe%20soles%20manufacturing%20process%2C%20industrial%20cinematic%20style&sign=608cb882763e05a544d7b81c14f04064" 
                      alt={t('rubberProcessOil.applications.categories.shoeSoles.name')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.applications.categories.shoeSoles.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('rubberProcessOil.applications.categories.shoeSoles.description')}
                  </p>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('rubberProcessOil.applications.categories.shoeSoles.grade')}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Tire%20manufacturing%20plant%2C%20industrial%20cinematic%20style&sign=59565037b7918f9173645ed6277b866f" 
                      alt={t('rubberProcessOil.applications.categories.tires.name')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.applications.categories.tires.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('rubberProcessOil.applications.categories.tires.description')}
                  </p>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('rubberProcessOil.applications.categories.tires.grade')}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Conveyor%20belts%20in%20factory%2C%20industrial%20cinematic%20style&sign=3e89dbb35adb58ddfa95f988f4877a1e" 
                      alt={t('rubberProcessOil.applications.categories.industrialBelts.name')} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.applications.categories.industrialBelts.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">
                    {t('rubberProcessOil.applications.categories.industrialBelts.description')}
                  </p>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    {t('rubberProcessOil.applications.categories.industrialBelts.grade')}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('rubberProcessOil.applications.otherApplications.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-gasket"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('rubberProcessOil.applications.otherApplications.items.sealsGaskets.name')}</h4>
                      <p className="text-[#333333]">{t('rubberProcessOil.applications.otherApplications.items.sealsGaskets.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-plug"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('rubberProcessOil.applications.otherApplications.items.cableInsulation.name')}</h4>
                      <p className="text-[#333333]">{t('rubberProcessOil.applications.otherApplications.items.cableInsulation.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-car"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('rubberProcessOil.applications.otherApplications.items.automotiveComponents.name')}</h4>
                      <p className="text-[#333333]">{t('rubberProcessOil.applications.otherApplications.items.automotiveComponents.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-home"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('rubberProcessOil.applications.otherApplications.items.buildingConstruction.name')}</h4>
                      <p className="text-[#333333]">{t('rubberProcessOil.applications.otherApplications.items.buildingConstruction.description')}</p>
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
                  {t('rubberProcessOil.benefits.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('rubberProcessOil.benefits.description')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-gauge-high"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('rubberProcessOil.benefits.items.superiorProcessing.title')}</h3>
                      <p className="text-[#333333]">{t('rubberProcessOil.benefits.items.superiorProcessing.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-leaf"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('rubberProcessOil.benefits.items.environmentallyFriendly.title')}</h3>
                      <p className="text-[#333333]">{t('rubberProcessOil.benefits.items.environmentallyFriendly.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('rubberProcessOil.benefits.items.costEffective.title')}</h3>
                      <p className="text-[#333333]">{t('rubberProcessOil.benefits.items.costEffective.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#D4AF37] text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">{t('rubberProcessOil.benefits.items.consistentQuality.title')}</h3>
                      <p className="text-[#333333]">{t('rubberProcessOil.benefits.items.consistentQuality.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.benefits.processingAdvantages.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.processingAdvantages.items.0')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.processingAdvantages.items.1')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.processingAdvantages.items.2')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.processingAdvantages.items.3')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.processingAdvantages.items.4')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.benefits.endProductImprovements.title')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.endProductImprovements.items.0')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.endProductImprovements.items.1')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.endProductImprovements.items.2')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.endProductImprovements.items.3')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                      <span>{t('rubberProcessOil.benefits.endProductImprovements.items.4')}</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to="/contact"
                      className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      {t('rubberProcessOil.benefits.cta')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'packaging' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('rubberProcessOil.packaging.title')}
              </h2>
              
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('rubberProcessOil.packaging.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=18L%20plastic%20bucket%20of%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=498e49068aa8b9d3e17a3028bd8f8ff5" 
                      alt={t('rubberProcessOil.packaging.options.buckets.18l.name')}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.packaging.options.buckets.18l.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">{t('rubberProcessOil.packaging.options.buckets.18l.description')}</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    {t('rubberProcessOil.packaging.options.buckets.18l.capacity')}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=200L%20steel%20drum%20of%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=a16ddc357774afca14dfa168dd91d917" 
                      alt={t('rubberProcessOil.packaging.options.drums.200l.name')}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.packaging.options.drums.200l.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">{t('rubberProcessOil.packaging.options.drums.200l.description')}</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    {t('rubberProcessOil.packaging.options.drums.200l.capacity')}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm text-center">
                  <div className="h-48 mb-4 flex items-center justify-center">
                    <img 
                      src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=1000L%20IBC%20tank%20of%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=2c1bcb354709017a29d33a855ba70371" 
                      alt={t('rubberProcessOil.packaging.options.ibc.1000l.name')}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">
                    {t('rubberProcessOil.packaging.options.ibc.1000l.name')}
                  </h3>
                  <p className="text-[#333333] mb-4">{t('rubberProcessOil.packaging.options.ibc.1000l.description')}</p>
                  <div className="text-lg font-semibold text-[#D4AF37]">
                    {t('rubberProcessOil.packaging.options.ibc.1000l.capacity')}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                  {t('rubberProcessOil.packaging.bulkDelivery.title')}
                </h3>
                <p className="text-[#333333] mb-6">
                  {t('rubberProcessOil.packaging.bulkDelivery.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-tanker"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('rubberProcessOil.packaging.bulkDelivery.options.tankerTrucks.name')}</h4>
                      <p className="text-[#333333]">{t('rubberProcessOil.packaging.bulkDelivery.options.tankerTrucks.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] text-2xl mr-4 mt-1">
                      <i className="fa-solid fa-ship"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#222222] mb-1">{t('rubberProcessOil.packaging.bulkDelivery.options.isoTanks.name')}</h4>
                      <p className="text-[#333333]">{t('rubberProcessOil.packaging.bulkDelivery.options.isoTanks.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/logistics"
                    className="inline-block bg-[#003366] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    {t('rubberProcessOil.packaging.bulkDelivery.cta')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#003366] font-['Montserrat']">
            {t('rubberProcessOil.relatedProducts.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Transformer%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=824699da089ce9e551d24ae9c46f9496" 
                alt={t('rubberProcessOil.relatedProducts.transformerOil.name')} 
                className="w-24 h-24 object-cover rounded-sm"
              /><div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  {t('rubberProcessOil.relatedProducts.transformerOil.series')}
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  {t('rubberProcessOil.relatedProducts.transformerOil.name')}
                </h3>
                <p className="text-[#333333] mb-4">
                  {t('rubberProcessOil.relatedProducts.transformerOil.description')}
                </p>
                <Link 
                  to="/products/transformer-oil"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  {t('rubberProcessOil.relatedProducts.viewProduct')} <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-[#F4F6F9] p-6 rounded-sm transition-all hover:shadow-lg flex items-center gap-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Hydraulic%20oil%20product%20shot%2C%20industrial%20cinematic%20style&sign=d4a95ae5a02fd7828ee311313c00e1e8" 
                alt={t('rubberProcessOil.relatedProducts.hydraulicOil.name')} 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="flex-grow">
                <div className="text-sm text-[#D4AF37] font-semibold mb-1">
                  {t('rubberProcessOil.relatedProducts.hydraulicOil.series')}
                </div>
                <h3 className="text-xl font-bold text-[#003366] font-['Montserrat'] mb-2">
                  {t('rubberProcessOil.relatedProducts.hydraulicOil.name')}
                </h3>
                <p className="text-[#333333] mb-4">
                  {t('rubberProcessOil.relatedProducts.hydraulicOil.description')}
                </p>
                <Link 
                  to="/products/finished-lubricants"
                  className="text-[#003366] font-semibold hover:underline"
                >
                  {t('rubberProcessOil.relatedProducts.viewProduct')} <i className="fa-solid fa-arrow-right ml-1 text-sm"></i>
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
          <span>{t('rubberProcessOil.mobileFooter.contactUs')}</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>{t('rubberProcessOil.mobileFooter.whatsapp')}</span>
        </a>
      </div>
    </div>
  );
};

export default RubberProcessOil;
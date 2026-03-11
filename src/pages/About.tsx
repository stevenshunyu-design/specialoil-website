import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSEO from '@/hooks/useSEO';

const About = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('story');
  
  // Initialize SEO for this page
  useSEO('about');
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=China%20special%20oil%20supply%20chain%20logistics%2C%20container%20terminal%2C%20industrial%20cinematic%20style%2C%20high%20contrast&sign=20fc27cc019828efd55ec3d6241a91db" 
              alt="China Special Oil Supply Chain" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight">
                {t('about.hero.title')}
              </h1>
            </div>
          </div>
        </section>
        
        {/* Navigation Tabs */}
        <div className="mb-12 flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'story' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('story')}
          >
            {t('about.tabs.story')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'supply-chain' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('supply-chain')}
          >
            {t('about.tabs.supplyChain')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'quality' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('quality')}
          >
            {t('about.tabs.qualityControl')}
          </button>
          <button
            className={`py-4 px-6 font-semibold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'global' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] -mb-[1px]' 
                : 'text-[#333333] hover:text-[#003366]'
            }`}
            onClick={() => setActiveTab('global')}
          >
            {t('about.tabs.globalMarkets')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm">
          {activeTab === 'story' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                 <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('about.story.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('about.story.p1')}
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('about.story.p2')}
                </p>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('about.story.p3')}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">15+</div>
                    <div className="text-[#333333]">{t('about.story.stat1')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">50+</div>
                    <div className="text-[#333333]">{t('about.story.stat2')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">10k+</div>
                    <div className="text-[#333333]">{t('about.story.stat3')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-sm text-center">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">20+</div>
                    <div className="text-[#333333]">{t('about.story.stat4')}</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=China%20oil%20refinery%20with%20modern%20technology%2C%20industrial%20cinematic%20style&sign=24373ebd131ea32d9f5b84c0eaabeca9" 
                  alt="Modern Chinese refinery" 
                  className="w-full h-auto rounded-sm mb-6"
                />
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=International%20business%20team%20working%20together%2C%20industrial%20cinematic%20style&sign=292d3f52b092f6a0b42599148e5bbfe9" 
                  alt="Our international team" 
                  className="w-full h-auto rounded-sm"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'supply-chain' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Bohai%20Bay%20offshore%20oil%20platform%2C%20Suizhong%2036-1%20oilfield%2C%20industrial%20cinematic%20style&sign=89d170a2b1d9901f57812c5b2223421d" 
                  alt="Supply Chain Operations" 
                  className="w-full h-auto rounded-sm mb-6"
                />
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Supply%20chain%20logistics%20process%20flow%20chart%2C%20industrial%20style&sign=61f21c3313e4658415c053fa1390019a" 
                  alt="Supply Chain Flow" 
                  className="w-full h-auto rounded-sm"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('about.supplyChain.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('about.supplyChain.intro')}
                </p>
                
                <div className="relative pl-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#D4AF37]">
                  <div className="mb-8 relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">1</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">{t('about.supplyChain.step1Title')}</h3>
                  <p className="text-[#333333]">{t('about.supplyChain.step1Desc')}</p>
                  
                  <div className="mb-8 relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">2</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">{t('about.supplyChain.step2Title')}</h3>
                  <p className="text-[#333333]">{t('about.supplyChain.step2Desc')}</p>
                  
                  <div className="mb-8 relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">3</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">{t('about.supplyChain.step3Title')}</h3>
                  <p className="text-[#333333]">{t('about.supplyChain.step3Desc')}</p>
                  
                  <div className="relative before:content-[''] before:absolute before:left-[-44px] before:top-0 before:w-8 before:h-8 before:rounded-full before:bg-[#003366] before:flex before:items-center before:justify-center before:text-white">4</div>
                  <h3 className="text-xl font-semibold text-[#222222] mb-2">{t('about.supplyChain.step4Title')}</h3>
                  <p className="text-[#333333]">{t('about.supplyChain.step4Desc')}</p>
                </div>
                
                <div className="mt-8">
                  <a 
                    href="/logistics" 
                    className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    {t('about.supplyChain.learnMore')}
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'quality' && (
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                  {t('about.quality.title')}
                </h2>
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {t('about.quality.intro')}
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-white p-6 rounded-sm">
                    <h3 className="text-xl font-semibold text-[#222222] mb-4 flex items-center">
                      <i className="fa-solid fa-flask text-[#D4AF37] mr-3"></i>
                      {t('about.quality.lab.title')}
                    </h3>
                    <p className="text-[#333333] mb-4">{t('about.quality.lab.intro')}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{t('about.quality.lab.item1')}</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{t('about.quality.lab.item2')}</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{t('about.quality.lab.item3')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-sm">
                    <h3 className="text-xl font-semibold text-[#222222] mb-4 flex items-center">
                      <i className="fa-solid fa-clipboard-check text-[#D4AF37] mr-3"></i>
                      {t('about.quality.inspection.title')}
                    </h3>
                    <p className="text-[#333333] mb-4">{t('about.quality.inspection.intro')}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{t('about.quality.inspection.item1')}</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{t('about.quality.inspection.item2')}</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fa-solid fa-check text-[#D4AF37] mr-3"></i>
                        <span>{t('about.quality.inspection.item3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <a 
                  href="/quality" 
                  className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                >
                  {t('about.quality.viewDetails')}
                </a>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Advanced%20laboratory%20for%20oil%20testing%2C%20industrial%20cinematic%20style&sign=dc5437f0d815b47d8c107804641683a8" 
                  alt="Quality Testing Lab" 
                  className="w-full h-auto rounded-sm mb-6"
                />
                <div className="bg-white p-6 rounded-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">
                    {t('about.quality.certifications.title')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">ISO 9001</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">ISO 14001</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">EU REACH</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">ASTM</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">DIN</div>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-sm">
                      <i className="fa-solid fa-certificate text-4xl text-[#D4AF37] mb-3"></i>
                      <div className="font-semibold">GB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'global' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('about.global.title')}
              </h2>
              <p className="text-[#333333] mb-8 leading-relaxed">
                {t('about.global.intro')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-4xl mb-4">
                    <i className="fa-solid fa-map-marker-alt"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">{t('about.global.distribution.title')}</h3>
                  <p className="text-[#333333]">{t('about.global.distribution.desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                   <div className="text-[#D4AF37] text-4xl mb-4">
                    <i className="fa-solid fa-language"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">{t('about.global.support.title')}</h3>
                  <p className="text-[#333333]">{t('about.global.support.desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="text-[#D4AF37] text-4xl mb-4">
                    <i className="fa-solid fa-ship"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#003366] font-['Montserrat']">{t('about.global.shipping.title')}</h3>
                  <p className="text-[#333333]">{t('about.global.shipping.desc')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">{t('about.global.markets.title')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>{t('about.global.markets.europe')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>{t('about.global.markets.northAmerica')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>{t('about.global.markets.middleEast')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>{t('about.global.markets.southeastAsia')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>{t('about.global.markets.africa')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-arrow-right text-[#D4AF37] mr-3"></i>
                      <span>{t('about.global.markets.southAmerica')}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-[#003366] font-['Montserrat']">{t('about.global.testimonials.title')}</h3>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <div className="text-[#D4AF37] mb-2">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p className="text-[#333333] mb-3 italic">"{t('about.global.testimonials.quote1')}"</p>
                      <div className="font-semibold">— {t('about.global.testimonials.author1')}</div>
                    </div>
                    <div>
                      <div className="text-[#D4AF37] mb-2">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p className="text-[#333333] mb-3 italic">"{t('about.global.testimonials.quote2')}"</p>
                      <div className="font-semibold">— {t('about.global.testimonials.author2')}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80 rounded-sm overflow-hidden">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=World%20map%20highlighting%20China%20export%20routes%2C%20industrial%20style&sign=ac7d91dd81e1fbe8a456ae4218c6cfed" 
                  alt="Global Export Map" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>{t('common.contactUs')}</span>
        </a>
        <a href="https://wa.me/8613793280176" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default About;

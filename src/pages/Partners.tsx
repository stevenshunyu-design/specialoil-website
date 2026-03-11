import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSEO from '@/hooks/useSEO';

const Partners = () => {
  const { t } = useTranslation();
  
  // Initialize SEO for this page
  useSEO('partners');
  
  // 合作伙伴数据 - 使用翻译
  const partners = [
    {
      id: 1,
      name: t('partners.partners.petrochina.name'),
      chineseName: t('partners.partners.petrochina.chineseName'),
      fullName: t('partners.partners.petrochina.fullName'),
      logo: 'https://coze-coding-project.tos.coze.site/coze_storage_7614051249499078666/proxy_e3d5d347?sign=1804577395-b0e0a0060d-0-240563949ddd2996bda588cd203a569e1ce40effd0584699ec4292d76761edec',
      website: 'https://www.petrochina.com.cn',
      description: t('partners.partners.petrochina.description'),
      products: t('partners.partners.petrochina.products', { returnObjects: true }) as string[],
      established: t('partners.partners.petrochina.established'),
      headquarters: t('partners.partners.petrochina.headquarters')
    },
    {
      id: 2,
      name: t('partners.partners.sinopec.name'),
      chineseName: t('partners.partners.sinopec.chineseName'),
      fullName: t('partners.partners.sinopec.fullName'),
      logo: 'https://coze-coding-project.tos.coze.site/coze_storage_7614051249499078666/proxy_68f0221f?sign=1804577396-2eac144ddd-0-839eaca03d35fdddcd1c531b04ba52d8481eeb4036aa7528508e39a96ea0b34f',
      website: 'https://www.sinopec.com',
      description: t('partners.partners.sinopec.description'),
      products: t('partners.partners.sinopec.products', { returnObjects: true }) as string[],
      established: t('partners.partners.sinopec.established'),
      headquarters: t('partners.partners.sinopec.headquarters')
    },
    {
      id: 3,
      name: t('partners.partners.cnooc.name'),
      chineseName: t('partners.partners.cnooc.chineseName'),
      fullName: t('partners.partners.cnooc.fullName'),
      logo: 'https://coze-coding-project.tos.coze.site/coze_storage_7614051249499078666/partners/cnooc_a36fc693.png?sign=1804576757-38e8a2ed30-0-49472ce53a49e2446d75297ab65d3603799d86c349905641e12c0bf99bd36111',
      website: 'https://www.cnooc.com.cn',
      description: t('partners.partners.cnooc.description'),
      products: t('partners.partners.cnooc.products', { returnObjects: true }) as string[],
      established: t('partners.partners.cnooc.established'),
      headquarters: t('partners.partners.cnooc.headquarters')
    },
    {
      id: 4,
      name: t('partners.partners.yanchang.name'),
      chineseName: t('partners.partners.yanchang.chineseName'),
      fullName: t('partners.partners.yanchang.fullName'),
      logo: 'https://coze-coding-project.tos.coze.site/coze_storage_7614051249499078666/proxy_0ca6bd67?sign=1804577397-b639af4867-0-1d40218054f985039c528fdf48494b9b4dfb45a8d1dc04494fb50bdee43095e2',
      website: 'https://www.sxycpc.com',
      description: t('partners.partners.yanchang.description'),
      products: t('partners.partners.yanchang.products', { returnObjects: true }) as string[],
      established: t('partners.partners.yanchang.established'),
      headquarters: t('partners.partners.yanchang.headquarters')
    },
    {
      id: 5,
      name: t('partners.partners.sinochem.name'),
      chineseName: t('partners.partners.sinochem.chineseName'),
      fullName: t('partners.partners.sinochem.fullName'),
      logo: 'https://coze-coding-project.tos.coze.site/coze_storage_7614051249499078666/proxy_66e0227a?sign=1804577396-b19d788c30-0-ee1a0b9a68c32a95e8ef72643c346641bde09aabf516df2ed4608c300bd03493',
      website: 'https://www.sinochem.com',
      description: t('partners.partners.sinochem.description'),
      products: t('partners.partners.sinochem.products', { returnObjects: true }) as string[],
      established: t('partners.partners.sinochem.established'),
      headquarters: t('partners.partners.sinochem.headquarters')
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-80 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#003366]/70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop" 
              alt={t('partners.hero.title')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Montserrat']">
                  {t('partners.hero.title')}
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto px-4">
                  {t('partners.hero.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#003366] mb-6 font-['Montserrat']">
              {t('partners.intro.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {t('partners.intro.description')}
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-[#D4AF37]"></i>
                <span>{t('partners.intro.qualityAssured')}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-[#D4AF37]"></i>
                <span>{t('partners.intro.directSourcing')}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-[#D4AF37]"></i>
                <span>{t('partners.intro.reliableSupply')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                {/* Logo Area */}
                <div className="h-40 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                  <img 
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-24 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-20 h-20 rounded-full bg-[#003366] flex items-center justify-center">
                          <span class="text-white text-lg font-bold">${partner.name.substring(0, 3)}</span>
                        </div>
                      `;
                    }}
                  />
                </div>
                
                {/* Info Area */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-[#003366]">{partner.name}</h3>
                    <span className="text-sm text-gray-500">{partner.chineseName}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{partner.fullName}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{partner.description}</p>
                  
                  {/* Products Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {partner.products.slice(0, 3).map((product, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 bg-[#F4F6F9] text-[#003366] rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                    {partner.products.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full">
                        +{partner.products.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span><i className="fa-solid fa-location-dot mr-1"></i>{partner.headquarters}</span>
                    <span>Est. {partner.established}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Our Partners */}
        <section className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#003366] mb-8 text-center font-['Montserrat']">
            {t('partners.whyChooseUs.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-handshake text-2xl text-white"></i>
              </div>
              <h3 className="font-bold text-lg text-[#003366] mb-2">{t('partners.whyChooseUs.partnership.title')}</h3>
              <p className="text-gray-600">
                {t('partners.whyChooseUs.partnership.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-globe text-2xl text-white"></i>
              </div>
              <h3 className="font-bold text-lg text-[#003366] mb-2">{t('partners.whyChooseUs.globalAccess.title')}</h3>
              <p className="text-gray-600">
                {t('partners.whyChooseUs.globalAccess.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-award text-2xl text-white"></i>
              </div>
              <h3 className="font-bold text-lg text-[#003366] mb-2">{t('partners.whyChooseUs.standards.title')}</h3>
              <p className="text-gray-600">
                {t('partners.whyChooseUs.standards.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#003366] mb-8 text-center font-['Montserrat']">
            {t('partners.certifications.title')}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {(t('partners.certifications.items', { returnObjects: true }) as string[]).map((cert, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
              >
                <i className="fa-solid fa-certificate text-[#D4AF37]"></i>
                <span className="font-medium text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#003366] to-[#004080] rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-['Montserrat']">
            {t('partners.cta.title')}
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {t('partners.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#c9a432] transition-all"
            >
              <i className="fa-solid fa-envelope"></i>
              {t('partners.cta.contactButton')}
            </Link>
            <Link 
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              <i className="fa-solid fa-box"></i>
              {t('partners.cta.viewProducts')}
            </Link>
          </div>
        </section>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex shadow-lg">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center font-medium">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>{t('partners.mobile.call')}</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center font-medium">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>{t('partners.mobile.whatsapp')}</span>
        </a>
      </div>
    </div>
  );
};

export default Partners;

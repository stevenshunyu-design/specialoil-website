import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSEO from '@/hooks/useSEO';

const Products = () => {
  const { t } = useTranslation();
  
  // Initialize SEO for this page
  useSEO('products');
  
  const productCategories = [
    {
      id: 1,
      name: t('products.categories.transformer.title'),
      brand: "SpecVolt™ Series",
      description: t('products.categories.transformer.description'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=High%20voltage%20substation%20night%20scene%2C%20transformer%20oil%20application%2C%20industrial%20cinematic%20style&sign=19d76e3848b30fa9653f475f2f81548c",
      features: [
        t('products.features.zeroCorrosive', 'Zero Corrosive Sulfur'),
        t('products.features.arcticReliability', 'Arctic Reliability (-45°C)'),
        t('products.features.highDielectric', 'High Dielectric Strength'),
        t('products.features.astmCompliant', 'ASTM D3487 Compliant')
      ],
      link: "/products/transformer-oil"
    },
    {
      id: 2,
      name: t('products.categories.rubber.title'),
      brand: "SpecFlex™ Series",
      description: t('products.categories.rubber.description'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Black%20tire%20macro%20texture%20with%20golden%20oil%20flow%2C%20rubber%20process%20oil%2C%20industrial%20cinematic%20style&sign=c976f81101f6ee1607c0bd9d1d6ae29c",
      features: [
        t('products.features.cnContent', 'Cn% > 35%'),
        t('products.features.euReach', 'EU REACH Compliant'),
        t('products.features.lowPah', 'Low PAHs'),
        t('products.features.excellentCompat', 'Excellent Compatibility')
      ],
      link: "/products/rubber-process-oil"
    },
    {
      id: 3,
      name: t('products.categories.lubricants.title'),
      brand: "SpecLube™ Series",
      description: t('products.categories.lubricants.description'),
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Hydraulic%20system%20close%20up%2C%20finished%20lubricants%2C%20industrial%20cinematic%20style&sign=caf8afa1997dfaf80a075b52078cd58a",
      features: [
        t('products.features.isoGrades', 'ISO 68/46/32 Grades'),
        t('products.features.dinCompliant', 'DIN 51524 Compliant'),
        t('products.features.antiWear', 'Anti-Wear Protection'),
        t('products.features.wideTemp', 'Wide Temperature Range')
      ],
      link: "/products/finished-lubricants"
    }
  ];

  const chinaAdvantages = [
    { icon: "fa-tags", title: t('products.advantages.pricing') },
    { icon: "fa-microchip", title: t('products.advantages.technology') },
    { icon: "fa-users", title: t('products.advantages.workforce') },
    { icon: "fa-network-wired", title: t('products.advantages.supplyChain') }
  ];

  const standards = [
    { title: "ISO 9001", desc: t('products.standards.iso9001') },
    { title: "ISO 14001", desc: t('products.standards.iso14001') },
    { title: "EU REACH", desc: t('products.standards.reach') },
    { title: "ASTM / DIN", desc: t('products.standards.astm') }
  ];

  const stats = [
    { title: t('products.stats.capacity.title'), value: "200,000+", unit: t('products.stats.capacity.unit'), desc: t('products.stats.capacity.desc') },
    { title: t('products.stats.qc.title'), value: "100%", unit: t('products.stats.qc.unit'), desc: t('products.stats.qc.desc') },
    { title: t('products.stats.export.title'), value: "50+", unit: t('products.stats.export.unit'), desc: t('products.stats.export.desc') }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-white)] pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="relative h-[500px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-900)]/90 via-[var(--primary-800)]/80 to-transparent z-10"></div>
            <img
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Chinese%20special%20oil%20product%20range%2C%20factory%20exterior%2C%20industrial%20cinematic%20style&sign=8dc2b0f7876a82fe71cd8f4c18f087ab"
              alt="China Special Oil Product Range"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center p-6">
              <div className="max-w-3xl">
                <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-4 block font-medium">
                  {t('products.hero.tag')}
                </span>
                <h1 className="font-display text-5xl md:text-6xl font-semibold mb-6 text-white leading-tight">
                  {t('products.hero.title')}
                </h1>
                <p className="font-body text-lg text-white/80 leading-relaxed max-w-2xl">
                  {t('products.hero.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Chinese Special Oils Banner */}
        <section className="mb-20 bg-[var(--primary-900)] text-white p-12 rounded-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-600)] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                {t('products.whyChina.title')}
              </h2>
              <p className="font-body text-white/80 mb-8 leading-relaxed">
                {t('products.whyChina.desc')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {chinaAdvantages.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-[var(--accent-600)] rounded-sm mr-4">
                      <i className={`fa-solid ${item.icon} text-white`}></i>
                    </div>
                    <span className="font-body font-medium text-white">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <Link
                to="/about"
                className="inline-block bg-white text-[var(--primary-900)] px-8 py-4 rounded-sm font-medium hover:bg-[var(--primary-100)] transition-all duration-300 text-center uppercase tracking-wider text-sm"
              >
                {t('products.whyChina.learnMore')}
              </Link>
              <Link
                to="/contact"
                className="inline-block bg-[var(--accent-600)] text-white px-8 py-4 rounded-sm font-medium hover:bg-[var(--accent-700)] transition-all duration-300 text-center uppercase tracking-wider text-sm"
              >
                {t('products.whyChina.getQuote')}
              </Link>
            </div>
          </div>
        </section>
        
        {/* Product Categories */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
              {t('products.ourProducts')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-[var(--text-dark)]">
              {t('products.rangeTitle')}
            </h2>
            <p className="font-body text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              {t('products.rangeDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category) => (
              <div
                key={category.id}
                className="bg-[var(--bg-light)] overflow-hidden transition-all duration-300 hover:shadow-xl group"
              >
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-900)]/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="font-mono text-[var(--accent-600)] text-xs uppercase tracking-wider mb-3 font-medium">
                    {category.brand}
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--text-dark)]">
                    {category.name}
                  </h3>
                  <p className="font-body text-[var(--text-body)] mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-body font-semibold text-[var(--text-dark)] mb-4 uppercase text-xs tracking-wider">
                      {t('products.keyFeatures')}:
                    </h4>
                    <ul className="space-y-3">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="flex items-center justify-center w-5 h-5 bg-[var(--accent-600)] rounded-sm mr-3 flex-shrink-0">
                            <i className="fa-solid fa-check text-white text-xs"></i>
                          </div>
                          <span className="font-body text-[var(--text-body)] text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={category.link}
                    className="inline-block bg-[var(--primary-900)] text-white px-6 py-4 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 w-full text-center uppercase tracking-wider text-sm"
                  >
                    {t('products.viewSpecs')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Standards & Certifications */}
        <section className="bg-[var(--bg-light)] p-12 rounded-sm mb-20">
          <div className="text-center mb-16">
            <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
              {t('products.compliance.tag')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-[var(--text-dark)]">
              {t('products.compliance.title')}
            </h2>

            <p className="font-body text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              {t('products.compliance.desc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {standards.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-sm text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-[var(--accent-600)] text-5xl mb-4">
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-[var(--text-dark)]">
                  {item.title}
                </h3>
                <p className="font-body text-[var(--text-muted)] text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-display text-xl font-semibold mb-6 text-[var(--text-dark)]">
                  {item.title}
                </h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="font-mono text-5xl font-bold text-[var(--accent-600)] mb-2">{item.value}</div>
                    <div className="font-body text-[var(--text-muted)]">{item.unit}</div>
                  </div>
                </div>
                <p className="font-body text-[var(--text-muted)] text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Product Brochure CTA */}
        <section className="text-center mb-16 bg-white p-12 border border-[var(--primary-200)] rounded-sm">
          <span className="font-mono text-[var(--accent-600)] text-sm uppercase tracking-wider mb-3 block font-medium">
            {t('products.brochure.tag')}
          </span>
          <h2 className="font-display text-3xl font-semibold mb-4 text-[var(--text-dark)]">
            {t('products.brochure.title')}
          </h2>
          <p className="font-body text-[var(--text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('products.brochure.desc')}
          </p>
          <a
            href="#"
            className="inline-block bg-[var(--primary-900)] text-white px-10 py-4 rounded-sm font-medium hover:bg-[var(--primary-800)] transition-all duration-300 uppercase tracking-wider text-sm"
          >
            <i className="fa-solid fa-download mr-2"></i> {t('products.brochure.button')}
          </a>
        </section>

        {/* Inquiry CTA */}
        <section className="bg-[var(--accent-600)] text-white p-12 rounded-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                {t('products.cta.title')}
              </h2>
              <p className="font-body text-white/90 leading-relaxed">
                {t('products.cta.desc')}
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-block bg-white text-[var(--primary-900)] px-10 py-4 rounded-sm font-medium hover:bg-[var(--primary-100)] transition-all duration-300 uppercase tracking-wider text-sm whitespace-nowrap"
            >
              {t('products.cta.button')}
            </Link>
          </div>
        </section>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex z-40">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[var(--primary-900)] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span className="font-medium text-sm">{t('products.mobileFooter.call')}</span>
        </a>
        <a href="https://wa.me/8613793280176" className="flex-1 py-4 bg-[var(--accent-600)] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span className="font-medium text-sm">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Products;

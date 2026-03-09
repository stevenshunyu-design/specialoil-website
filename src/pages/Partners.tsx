import { Link } from 'react-router-dom';

// 合作伙伴数据 - 使用真实 Logo 图片
const partners = [
  {
    id: 1,
    name: 'PetroChina',
    chineseName: '中国石油',
    fullName: 'China National Petroleum Corporation',
    logo: '/partners/petrochina.png',
    website: 'https://www.petrochina.com.cn',
    description: 'China\'s largest oil and gas producer and distributor, a global leader in energy production.',
    products: ['Transformer Oil', 'Hydraulic Oil', 'Industrial Lubricants', 'White Oil'],
    established: 1988,
    headquarters: 'Beijing, China'
  },
  {
    id: 2,
    name: 'Sinopec',
    chineseName: '中国石化',
    fullName: 'China Petroleum & Chemical Corporation',
    logo: '/partners/sinopec.png',
    website: 'https://www.sinopec.com',
    description: 'One of the world\'s largest integrated energy and chemical companies, leading in refining capacity.',
    products: ['Transformer Oil', 'Rubber Process Oil', 'TDAE', 'Specialty Oils'],
    established: 2000,
    headquarters: 'Beijing, China'
  },
  {
    id: 3,
    name: 'CNOOC',
    chineseName: '中国海油',
    fullName: 'China National Offshore Oil Corporation',
    logo: 'https://coze-coding-project.tos.coze.site/coze_storage_7614051249499078666/partners/cnooc_a36fc693.png?sign=1804576757-38e8a2ed30-0-49472ce53a49e2446d75297ab65d3603799d86c349905641e12c0bf99bd36111',
    website: 'https://www.cnooc.com.cn',
    description: 'China\'s largest offshore oil and gas producer, specializing in deep-sea exploration and production.',
    products: ['Transformer Oil', 'Marine Lubricants', 'Naphthenic Oils'],
    established: 1982,
    headquarters: 'Beijing, China'
  },
  {
    id: 4,
    name: 'Yanchang Petroleum',
    chineseName: '延长石油',
    fullName: 'Shaanxi Yanchang Petroleum Group',
    logo: '/partners/yanchang.png',
    website: 'https://www.sxycpc.com',
    description: 'One of China\'s oldest oil companies, specializing in oilfield development and petrochemicals.',
    products: ['Industrial Oils', 'Transformer Oil', 'Lubricants'],
    established: 1905,
    headquarters: 'Xi\'an, China'
  },
  {
    id: 5,
    name: 'Sinochem',
    chineseName: '中化集团',
    fullName: 'Sinochem Holdings Corporation',
    logo: '/partners/sinochem.png',
    website: 'https://www.sinochem.com',
    description: 'A leading Chinese conglomerate in agriculture, energy, and chemical sectors.',
    products: ['Specialty Chemicals', 'Industrial Oils', 'Petrochemicals'],
    established: 1950,
    headquarters: 'Beijing, China'
  },
  {
    id: 6,
    name: 'Tongyi Lubricant',
    chineseName: '统一润滑油',
    fullName: 'Tongyi Petrochemical',
    logo: '/partners/tongyi.png',
    website: 'https://www.tongyi.com',
    description: 'A leading independent lubricant brand in China, known for quality and innovation.',
    products: ['Hydraulic Oil', 'Industrial Lubricants', 'Marine Oils', 'Specialty Lubricants'],
    established: 1993,
    headquarters: 'Beijing, China'
  }
];

const Partners = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-80 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#003366]/70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop" 
              alt="Strategic Partners" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Montserrat']">
                  Strategic Partners
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto px-4">
                  Collaborating with China's leading special oil manufacturers to deliver premium quality products
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#003366] mb-6 font-['Montserrat']">
              Our Supply Chain Network
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We have established strong partnerships with China's most reputable special oil manufacturers. 
              These collaborations ensure that we can provide our global customers with consistent, 
              high-quality products that meet international standards.
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-[#D4AF37]"></i>
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-[#D4AF37]"></i>
                <span>Direct Sourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-[#D4AF37]"></i>
                <span>Reliable Supply</span>
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
            Why Our Partners Choose Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-handshake text-2xl text-white"></i>
              </div>
              <h3 className="font-bold text-lg text-[#003366] mb-2">Long-term Partnership</h3>
              <p className="text-gray-600">
                We build lasting relationships with manufacturers, ensuring stable supply chains and consistent quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-globe text-2xl text-white"></i>
              </div>
              <h3 className="font-bold text-lg text-[#003366] mb-2">Global Market Access</h3>
              <p className="text-gray-600">
                We connect Chinese manufacturers with international buyers, expanding their global reach.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-award text-2xl text-white"></i>
              </div>
              <h3 className="font-bold text-lg text-[#003366] mb-2">Quality Standards</h3>
              <p className="text-gray-600">
                All our partners meet strict international quality certifications and standards.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#003366] mb-8 text-center font-['Montserrat']">
            Partner Certifications
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {['ISO 9001', 'ISO 14001', 'ISO 45001', 'API', 'EU REACH', 'ASTM', 'DIN', 'GB Standards'].map((cert, index) => (
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
            Interested in Becoming a Partner?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            We are always looking to expand our network of quality manufacturers. 
            Contact us to discuss partnership opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#c9a432] transition-all"
            >
              <i className="fa-solid fa-envelope"></i>
              Contact Us
            </Link>
            <Link 
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              <i className="fa-solid fa-box"></i>
              View Products
            </Link>
          </div>
        </section>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex shadow-lg">
        <a href="tel:+8612345678910" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center font-medium">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>Call Us</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center font-medium">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Partners;

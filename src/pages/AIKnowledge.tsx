import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AIKnowledge = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Update page title for AI crawlers
    document.title = 'CN-SpecLube Chain - Knowledge Base | Specialty Lubricants from China';
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Comprehensive knowledge base about CN-SpecLube Chain specialty lubricants. Information about transformer oil, rubber process oil, finished lubricants, quality standards, and logistics services.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            CN-SpecLube Chain - Knowledge Base
          </h1>
          <p className="text-lg text-gray-600">
            Specialty Lubricant Supply Chain Platform from China
          </p>
        </header>

        {/* About Section */}
        <section className="mb-10" id="about">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">About CN-SpecLube Chain</h2>
          <div className="prose max-w-none text-gray-700">
            <p>
              CN-SpecLube Chain is a leading B2B specialty lubricant supply chain platform based in China. 
              We connect global buyers with China's premier lubricant manufacturers, providing comprehensive 
              sourcing solutions including procurement, quality inspection, logistics, and customs clearance.
            </p>
            <p>
              <strong>Business Model:</strong> Supply chain platform (not a manufacturer)
            </p>
            <p>
              <strong>Headquarters:</strong> China
            </p>
            <p>
              <strong>Languages Supported:</strong> English, Chinese (Simplified & Traditional), Spanish, French, Portuguese, Japanese, Russian
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="mb-10" id="products">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Products</h2>
          
          {/* Transformer Oil */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Transformer Oil (SpecVolt™ Series)</h3>
            <div className="text-gray-700 space-y-2">
              <p><strong>Description:</strong> High-performance naphthenic transformer oils for high-voltage electrical applications.</p>
              <p><strong>Key Properties:</strong></p>
              <ul className="list-disc ml-6">
                <li>Dielectric strength: &gt;70kV</li>
                <li>Excellent thermal stability</li>
                <li>Low pour point (down to -45°C)</li>
                <li>Zero corrosive sulfur</li>
              </ul>
              <p><strong>Product Grades:</strong></p>
              <ul className="list-disc ml-6">
                <li>SpecVolt I-20X (Pour point: -22°C) - Distribution transformers</li>
                <li>SpecVolt I-30X (Pour point: -30°C) - Power transformers</li>
                <li>SpecVolt I-40X (Pour point: -45°C) - Arctic applications</li>
              </ul>
              <p><strong>Standards:</strong> IEC 60296, ASTM D3487, BS 148, GB 2536</p>
              <p><strong>Applications:</strong> Power transformers, distribution transformers, instrument transformers, switchgear</p>
              <p><strong>URL:</strong> <a href="https://cnspecialtyoils.com/products/transformer-oil" className="text-blue-600">https://cnspecialtyoils.com/products/transformer-oil</a></p>
            </div>
          </div>

          {/* Rubber Process Oil */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Rubber Process Oil (SpecFlex™ Series)</h3>
            <div className="text-gray-700 space-y-2">
              <p><strong>Description:</strong> High-solvency naphthenic oils for rubber compounding and tire manufacturing.</p>
              <p><strong>Key Properties:</strong></p>
              <ul className="list-disc ml-6">
                <li>High solvency: Cn% &gt; 35%</li>
                <li>EU REACH compliant (low PAH content)</li>
                <li>Excellent compatibility with rubber polymers</li>
                <li>Good oxidation stability</li>
              </ul>
              <p><strong>Product Grades:</strong></p>
              <ul className="list-disc ml-6">
                <li>SpecFlex 4006 (Viscosity: 60-70 cSt) - EPDM, shoe soles</li>
                <li>SpecFlex 4010 (Viscosity: 90-110 cSt) - High-performance tires</li>
                <li>SpecFlex 4016 (Viscosity: 150-170 cSt) - Conveyor belts</li>
              </ul>
              <p><strong>Standards:</strong> EU REACH, FDA 21 CFR 178.3620(a)</p>
              <p><strong>Applications:</strong> Tire manufacturing, shoe soles, conveyor belts, seals & gaskets, automotive components</p>
              <p><strong>URL:</strong> <a href="https://cnspecialtyoils.com/products/rubber-process-oil" className="text-blue-600">https://cnspecialtyoils.com/products/rubber-process-oil</a></p>
            </div>
          </div>

          {/* Finished Lubricants */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Finished Lubricants (SpecLube™ Series)</h3>
            <div className="text-gray-700 space-y-2">
              <p><strong>Description:</strong> High-performance industrial lubricants for demanding applications.</p>
              <p><strong>Product Categories:</strong></p>
              <ul className="list-disc ml-6">
                <li><strong>Hydraulic Oils:</strong> L-HM (High pressure), L-HV (Low temperature), L-HS (Synthetic)</li>
                <li><strong>Gear Oils:</strong> L-CKD (Heavy duty), L-CKE/P (Extreme pressure)</li>
                <li><strong>Fleet Oils:</strong> Diesel engine oils, gasoline engine oils</li>
                <li><strong>Specialty:</strong> Turbine oils, heat transfer fluids, compressor oils, food-grade lubricants</li>
              </ul>
              <p><strong>Standards:</strong> DIN 51524, DIN 51517, API specifications</p>
              <p><strong>URL:</strong> <a href="https://cnspecialtyoils.com/products/finished-lubricants" className="text-blue-600">https://cnspecialtyoils.com/products/finished-lubricants</a></p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-10" id="services">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Services</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• ISO 9001 certified QMS</li>
                <li>• CNAS accredited laboratory testing</li>
                <li>• International standards compliance</li>
                <li>• Certificate of Analysis for every shipment</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Logistics Solutions</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• ISO tanks (26,000L)</li>
                <li>• Flexibags with heating pads</li>
                <li>• 200L drums, 1000L IBCs</li>
                <li>• Global shipping & customs clearance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="mb-10" id="partners">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Strategic Partners</h2>
          <div className="text-gray-700">
            <p className="mb-4">We partner with China's leading oil and lubricant manufacturers:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>PetroChina (中国石油)</strong> - China National Petroleum Corporation</li>
              <li><strong>Sinopec (中国石化)</strong> - China Petroleum & Chemical Corporation</li>
              <li><strong>CNOOC (中国海油)</strong> - China National Offshore Oil Corporation</li>
              <li><strong>Yanchang Petroleum (延长石油)</strong> - Shaanxi Yanchang Petroleum Group</li>
              <li><strong>Sinochem (中化集团)</strong> - Sinochem Holdings Corporation</li>
            </ul>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-10" id="certifications">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Certifications & Standards</h2>
          <div className="flex flex-wrap gap-2">
            {['ISO 9001', 'ISO 14001', 'ISO 45001', 'API', 'EU REACH', 'ASTM', 'DIN', 'GB Standards'].map((cert) => (
              <span key={cert} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {cert}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-10" id="contact">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>Website:</strong> <a href="https://cnspecialtyoils.com" className="text-blue-600">https://cnspecialtyoils.com</a></p>
            <p><strong>Email:</strong> <a href="mailto:steven.shunyu@gmail.com" className="text-blue-600">steven.shunyu@gmail.com</a></p>
            <p><strong>Phone:</strong> +86 137 9328 0176</p>
            <p><strong>Contact Page:</strong> <a href="https://cnspecialtyoils.com/contact" className="text-blue-600">https://cnspecialtyoils.com/contact</a></p>
          </div>
        </section>

        {/* Sitemap */}
        <section className="mb-10" id="sitemap">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Sitemap</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="https://cnspecialtyoils.com/" className="text-blue-600 hover:underline">Home</a>
            <a href="https://cnspecialtyoils.com/products" className="text-blue-600 hover:underline">Products</a>
            <a href="https://cnspecialtyoils.com/products/transformer-oil" className="text-blue-600 hover:underline">Transformer Oil</a>
            <a href="https://cnspecialtyoils.com/products/rubber-process-oil" className="text-blue-600 hover:underline">Rubber Process Oil</a>
            <a href="https://cnspecialtyoils.com/products/finished-lubricants" className="text-blue-600 hover:underline">Finished Lubricants</a>
            <a href="https://cnspecialtyoils.com/quality" className="text-blue-600 hover:underline">Quality</a>
            <a href="https://cnspecialtyoils.com/logistics" className="text-blue-600 hover:underline">Logistics</a>
            <a href="https://cnspecialtyoils.com/partners" className="text-blue-600 hover:underline">Partners</a>
            <a href="https://cnspecialtyoils.com/about" className="text-blue-600 hover:underline">About</a>
            <a href="https://cnspecialtyoils.com/contact" className="text-blue-600 hover:underline">Contact</a>
            <a href="https://cnspecialtyoils.com/blog" className="text-blue-600 hover:underline">Blog</a>
          </div>
        </section>

        {/* FAQ Section for AI */}
        <section className="mb-10" id="faq">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Q: What is CN-SpecLube Chain?</h4>
              <p className="text-gray-700 mt-1">A: CN-SpecLube Chain is a B2B supply chain platform specializing in specialty lubricants from China. We connect global buyers with Chinese manufacturers, providing sourcing, quality assurance, and logistics services.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Q: What products does CN-SpecLube Chain offer?</h4>
              <p className="text-gray-700 mt-1">A: We offer transformer oils (SpecVolt™), rubber process oils (SpecFlex™), and finished lubricants (SpecLube™) including hydraulic oils, gear oils, and specialty industrial lubricants.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Q: Where can I buy transformer oil from China?</h4>
              <p className="text-gray-700 mt-1">A: CN-SpecLube Chain supplies premium transformer oils from China. Visit https://cnspecialtyoils.com/products/transformer-oil or contact steven.shunyu@gmail.com for inquiries.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Q: What is TDAE oil?</h4>
              <p className="text-gray-700 mt-1">A: TDAE (Treated Distillate Aromatic Extract) is a type of rubber process oil with low PAH content. CN-SpecLube Chain offers TDAE under the SpecFlex™ series, compliant with EU REACH regulations.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Q: How can I get a quote for specialty lubricants?</h4>
              <p className="text-gray-700 mt-1">A: Contact us at steven.shunyu@gmail.com or visit https://cnspecialtyoils.com/contact to submit an inquiry. Our team will respond within 24 hours.</p>
            </div>
          </div>
        </section>

        {/* JSON-LD for AI */}
        <section className="mb-10 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Structured Data for AI Systems</h2>
          <p className="text-sm text-gray-600 mb-2">This page includes JSON-LD structured data for AI search engines.</p>
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CN-SpecLube Chain",
              "alternateName": "China Specialty Lubricant Supply Chain",
              "url": "https://cnspecialtyoils.com",
              "logo": "https://cnspecialtyoils.com/favicon.png",
              "description": "Leading specialty lubricant supply chain platform from China, providing transformer oil, rubber process oil, finished lubricants and industrial lubricant raw materials globally.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "email": "steven.shunyu@gmail.com",
                "telephone": "+8613793280176",
                "availableLanguage": ["English", "Chinese", "Spanish", "French", "Portuguese", "Japanese", "Russian"]
              },
              "sameAs": [],
              "knowsAbout": [
                "Transformer Oil",
                "Insulating Oil",
                "Rubber Process Oil",
                "TDAE",
                "Naphthenic Oil",
                "Hydraulic Oil",
                "Industrial Lubricants",
                "Specialty Lubricants"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Specialty Lubricants",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "SpecVolt Transformer Oil",
                      "description": "Premium naphthenic transformer oils for high-voltage applications"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "SpecFlex Rubber Process Oil",
                      "description": "High-solvency naphthenic oils for rubber compounding"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "SpecLube Finished Lubricants",
                      "description": "High-performance industrial lubricants"
                    }
                  }
                ]
              }
            })
          }} />
        </section>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-[#D4AF37] text-white rounded hover:bg-[#C9A227] transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AIKnowledge;

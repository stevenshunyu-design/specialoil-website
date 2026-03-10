import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-500">
            <li><Link to="/" className="hover:text-[#003366] transition-colors">Home</Link></li>
            <li className="mx-2"><i className="fa-solid fa-chevron-right text-xs"></i></li>
            <li className="text-[#D4AF37] font-medium">Terms of Service</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#003366] mb-4 font-['Montserrat']">Terms of Service</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to CN-SpecLube Chain. By accessing or using our website cnspecialtyoils.com and our services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our website or services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute a legally binding agreement between you and CN-SpecLube Chain ("Company," "we," "us," or "our") governing your use of our website and services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">2. Description of Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              CN-SpecLube Chain provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Information about industrial lubricants and special oil products from China</li>
              <li>B2B sourcing and procurement services for industrial oils</li>
              <li>Logistics coordination for international shipping</li>
              <li>Quality assurance documentation and certification</li>
              <li>Technical support and product consultation</li>
              <li>Industry news and market insights through our blog</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our services are intended for business-to-business (B2B) purposes and are designed for legitimate commercial entities.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">3. User Accounts and Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our website, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">4. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use our services for any unlawful purpose or in violation of any laws</li>
              <li>Submit false or misleading information in inquiries or orders</li>
              <li>Interfere with or disrupt the operation of our website</li>
              <li>Attempt to gain unauthorized access to our systems or data</li>
              <li>Use automated systems or software to extract data from our website without permission</li>
              <li>Transmit viruses, malware, or any harmful code</li>
              <li>Impersonate any person or entity</li>
              <li>Engage in any activity that could damage our reputation or business relationships</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">5. Orders and Transactions</h2>
            
            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">5.1 Product Inquiries</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All product inquiries submitted through our website are subject to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Product availability and stock levels</li>
              <li>Minimum order quantities as specified by manufacturers</li>
              <li>Verification of buyer credentials and business legitimacy</li>
              <li>Export compliance and regulatory requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">5.2 Pricing and Payment</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Prices quoted are subject to change without notice. Final pricing will be confirmed in the formal quotation document. Payment terms will be specified in the sales contract.
            </p>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">5.3 Shipping and Delivery</h3>
            <p className="text-gray-700 leading-relaxed">
              Shipping terms (Incoterms) will be specified in the quotation and contract. Delivery times are estimates and may vary due to production schedules, logistics, and customs clearance. We are not responsible for delays caused by factors beyond our reasonable control.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of CN-SpecLube Chain or our licensors and is protected by intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Reproduce, modify, or distribute our content without written permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Create derivative works based on our content</li>
              <li>Remove any copyright or proprietary notices from our materials</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Our services are provided "as is" without warranties of any kind</li>
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim</li>
              <li>We are not responsible for the actions of third-party suppliers, manufacturers, or logistics providers</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above may not apply to you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">8. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless CN-SpecLube Chain, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of our services, violation of these Terms, or infringement of any rights of third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">9. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Any disputes arising from these Terms or your use of our services shall be resolved through:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation if negotiation fails</li>
              <li>Arbitration or litigation in accordance with the governing law</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These Terms shall be governed by and construed in accordance with the laws of the People's Republic of China, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">10. Force Majeure</h2>
            <p className="text-gray-700 leading-relaxed">
              We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">11. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">12. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use our services will immediately cease.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">13. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>CN-SpecLube Chain</strong></p>
              <p className="text-gray-700 mb-2">10th Floor, No. 197, Songling Road</p>
              <p className="text-gray-700 mb-2">Laoshan District, Qingdao, Shandong, China</p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:steven.shunyu@gmail.com" className="text-[#003366] hover:text-[#D4AF37]">steven.shunyu@gmail.com</a></p>
              <p className="text-gray-700">Phone: <a href="tel:+8613793280176" className="text-[#003366] hover:text-[#D4AF37]">+86 1379328 0176</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

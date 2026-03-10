import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-500">
            <li><Link to="/" className="hover:text-[#003366] transition-colors">Home</Link></li>
            <li className="mx-2"><i className="fa-solid fa-chevron-right text-xs"></i></li>
            <li className="text-[#D4AF37] font-medium">Privacy Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#003366] mb-4 font-['Montserrat']">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              CN-SpecLube Chain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website cnspecialtyoils.com or use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our website and services, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not access the site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Fill out inquiry forms on our website</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us via email, phone, or social media</li>
              <li>Request product information or quotations</li>
              <li>Register for an account on our platform</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              This information may include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Name and job title</li>
              <li>Company name and business address</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Business information (products of interest, estimated quantities, destination ports)</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device identifiers</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Business Communications:</strong> To respond to your inquiries, provide product information, and send quotations</li>
              <li><strong>Marketing:</strong> To send you our newsletter and promotional materials (with your consent)</li>
              <li><strong>Service Improvement:</strong> To improve our website and services based on user feedback and behavior</li>
              <li><strong>Analytics:</strong> To analyze website usage patterns and optimize user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal requests</li>
              <li><strong>Security:</strong> To protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., email delivery, analytics, cloud storage)</li>
              <li><strong>Business Partners:</strong> With manufacturers and logistics partners to fulfill your product requests</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encryption of data in transit (SSL/TLS)</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request a machine-readable copy of your data</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at <a href="mailto:steven.shunyu@gmail.com" className="text-[#003366] hover:text-[#D4AF37]">steven.shunyu@gmail.com</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When your information is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to these countries. We take appropriate measures to ensure your information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Privacy Policy frequently to stay informed about how we are protecting your information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;

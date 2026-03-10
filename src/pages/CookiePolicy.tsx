import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-500">
            <li><Link to="/" className="hover:text-[#003366] transition-colors">Home</Link></li>
            <li className="mx-2"><i className="fa-solid fa-chevron-right text-xs"></i></li>
            <li className="text-[#D4AF37] font-medium">Cookie Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#003366] mb-4 font-['Montserrat']">Cookie Policy</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, improve user experience, and provide information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cookies allow websites to remember your preferences, understand how you interact with their pages, and provide personalized content. They do not harm your device or contain viruses.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              CN-SpecLube Chain uses cookies for the following purposes:
            </p>
            
            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">2.1 Essential Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Security and authentication</li>
              <li>Remembering your preferences during a session</li>
              <li>Ensuring the website loads correctly</li>
              <li>Processing form submissions</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">2.2 Analytics Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use analytics cookies to understand how visitors interact with our website. This helps us:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Measure website traffic and user behavior</li>
              <li>Identify popular pages and content</li>
              <li>Understand how visitors navigate our site</li>
              <li>Improve website performance and user experience</li>
              <li>Analyze the effectiveness of marketing campaigns</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">2.3 Marketing Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing efforts:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Remember that you have visited our website</li>
              <li>Limit the number of times you see an advertisement</li>
              <li>Help measure the effectiveness of advertising campaigns</li>
              <li>Provide personalized content based on interests</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">3. Types of Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-[#003366] font-semibold">Cookie Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-[#003366] font-semibold">Type</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-[#003366] font-semibold">Purpose</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-[#003366] font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">_ga</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Analytics</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Google Analytics - distinguishes users</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">2 years</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">_gid</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Analytics</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Google Analytics - distinguishes users</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">_gat</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Analytics</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Google Analytics - throttles request rate</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">1 minute</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">session_id</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Essential</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Maintains user session</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">cookie_consent</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Essential</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">Remembers cookie preferences</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may allow trusted third parties to place cookies on your device for the following services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Google Analytics:</strong> Web analytics service that tracks and reports website traffic</li>
              <li><strong>Google Tag Manager:</strong> Tag management system for tracking codes</li>
              <li><strong>Social Media Platforms:</strong> LinkedIn, Facebook for social sharing functionality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              These third parties have their own privacy policies and may use cookies according to their own purposes. We do not control these third-party cookies. Please review the privacy policies of these third parties for more information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">5. Your Cookie Preferences</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">5.1 Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most browsers allow you to manage cookie settings. You can:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set preferences for specific websites</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#003366] mb-3 mt-6">5.2 Browser-Specific Instructions</h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <p className="text-gray-700">
                <strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
              </p>
              <p className="text-gray-700">
                <strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
              </p>
              <p className="text-gray-700">
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              </p>
              <p className="text-gray-700">
                <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">6. Impact of Disabling Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you choose to disable cookies, you may experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Reduced website functionality</li>
              <li>Inability to remember your preferences</li>
              <li>Loss of personalized content</li>
              <li>Difficulty using certain features</li>
              <li>Repeated prompts to accept cookies</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Essential cookies required for the website to function cannot be disabled without affecting the website's operation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">7. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>CN-SpecLube Chain</strong></p>
              <p className="text-gray-700 mb-2">10th Floor, No. 197, Songling Road</p>
              <p className="text-gray-700 mb-2">Laoshan District, Qingdao, Shandong, China</p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:steven.shunyu@gmail.com" className="text-[#003366] hover:text-[#D4AF37]">steven.shunyu@gmail.com</a></p>
              <p className="text-gray-700">Phone: <a href="tel:+8613793280176" className="text-[#003366] hover:text-[#D4AF37]">+86 1379328 0176</a></p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#003366] mb-4 font-['Montserrat']">9. Additional Resources</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For more information about cookies and online privacy, you may find these resources helpful:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:text-[#D4AF37]">All About Cookies</a></li>
              <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:text-[#D4AF37]">Your Online Choices</a></li>
              <li><a href="https://www.networkadvertising.org/understanding-online-advertising" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:text-[#D4AF37]">Network Advertising Initiative</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

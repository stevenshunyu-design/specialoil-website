import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--primary-900)] text-white pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-[var(--accent-600)] rounded-sm">
                <span className="text-white font-bold text-lg font-display">C</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-semibold text-lg">CN-SpecLube</span>
                <span className="text-xs tracking-wider font-mono text-white/70">CHAIN</span>
              </div>
            </div>
            <p className="font-body text-white/70 mb-6 leading-relaxed text-sm">
              Premium industrial lubricants and special oils from China, connecting global buyers with reliable Chinese manufacturers through a seamless supply chain.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.linkedin.com/in/shunyu-zhang-511354266/"
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-[var(--accent-600)] text-white hover:text-white rounded-sm transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                href="https://wa.me/8613793280176"
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-[var(--accent-600)] text-white hover:text-white rounded-sm transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a
                href="mailto:steven.shunyu@gmail.com"
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-[var(--accent-600)] text-white hover:text-white rounded-sm transition-colors duration-300"
                aria-label="Email"
              >
                <i className="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-base uppercase tracking-wider mb-6 text-white border-l-2 border-[var(--accent-600)] pl-3">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/logistics"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Logistics
                </Link>
              </li>
              <li>
                <Link
                  to="/quality"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Quality
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Industry News
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-display font-semibold text-base uppercase tracking-wider mb-6 text-white border-l-2 border-[var(--accent-600)] pl-3">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products/transformer-oil"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Transformer Oil
                </Link>
              </li>
              <li>
                <Link
                  to="/products/rubber-process-oil"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Rubber Process Oil
                </Link>
              </li>
              <li>
                <Link
                  to="/products/finished-lubricants"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Hydraulic & Industrial Oils
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Gear Oils
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Turbine Oils
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--accent-600)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Specialty Lubricants
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-base uppercase tracking-wider mb-6 text-white border-l-2 border-[var(--accent-600)] pl-3">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 text-white rounded-sm mr-3 flex-shrink-0 group-hover:bg-[var(--accent-600)] transition-colors duration-300">
                  <i className="fa-solid fa-location-dot text-sm"></i>
                </div>
                <span className="font-body text-white/70 text-sm leading-relaxed">
                  10th Floor, No. 197, Songling Road, Laoshan District, Qingdao, Shandong, China
                </span>
              </li>
              <li className="flex items-center group">
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 text-white rounded-sm mr-3 flex-shrink-0 group-hover:bg-[var(--accent-600)] transition-colors duration-300">
                  <i className="fa-solid fa-phone text-sm"></i>
                </div>
                <a
                  href="tel:+8613793280176"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm"
                >
                  +86 1379328 0176
                </a>
              </li>
              <li className="flex items-center group">
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 text-white rounded-sm mr-3 flex-shrink-0 group-hover:bg-[var(--accent-600)] transition-colors duration-300">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </div>
                <a
                  href="mailto:steven.shunyu@gmail.com"
                  className="font-body text-white/70 hover:text-[var(--accent-600)] transition-colors duration-300 text-sm"
                >
                  steven.shunyu@gmail.com
                </a>
              </li>
              <li className="flex items-center group">
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 text-white rounded-sm mr-3 flex-shrink-0 group-hover:bg-[var(--accent-600)] transition-colors duration-300">
                  <i className="fa-solid fa-clock text-sm"></i>
                </div>
                <span className="font-body text-white/70 text-sm">
                  Mon-Fri: 9AM-6PM (GMT+8)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-white/50 text-sm">
            © {currentYear} CN-SpecLube Chain. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="#"
              className="font-body text-white/50 hover:text-white text-sm transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-body text-white/50 hover:text-white text-sm transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="font-body text-white/50 hover:text-white text-sm transition-colors duration-300"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="font-body text-white/50 hover:text-white text-sm transition-colors duration-300"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
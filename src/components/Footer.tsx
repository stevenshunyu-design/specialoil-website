import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  
  return (
    <footer className="bg-[var(--primary-brand)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-['Montserrat'] tracking-tight text-white font-bold">China Special Oil</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Premium industrial lubricants and special oils from China, connecting global buyers with reliable Chinese manufacturers through a seamless supply chain.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/shunyu-zhang-511354266/" className="text-white hover:text-[var(--accent-brand)] transition-colors" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin text-xl"></i>
              </a>
              <a href="https://wa.me/8613793280176" className="text-white hover:text-[var(--accent-brand)] transition-colors" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>
          
           <div>
              <h3 className="text-lg font-bold mb-4 font-['Montserrat'] tracking-tight text-white font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/logistics" className="text-gray-300 hover:text-white transition-colors">Logistics</Link></li>
                <li><Link to="/quality" className="text-gray-300 hover:text-white transition-colors">Quality</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Industry News</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 font-['Montserrat'] tracking-tight text-white font-bold">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/products/transformer-oil" className="text-gray-300 hover:text-white transition-colors">Transformer Oil</Link></li>
              <li><Link to="/products/rubber-process-oil" className="text-gray-300 hover:text-white transition-colors">Rubber Process Oil</Link></li>
              <li><Link to="/products/finished-lubricants" className="text-gray-300 hover:text-white transition-colors">Hydraulic & Industrial Oils</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gear Oils</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Turbine Oils</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Specialty Lubricants</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 font-['Montserrat'] tracking-tight text-white font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-map-marker-alt text-[var(--accent-brand)] mt-1 mr-3"></i>
                <span className="text-gray-300">10th Floor, No. 197,Songling Road, Laoshan District, Qingdao, Shandong, China</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-phone text-[var(--accent-brand)] mr-3"></i>
                <span className="text-gray-300">+86 1379328 0176</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-envelope text-[var(--accent-brand)] mr-3"></i>
                <span className="text-gray-300">steven.shunyu@gmail.com</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-clock text-[var(--accent-brand)] mr-3"></i>
                <span className="text-gray-300">Mon-Fri: 9AM-6PM (GMT+8)</span>
              </li>
              <li className="flex items-center">
                <i className="fa-brands fa-whatsapp text-[var(--accent-brand)] mr-3"></i>
                <span className="text-gray-300">24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2026 CN-SpecLube Chain All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 确定是否在首页
  const isHomePage = location.pathname === '/';

  // 根据页面位置和滚动状态确定文字颜色
  const getTextColorClass = () => {
    if (isHomePage && !isScrolled) {
      return 'text-white';
    }
    return 'text-[var(--text-dark)]';
  };

  const getHoverColorClass = () => {
    return 'hover:text-[var(--accent-brand)]';
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Products',
      path: '/products',
      isDropdown: true,
      dropdownItems: [
        { label: 'Transformer Oil', path: '/products/transformer-oil' },
        { label: 'Rubber Process Oil', path: '/products/rubber-process-oil' },
        { label: 'Finished Lubricants', path: '/products/finished-lubricants' }
      ]
    },
    { label: 'Logistics', path: '/logistics' },
    { label: 'Quality', path: '/quality' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className={`${getTextColorClass()} font-display font-semibold text-xl flex items-center gap-3 transition-colors duration-300`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-[var(--accent-brand)] rounded-sm">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="font-semibold">CN-SpecLube</span>
              <span className="text-xs tracking-wider font-normal opacity-90">CHAIN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {item.isDropdown ? (
                  <button
                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                    className={`${getTextColorClass()} ${getHoverColorClass()} font-body font-medium px-4 py-2 text-sm uppercase tracking-wider flex items-center transition-colors duration-200 ${
                      isProductsDropdownOpen ? 'text-[var(--accent-brand)]' : ''
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                        isProductsDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`${getTextColorClass()} ${getHoverColorClass()} font-body font-medium px-4 py-2 text-sm uppercase tracking-wider transition-colors duration-200`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.isDropdown && isProductsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-sm overflow-hidden z-50">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.label}
                        to={dropdownItem.path}
                        className="block px-5 py-3 text-[var(--text-body)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-dark)] transition-colors duration-200 text-sm"
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden text-2xl transition-colors duration-300 ${
              isHomePage && !isScrolled ? 'text-white' : 'text-[var(--text-dark)]'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg absolute w-full">
          <nav className="container mx-auto px-6 py-6 flex flex-col space-y-1">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.isDropdown ? (
                  <div className="border-b border-[var(--primary-200)] pb-4 mb-4 last:border-0">
                    <button
                      className="w-full text-left flex justify-between items-center text-[var(--text-dark)] font-semibold py-2 transition-colors"
                    >
                      <span className="uppercase tracking-wider text-sm">{item.label}</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="mt-3 ml-4 space-y-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          to={dropdownItem.path}
                          className="block py-2 text-[var(--text-body)] hover:text-[var(--accent-brand)] transition-colors duration-200 text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="block py-3 text-[var(--text-dark)] hover:text-[var(--accent-brand)] font-semibold border-b border-[var(--primary-200)] last:border-0 transition-colors duration-200 uppercase tracking-wider text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
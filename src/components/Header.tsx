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
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 确定是否在首页
  const isHomePage = location.pathname === '/';
  
  // 根据页面位置和滚动状态确定文字颜色
  const getTextColorClass = () => {
    // 如果是首页且未滚动，则使用白色文字
    if (isHomePage && !isScrolled) {
      return 'text-white';
    }
    // 其他情况（非首页或首页但已滚动）使用黑色文字
    return 'text-[var(--primary-brand)]';
  };
  
  // 获取导航链接的悬停颜色类
  const getHoverColorClass = () => {
    // 统一使用金色悬停色
    return 'hover:text-[var(--accent-brand)]';
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
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
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className={`text-2xl font-bold ${getTextColorClass()} font-['Montserrat'] tracking-tight flex items-center gap-2`}
          >
                 <img 
                  src="https://lf-code-agent.coze.cn/obj/x-ai-cn/324537063426/attachment/CN_SpecLube Chain LOGO_20260212115043.png" 
                  alt="CN-SpecLube Chain Logo" 
                  className="h-8"
                />
                <span className="hidden md:inline">CN-SpecLube Chain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {item.isDropdown ? (
                  <button
                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                      className={`${getTextColorClass()} ${getHoverColorClass()} font-semibold flex items-center transition-colors ${
                        isProductsDropdownOpen ? 'text-[var(--accent-brand)]' : ''
                      }`}
                  >
                    {item.label}
                    <i className={`fa-solid fa-chevron-down ml-1 text-xs transition-transform ${
                      isProductsDropdownOpen ? 'rotate-180' : ''
                    }`}></i>
                  </button>
                ) : (
                  <Link 
                     to={item.path} 
                     className={`${getTextColorClass()} ${getHoverColorClass()} font-semibold transition-colors`}
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
                        className="block px-4 py-3 text-[var(--text-body)] hover:bg-[var(--bg-light)] hover:text-[var(--primary-brand)] transition-colors"
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
             className={`md:hidden text-2xl ${isHomePage && !isScrolled ? 'text-white' : 'text-[var(--primary-brand)]'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.isDropdown ? (
                  <div className="border-b border-gray-200 pb-2">
                    <button
                      className="w-full text-left flex justify-between items-center text-[var(--text-dark)] font-semibold py-2"
                      onClick={() => item.isOpen = !item.isOpen}
                    >
                      <span>{item.label}</span>
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </button>
                    <div className="mt-2 ml-4 space-y-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          to={dropdownItem.path}
                          className="block py-2 text-[var(--text-body)] hover:text-[var(--accent-brand)]"
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
                    className="block py-2 text-[var(--text-dark)] hover:text-[var(--accent-brand)] font-semibold border-b border-gray-200"
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
import { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaTools,
  FaServicestack,
  FaLaptopCode,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          const sections = navItems.map(item => item.href.slice(1));
          const currentSection = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              return rect.top <= 100 && rect.bottom >= 100;
            }
            return false;
          });
          if (currentSection) {
            setActiveSection(currentSection);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const navItems = [
    { href: "#home", icon: FaHome, label: "Home" },
    { href: "#about", icon: FaUser, label: "About" },
    { href: "#skills", icon: FaTools, label: "Skills" },
    { href: "#education", icon: FaServicestack, label: "Education" },
    { href: "#projects", icon: FaLaptopCode, label: "Projects" },
    { href: "#contact", icon: FaEnvelope, label: "Contact" },
  ];

  const handleNavClick = (href) => {
    const section = href.slice(1);
    setActiveSection(section);
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    
    document.getElementById(section)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Mobile Header */}
      <div 
        className={`fixed bottom-0 left-0 w-full z-50 transition-all duration-500 ease-in-out md:hidden
          ${isMenuOpen ? 'h-64' : 'h-16'}`}
      >
        <div className={`absolute inset-0 bg-white shadow-lg transition-opacity duration-500
          ${isMenuOpen ? 'opacity-100' : 'opacity-95'}`}
        />
        
        <div className="relative flex justify-between items-center px-4 py-2">
          <div className="text-lg font-bold tracking-wide">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rudra Tank
            </span>
          </div>
          <button
            onClick={toggleMenu}
            className="text-2xl text-gray-600 focus:outline-none transition-all duration-300
              hover:scale-110 hover:text-blue-600 active:scale-95"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes className="transform rotate-180 transition-transform duration-300" /> : 
                         <FaBars className="transform transition-transform duration-300" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`relative grid grid-cols-3 gap-6 px-6 py-4 transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          {navItems.map(({ href, icon: Icon, label }) => (
            <button
              key={href}
              onClick={() => handleNavClick(href)}
              className={`flex flex-col items-center transition-all duration-300
                ${activeSection === href.slice(1) 
                  ? 'text-blue-600 transform scale-110' 
                  : 'text-gray-600 hover:text-blue-600 hover:scale-105'}
                active:scale-95`}
            >
              <Icon size={24} className="transition-transform duration-300 hover:rotate-12" />
              <span className="text-xs mt-2 font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 hidden md:block
          ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
          <div className={`text-xl font-bold tracking-wide transition-all duration-300
            ${scrolled ? 'text-gray-800' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rudra Tank
            </span>
          </div>

          <nav className="flex space-x-8">
            {navItems.map(({ href, icon: Icon, label }) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className={`flex items-center space-x-2 transition-all duration-300 group
                  ${activeSection === href.slice(1)
                    ? 'text-blue-600 scale-105'
                    : 'text-gray-600 hover:text-blue-600'}
                  hover:scale-105 active:scale-95`}
              >
                <Icon className="transition-all duration-300 group-hover:rotate-12" />
                <span className="relative font-medium">
                  {label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300
                    ${activeSection === href.slice(1) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
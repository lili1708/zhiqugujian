import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: '首页', href: '#' },
  { label: '关于', href: '#about' },
  { label: '功能', href: '#features' },
  { label: '评价', href: '#testimonials' },
  { label: '下载', href: '#download' }
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#');
              }}
              className="flex items-center gap-2 group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                isScrolled ? 'bg-[#e63946]' : 'bg-white'
              }`}>
                <span className={`font-bold text-lg transition-colors duration-300 ${
                  isScrolled ? 'text-white' : 'text-[#e63946]'
                }`}>古</span>
              </div>
              <span className={`text-xl font-medium transition-colors duration-300 ${
                isScrolled ? 'text-[#1d3557]' : 'text-white'
              }`}>
                古建智趣
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`relative text-sm font-medium transition-colors duration-300 group ${
                    isScrolled 
                      ? 'text-[#1d3557] hover:text-[#e63946]' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? 'bg-[#e63946]' : 'bg-white'
                  }`} />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button 
                size="sm"
                className={`rounded-full px-6 transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-[#e63946] text-white hover:bg-[#c1121f]' 
                    : 'bg-white text-[#e63946] hover:bg-white/90'
                }`}
              >
                立即下载
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-[#1d3557] hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-ink)' }}
        >
          <div className="p-6 pt-20">
            <div className="space-y-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`block py-3 px-4 text-lg font-medium text-[#1d3557] hover:text-[#e63946] hover:bg-[#e63946]/5 rounded-lg transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-4'
                  }`}
                  style={{ 
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <div 
              className={`mt-8 transition-all duration-500 ${
                isMobileMenuOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <Button 
                className="w-full bg-[#e63946] hover:bg-[#c1121f] rounded-full py-6"
              >
                立即下载
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

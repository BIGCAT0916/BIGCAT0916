import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'DIVISIONS', href: '#divisions' },
    { name: 'PORTFOLIO', href: '#portfolio' },
    { name: 'CONTACT', href: '#contact' },
    { name: 'NOTICE', href: '#notice' },
  ];

  const getHref = (href: string) => {
    if (pathname === '/') return href;
    return `/${href}`;
  };

  return (
    <nav 
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled || pathname !== '/' ? 'bg-white shadow-sm py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex flex-col items-start group">
          <div className="flex items-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1nyJV5fuIjEpbxSAwEj26z5atbAnJzLbE" 
              alt="ART FORESTA" 
              referrerPolicy="no-referrer"
              className={`w-[161px] h-auto transition-all ${isScrolled || pathname !== '/' ? 'brightness-0' : 'brightness-100'}`}
            />
          </div>
          <span className={`text-[8.5px] tracking-[0.3em] font-medium transition-colors ${isScrolled || pathname !== '/' ? 'text-stone-500' : 'text-stone-300'}`}>
            COMPREHENSIVE ARTS GROUP
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={getHref(link.href)}
              className={`text-[10.2px] font-semibold tracking-widest transition-all hover:opacity-100 ${
                isScrolled || pathname !== '/' ? 'text-stone-600 opacity-70' : 'text-white opacity-80'
              } hover:tracking-[0.2em]`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled || pathname !== '/' ? 'text-stone-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled || pathname !== '/' ? 'text-stone-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-10 px-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={getHref(link.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-stone-900 text-lg font-display font-medium tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

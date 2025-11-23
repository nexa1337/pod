
import React, { useState, useEffect } from 'react';
import { Moon, Sun, ShoppingBag, Menu, X, Search, Globe, Heart } from 'lucide-react';
import { Currency } from '../types';

interface HeaderProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  wishlistCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  currency, 
  setCurrency, 
  isDark, 
  toggleTheme, 
  onSearchClick,
  onCartClick,
  onWishlistClick,
  wishlistCount
}) => {
  const [time, setTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(13420); // Start higher for requested range
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Realistic visitor fluctuation (13k - 43k)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => {
        const change = Math.floor(Math.random() * 150) - 50; // Larger fluctuation
        let newCount = prev + change;
        // Bounds check: 13,000 to 43,000
        if (newCount < 13000) newCount = 13000 + Math.floor(Math.random() * 500);
        if (newCount > 43000) newCount = 43000 - Math.floor(Math.random() * 500);
        return newCount;
      });
    }, 3000);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Format number with commas
  const formattedVisitors = new Intl.NumberFormat('en-US').format(visitorCount);

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 font-sans ${scrolled ? 'shadow-md' : ''}`}>
      
      {/* Utility Bar - Realistic App Style */}
      <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          
          {/* Left: Time & Date */}
          <div className="flex justify-start">
             <span className="hidden sm:inline text-gray-400 font-medium font-mono tracking-wide text-[10px] md:text-xs">
                {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
             {/* Mobile currency left align */}
             <div className="sm:hidden flex items-center space-x-1">
                <Globe size={12} className="text-gray-400" />
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-transparent border-none outline-none text-xs text-white font-medium focus:ring-0 p-0"
                >
                  <option value="USD" className="text-black">USD</option>
                  <option value="EUR" className="text-black">EUR</option>
                  <option value="MAD" className="text-black">MAD</option>
                </select>
             </div>
          </div>

          {/* Center: Live Visitors */}
          <div className="flex justify-center">
             <div className="flex items-center bg-black/40 px-3 py-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
                 <span className="relative flex h-2 w-2 mr-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                 </span>
                 <span className="font-semibold tracking-wide text-gray-200 text-[10px] sm:text-xs">
                    {formattedVisitors} <span className="hidden sm:inline">shopping live</span><span className="sm:hidden">live</span>
                 </span>
             </div>
          </div>

          {/* Right: Controls */}
          <div className="flex justify-end items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 cursor-pointer group relative hover:bg-white/10 px-2 py-1 rounded transition-colors">
              <Globe size={14} className="text-gray-400" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent border-none outline-none cursor-pointer text-white font-semibold focus:ring-0 text-xs"
              >
                <option value="USD" className="text-black">USD ($)</option>
                <option value="EUR" className="text-black">EUR (€)</option>
                <option value="MAD" className="text-black">MAD (DHs)</option>
              </select>
            </div>

            <button 
              onClick={toggleTheme} 
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar - iOS Glassmorphism */}
      <nav className="bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 py-3 px-4 md:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('home')} 
            className="cursor-pointer flex flex-col select-none"
          >
            <div className="text-2xl font-black tracking-[0.2em] uppercase italic text-gray-900 dark:text-white flex items-center leading-none">
              <span className="mr-2">N E X A</span>
              <span className="text-primary">1337</span>
            </div>
            <div className="flex justify-end w-full mt-1">
                <span className="text-[0.6rem] font-bold tracking-[0.2em] text-primary animate-pulse uppercase">
                  POD MASTERS
                </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide text-gray-600 dark:text-gray-300">
            <button onClick={() => scrollToSection('home')} className="hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollToSection('products')} className="hover:text-primary transition-colors">Products</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollToSection('blog')} className="hover:text-primary transition-colors">Blog</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Contact</button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <button onClick={onSearchClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            
            {/* Wishlist Button */}
            <button onClick={onWishlistClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative group hidden sm:block">
              <Heart size={20} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button onClick={onCartClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-0.5 bg-primary text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
                0
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 ml-2 text-gray-900 dark:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-gray-800 shadow-xl animate-fade-in z-40">
            <div className="flex flex-col p-4 space-y-1">
              <button onClick={() => scrollToSection('home')} className="text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-gray-900 dark:text-white">Home</button>
              <button onClick={() => scrollToSection('products')} className="text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-gray-900 dark:text-white">Products</button>
              <button onClick={() => scrollToSection('about')} className="text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-gray-900 dark:text-white">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-gray-900 dark:text-white">Contact</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;


import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    // Mobile: Bottom-24 (96px) Left-4. Desktop: Bottom-6 Left-6.
    <div className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-[45] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <button
        type="button"
        onClick={scrollToTop}
        className="p-3 bg-gray-900/80 dark:bg-white/90 backdrop-blur text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none flex items-center justify-center group border border-white/10"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default ScrollToTop;

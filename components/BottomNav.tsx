
import React from 'react';
import { Home, Search, Heart, ShoppingBag, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  onSearchClick: () => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  cartCount: number;
  wishlistCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  onSearchClick, 
  onCartClick, 
  onWishlistClick,
  cartCount,
  wishlistCount 
}) => {
  
  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navItemClass = "group flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white active:text-primary transition-all duration-200 active:scale-95";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Gradient Blur Overlay for smoother integration with content */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent pointer-events-none -top-4 h-4"></div>
      
      {/* Main Navbar */}
      <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-safe-bottom">
        <div className="flex justify-between items-center h-[60px] px-4 max-w-md mx-auto">
          
          <button onClick={() => scrollToSection('home')} className={navItemClass}>
            <Home strokeWidth={2} size={24} className="mb-1" />
            <span className="text-[10px] font-medium tracking-wide">Home</span>
          </button>

          <button onClick={() => scrollToSection('products')} className={navItemClass}>
            <LayoutGrid strokeWidth={2} size={24} className="mb-1" />
            <span className="text-[10px] font-medium tracking-wide">Shop</span>
          </button>

          <button onClick={onSearchClick} className={navItemClass}>
            <Search strokeWidth={2} size={24} className="mb-1" />
            <span className="text-[10px] font-medium tracking-wide">Search</span>
          </button>

          <button onClick={onWishlistClick} className={navItemClass}>
            <div className="relative">
              <Heart strokeWidth={2} size={24} className={`mb-1 transition-colors ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide">Saved</span>
          </button>

          <button onClick={onCartClick} className={navItemClass}>
            <div className="relative">
              <ShoppingBag strokeWidth={2} size={24} className="mb-1" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide">Cart</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default BottomNav;

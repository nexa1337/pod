
import React, { useState, useEffect } from 'react';
import { Product, Currency } from '../types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import QuickViewModal from '../components/QuickViewModal';
import GuidelinesModal from '../components/GuidelinesModal';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import SearchOverlay from '../components/SearchOverlay';
import BottomNav from '../components/BottomNav';
import ScrollToTop from '../components/ScrollToTop';
import OrderSuccessModal from '../components/OrderSuccessModal';
import ChatAssistant from '../components/ChatAssistant';
import { BlogSection, ContactSection, CustomLogoSection, FAQSection, AboutSection, SocialMediaSection, Footer, GlobalMapSection, ClientReviewsSection } from '../components/ExtraSections';

function App() {
  // State
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isDark, setIsDark] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New State for overlays
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Order Success State
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Theme Initialization
  useEffect(() => {
    // Check system preference or local storage
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Modal Handlers
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Overlay Handlers
  const toggleGuidelines = (open: boolean) => {
    setIsGuidelinesOpen(open);
    document.body.style.overflow = open ? 'hidden' : 'unset';
  };

  const toggleCart = (open: boolean) => {
    setIsCartOpen(open);
    document.body.style.overflow = open ? 'hidden' : 'unset';
  };

  const toggleSearch = (open: boolean) => {
    setIsSearchOpen(open);
    document.body.style.overflow = open ? 'hidden' : 'unset';
  };

  const toggleWishlistDrawer = (open: boolean) => {
    setIsWishlistOpen(open);
    document.body.style.overflow = open ? 'hidden' : 'unset';
  };

  const handleOrderSuccess = (details: any) => {
    setLastOrderDetails(details);
    setIsOrderSuccessOpen(true);
    // Ensure scrolling is locked if main modal closes but success is open
    document.body.style.overflow = 'hidden';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark transition-colors duration-300 font-sans pb-16 md:pb-0">
      
      <Header 
        currency={currency} 
        setCurrency={setCurrency} 
        isDark={isDark} 
        toggleTheme={toggleTheme}
        onSearchClick={() => toggleSearch(true)}
        onCartClick={() => toggleCart(true)}
        onWishlistClick={() => toggleWishlistDrawer(true)}
        wishlistCount={wishlist.length}
      />

      <main>
        <Hero onCreateCustom={() => toggleGuidelines(true)} />
        
        <ProductSection 
          currency={currency} 
          onQuickView={openModal}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />

        <AboutSection />

        <GlobalMapSection />

        <CustomLogoSection onStartCustom={() => toggleGuidelines(true)} />

        <ClientReviewsSection />
        
        <FAQSection />

        <BlogSection />
        
        <ContactSection />

        <SocialMediaSection />
      </main>

      <Footer />

      {/* Chat Assistant */}
      <ChatAssistant />

      {/* Bottom Navigation for Mobile */}
      <BottomNav 
        onSearchClick={() => toggleSearch(true)}
        onCartClick={() => toggleCart(true)}
        onWishlistClick={() => toggleWishlistDrawer(true)}
        cartCount={0}
        wishlistCount={wishlist.length}
      />

      {/* Scroll To Top Button */}
      <ScrollToTop />

      {/* Global Modals */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        currency={currency}
        onOpenGuidelines={() => toggleGuidelines(true)}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        onOrderSuccess={handleOrderSuccess}
      />

      <GuidelinesModal 
        isOpen={isGuidelinesOpen} 
        onClose={() => toggleGuidelines(false)} 
      />

      <OrderSuccessModal 
        isOpen={isOrderSuccessOpen}
        onClose={() => { setIsOrderSuccessOpen(false); document.body.style.overflow = 'unset'; }}
        orderDetails={lastOrderDetails}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => toggleCart(false)} 
      />

      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => toggleWishlistDrawer(false)}
        wishlistIds={wishlist}
        removeFromWishlist={toggleWishlist}
        onViewProduct={openModal}
      />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => toggleSearch(false)} 
      />

    </div>
  );
}

export default App;

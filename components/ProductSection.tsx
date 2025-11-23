
import React, { useState, useEffect, useRef } from 'react';
import { Star, Filter, Globe, Heart, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Layers } from 'lucide-react';
import { Product, Currency } from '../types';
import { PRODUCTS, RATES, CURRENCY_SYMBOLS } from '../data';

interface ProductSectionProps {
  currency: Currency;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({ currency, onQuickView, wishlist, toggleWishlist }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [shippingFilter, setShippingFilter] = useState<'All' | 'Morocco' | 'International'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;
  
  // Updated Categories List
  const categories = [
    'All', 
    "Men's clothing", 
    "Women's clothing", 
    "Kids' & youth clothing", 
    "Hats", 
    "Accessories", 
    "Home & living", 
    "Fabric Printing", 
    "Gifts"
  ];

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesShipping = shippingFilter === 'All' || p.shippingType === shippingFilter;
    return matchesCategory && matchesShipping;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('products');
    if(element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, shippingFilter]);

  const formatPrice = (price: number) => {
    const converted = price * RATES[currency];
    return `${CURRENCY_SYMBOLS[currency]}${converted.toFixed(2)}`;
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-gray-50 dark:bg-black transition-colors duration-300 overflow-hidden relative">
      {/* Background Deco */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header & Controls */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-3 flex items-center">
             <Layers size={12} className="mr-2" /> Collection 2024
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
            LATEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">DROPS</span>
          </h2>

          {/* Shipping Filter - iOS Segmented Control */}
          <div className="bg-gray-200 dark:bg-[#1c1c1e] p-1 rounded-xl inline-flex mb-8 relative w-full max-w-[340px] shadow-inner border border-gray-300 dark:border-gray-800">
             <div 
               className="absolute top-1 bottom-1 bg-white dark:bg-[#2c2c2e] rounded-lg shadow-sm transition-all duration-300 ease-out z-0"
               style={{
                 width: 'calc(33.33% - 2.6px)',
                 transform: `translateX(${shippingFilter === 'All' ? '0%' : shippingFilter === 'Morocco' ? '100%' : '200%'})`,
                 left: '4px'
               }}
             />
             <div className="grid grid-cols-3 w-full relative z-10">
               {['All', 'Morocco', 'International'].map((filter) => (
                 <button
                   key={filter}
                   onClick={() => setShippingFilter(filter as any)}
                   className={`py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center ${
                     shippingFilter === filter 
                       ? 'text-black dark:text-white' 
                       : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                   }`}
                 >
                   {filter === 'All' ? 'All' : filter === 'Morocco' ? <><span className="mr-1">🇲🇦</span> MA</> : <><Globe size={12} className="mr-1"/> INT</>}
                 </button>
               ))}
             </div>
          </div>

          {/* Category Tabs - Improved Scroll */}
          <div className="w-full max-w-full relative group">
            
            {/* Left Scroll Button (Desktop) */}
            <button 
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Scroll Button (Desktop) */}
            <button 
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
            >
              <ChevronRight size={20} />
            </button>

            {/* Gradient Masks for Mobile - Visual cue for scrolling (Adjusted to edges) */}
            <div className="absolute inset-y-0 -left-4 w-8 bg-gradient-to-r from-gray-50 dark:from-black to-transparent z-10 pointer-events-none md:hidden"></div>
            <div className="absolute inset-y-0 -right-4 w-12 bg-gradient-to-l from-gray-50 dark:from-black to-transparent z-10 pointer-events-none md:hidden"></div>

            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto items-center gap-3 py-4 hide-scrollbar scroll-smooth -mx-4 px-4 w-[calc(100%+2rem)] md:w-full md:mx-0 md:px-0 touch-pan-x"
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border whitespace-nowrap select-none ${
                    activeCategory === cat 
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md transform scale-105' 
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {/* Spacer for right padding on mobile */}
              <div className="w-6 flex-shrink-0 md:hidden"></div>
            </div>
          </div>
        </div>

        {/* --- MOBILE: Vertical Stack (Paginated) --- */}
        <div className="md:hidden grid grid-cols-1 gap-8 pb-8 px-2">
          {paginatedProducts.length > 0 ? (
             paginatedProducts.map((product) => (
               <div 
                 key={product.id} 
                 className="w-full relative flex flex-col"
                 onClick={() => onQuickView(product)}
               >
                 {/* High Fidelity Card */}
                 <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl transition-transform active:scale-[0.98] border border-white/10">
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    
                    {/* Top Gradient Shade */}
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {product.shippingType === 'Morocco' ? (
                           <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                             🇲🇦 Morocco
                           </span>
                        ) : (
                           <span className="bg-blue-500/40 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                             🌍 Global
                           </span>
                        )}
                        
                        <button 
                             onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                             className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${wishlist.includes(product.id) ? 'bg-red-500 text-white border-red-500' : 'bg-black/20 border-white/20 text-white'}`}
                        >
                             <Heart size={18} className={wishlist.includes(product.id) ? "fill-current" : ""} />
                        </button>
                    </div>

                    {/* Bottom Content Area - Glassmorphism */}
                    <div className="absolute bottom-0 inset-x-0 p-2">
                       <div className="bg-black/60 backdrop-blur-xl rounded-[1.8rem] p-5 border-t border-white/10">
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</span>
                                 <h3 className="text-xl font-bold text-white leading-tight line-clamp-1">
                                   {product.title}
                                 </h3>
                              </div>
                              <span className="bg-white text-black px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                                 {formatPrice(product.price)}
                              </span>
                           </div>
                           
                           {/* Size and Color Preview Mobile */}
                           <div className="flex items-center gap-3 mb-4">
                              <div className="flex -space-x-1.5">
                                {product.colors.slice(0, 3).map((color, i) => (
                                  <div key={i} className="w-3 h-3 rounded-full border border-white/20" style={{backgroundColor: color}}></div>
                                ))}
                                {product.colors.length > 3 && <div className="w-3 h-3 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center text-[6px] text-white">+</div>}
                              </div>
                              <div className="h-3 w-[1px] bg-white/20"></div>
                              <div className="flex gap-1">
                                {product.sizes.slice(0, 3).map((size, i) => (
                                  <span key={i} className="text-[9px] text-gray-300 font-mono border border-white/10 px-1 rounded">{size}</span>
                                ))}
                              </div>
                           </div>

                           <button 
                             className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center shadow-lg shadow-primary/30 transition-all"
                           >
                              Shop Now <ArrowRight size={16} className="ml-2" />
                           </button>
                       </div>
                    </div>
                 </div>
               </div>
             ))
          ) : (
            <div className="w-full text-center py-10 text-gray-500">No products found.</div>
          )}
        </div>

        {/* --- DESKTOP: Modern Grid --- */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
          {paginatedProducts.map(product => (
            <div 
              key={product.id} 
              className="group flex flex-col"
            >
              {/* Image Card */}
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 mb-5 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group-hover:-translate-y-2" onClick={() => onQuickView(product)}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-10 transition-colors duration-300"></div>
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Shipping Badge */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    {product.shippingType === 'Morocco' ? (
                      <span className="h-8 px-3 flex items-center justify-center bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-xs font-bold shadow-sm border border-white/20" title="Morocco Shipping">
                        🇲🇦 MA
                      </span>
                    ) : (
                      <span className="h-8 px-3 flex items-center justify-center bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-gray-900 dark:text-white text-xs font-bold shadow-sm border border-white/20" title="Global Shipping">
                        <Globe size={12} className="mr-1"/> INT
                      </span>
                    )}
                </div>

                {/* Wishlist */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full shadow-sm transition-transform active:scale-90 hover:bg-white text-gray-900 dark:text-white hover:text-red-500 z-20 border border-white/20"
                >
                  <Heart 
                    size={16} 
                    className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""} 
                  />
                </button>

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                    className="w-full py-3.5 bg-white dark:bg-gray-900 text-black dark:text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingBag size={16} /> Quick View
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 px-1">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 
                        className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-primary transition-colors tracking-tight"
                        onClick={() => onQuickView(product)}
                      >
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.category}</p>
                </div>

                {/* Sizes & Colors Preview Row */}
                <div className="flex items-center gap-3 py-1 border-b border-gray-100 dark:border-gray-800/50 pb-2">
                   {/* Colors */}
                   <div className="flex -space-x-1.5">
                      {product.colors.slice(0, 4).map((color, idx) => (
                         <div 
                            key={idx} 
                            className="w-3.5 h-3.5 rounded-full border border-white dark:border-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" 
                            style={{ backgroundColor: color }}
                            title={color}
                         />
                      ))}
                      {product.colors.length > 4 && (
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-white dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-500">+</div>
                      )}
                   </div>
                   
                   {/* Divider */}
                   <div className="h-3 w-px bg-gray-200 dark:bg-gray-700"></div>

                   {/* Sizes */}
                   <div className="flex gap-1 items-center">
                      {product.sizes.slice(0, 3).map((size, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                           {size}
                        </span>
                      ))}
                      {product.sizes.length > 3 && <span className="text-[9px] text-gray-400">...</span>}
                   </div>
                </div>
                
                <div className="flex justify-between items-center pt-1">
                   <div className="flex items-center gap-1">
                     <div className="flex text-yellow-400">
                        {[...Array(1)].map((_, i) => (
                           <Star key={i} size={12} fill="currentColor" />
                        ))}
                     </div>
                     <span className="text-xs font-bold text-gray-900 dark:text-white">{product.rating}</span>
                     <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                   </div>
                   <p className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Unified Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 md:mt-16">
              <button 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:border-primary hover:text-primary hover:shadow-lg transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Page</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">
                   {currentPage} <span className="text-gray-400 font-light">/</span> {totalPages}
                </span>
              </div>

              <button 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:border-primary hover:text-primary hover:shadow-lg transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
        )}

        {filteredProducts.length === 0 && (
           <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6 text-gray-400 animate-pulse">
               <Filter size={40} />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-8">Try adjusting your filters or categories.</p>
             <button 
               onClick={() => { setActiveCategory('All'); setShippingFilter('All'); }}
               className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:transform hover:scale-105 transition-all shadow-lg"
             >
               Clear Filters
             </button>
           </div>
        )}
        
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ProductSection;

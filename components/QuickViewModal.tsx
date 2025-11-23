
import React, { useState, useEffect, useRef } from 'react';
import { X, Star, ShieldCheck, Smartphone, CreditCard, Banknote, ChevronLeft, ChevronRight, Package, Ruler, Heart, Minus, Plus, Check, Upload, FileText, Trash2, AlertCircle, Copy, ArrowDown } from 'lucide-react';
import { Product, Currency } from '../types';
import { RATES, CURRENCY_SYMBOLS } from '../data';
import CODModal from './CODModal';
import InternationalOrderModal from './InternationalOrderModal';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onOpenGuidelines: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  onOrderSuccess: (details: any) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  currency, 
  onOpenGuidelines, 
  wishlist, 
  toggleWishlist,
  onOrderSuccess
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPayPalInfo, setShowPayPalInfo] = useState(false);
  const [isCODOpen, setIsCODOpen] = useState(false);
  const [isInternationalFormOpen, setIsInternationalFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'size' | 'shipping'>('details');

  // Ref for the payment info box
  const payPalInfoRef = useRef<HTMLDivElement>(null);

  // Selection State
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Custom Logo State for International/General Orders
  const [isCustomLogo, setIsCustomLogo] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [customLogoFile, setCustomLogoFile] = useState<File | null>(null);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
      setShowPayPalInfo(false);
      // Reset Custom Logo
      setIsCustomLogo(false);
      setCustomInstructions('');
      setCustomLogoFile(null);
    }
  }, [product]);

  // Determine if COD is allowed (Only for Moroccan shipping)
  const isCODAvailable = product?.shippingType === 'Morocco';

  // Logic: If Custom Logo is selected, disable PayPal button (and hide info if it was open)
  useEffect(() => {
    if (isCustomLogo) {
      setShowPayPalInfo(false);
    }
  }, [isCustomLogo]);

  // Effect: Scroll to PayPal info when it becomes visible
  useEffect(() => {
    if (showPayPalInfo && payPalInfoRef.current) {
      // Delay slightly to allow rendering to complete
      setTimeout(() => {
        payPalInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showPayPalInfo]);


  if (!isOpen || !product) return null;

  const convertedPrice = (product.price * RATES[currency]).toFixed(2);
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const finalPriceStr = `${currencySymbol}${convertedPrice}`;
  
  // Calculate total price based on quantity
  const totalPrice = (product.price * quantity * RATES[currency]).toFixed(2);
  const totalPriceStr = `${currencySymbol}${totalPrice}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Maximum size is 10MB.");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG or PNG image.");
        return;
      }
      setCustomLogoFile(file);
    }
  };

  const getGumroadLink = (productTitle: string) => {
    const slug = productTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return `https://nexa1337.gumroad.com/l/${slug}?wanted=true`;
  };

  const inputClass = "w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-dark-card w-full max-w-6xl h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row animate-fade-in-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 rounded-full text-gray-800 dark:text-white transition-colors">
          <X size={24} />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-800 relative flex flex-col justify-center">
          <div className="relative h-full w-full group">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {product.images.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 flex flex-col">
          
          {/* Header Info */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {product.shippingType === 'Morocco' ? 
                  <span className="bg-green-500/10 text-green-600 border border-green-500/20 text-[10px] uppercase font-bold px-2 py-1 rounded dark:text-green-400">Available in Morocco</span> :
                  <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] uppercase font-bold px-2 py-1 rounded dark:text-blue-400">International Shipping</span>
                }
                <span className="flex items-center text-yellow-500 text-xs font-bold">
                  <Star size={12} fill="currentColor" className="mr-1"/> {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              {/* Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="group flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                 <Heart 
                    size={20} 
                    className={`transition-all ${wishlist.includes(product.id) ? "text-red-500 fill-red-500 scale-110" : "group-hover:scale-110"}`} 
                 />
                 <span className="hidden sm:inline">{wishlist.includes(product.id) ? "Saved" : "Save"}</span>
              </button>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight leading-none">{product.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg font-medium">{product.tagline}</p>
            
            <div className="text-4xl font-black text-primary tracking-tight">
              {finalPriceStr}
            </div>
          </div>

          {/* Options: Color, Size, Qty */}
          <div className="space-y-6 mb-8">
            {/* Color Selector */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full shadow-sm border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-primary scale-110 ring-2 ring-primary/30' : 'border-gray-200 dark:border-gray-600 hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {selectedColor === color && <Check size={14} className={color === '#ffffff' ? 'text-black' : 'text-white'} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
               <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Size: <span className="text-gray-500 font-normal">{selectedSize}</span></h3>
               <div className="flex flex-wrap gap-2">
                 {product.sizes.map(size => (
                   <button
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                       selectedSize === size 
                         ? 'border-primary bg-primary/5 text-primary' 
                         : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button 
                     onClick={() => setQuantity(q => q + 1)}
                     className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Total: <strong className="text-gray-900 dark:text-white">{totalPriceStr}</strong>
                </div>
              </div>
            </div>

            {/* Custom Logo Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div 
                 className="flex items-center justify-between mb-4 cursor-pointer select-none group bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-all" 
                 onClick={() => setIsCustomLogo(!isCustomLogo)}
               >
                 <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                   Add Custom Logo?
                 </span>
                 <div className={`w-12 h-6 rounded-full transition-colors relative ${isCustomLogo ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isCustomLogo ? 'left-7' : 'left-1'}`}></div>
                 </div>
               </div>

               {isCustomLogo && (
                 <div className="animate-fade-in space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                   {/* Guidelines Link */}
                   <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                      <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Ensure design is 150+ DPI. 
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onOpenGuidelines(); }} 
                          className="text-primary underline ml-1.5 font-bold hover:text-indigo-600"
                        >
                          Guidelines
                        </button>
                      </p>
                   </div>

                   <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Design Instructions</label>
                     <input 
                       type="text" 
                       value={customInstructions} 
                       onChange={(e) => setCustomInstructions(e.target.value)}
                       className={inputClass}
                       placeholder="E.g., Center chest, 10cm wide..."
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Upload Design</label>
                     {!customLogoFile ? (
                       <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-gray-700 transition-colors cursor-pointer group bg-white dark:bg-transparent">
                         <input 
                           type="file" 
                           accept="image/png, image/jpeg, image/jpg"
                           onChange={handleFileChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                           <Upload size={20} />
                         </div>
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Click to upload</span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 10MB (JPEG, PNG)</span>
                       </div>
                     ) : (
                       <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                         <div className="flex items-center overflow-hidden">
                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center flex-shrink-0">
                             <FileText size={20} />
                           </div>
                           <div className="ml-3 min-w-0">
                             <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{customLogoFile.name}</p>
                           </div>
                         </div>
                         <button onClick={() => setCustomLogoFile(null)} className="p-2 text-gray-400 hover:text-red-500">
                           <Trash2 size={18} />
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Content Tabs */}
          <div className="mb-8 flex-1">
            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-4">
              <button 
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Details
              </button>
              <button 
                onClick={() => setActiveTab('size')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'size' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Size Guide
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'shipping' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Shipping
              </button>
            </div>

            <div className="animate-fade-in text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {activeTab === 'details' && (
                 <div className="prose dark:prose-invert prose-sm max-w-none">
                   <div dangerouslySetInnerHTML={{ __html: product.description }} />
                   <ul className="mt-4 space-y-2">
                     <li className="flex items-center"><ShieldCheck size={16} className="mr-2 text-green-500"/> 100% Quality Guarantee</li>
                     <li className="flex items-center"><ShieldCheck size={16} className="mr-2 text-green-500"/> Secure Checkout</li>
                   </ul>
                 </div>
              )}
              {activeTab === 'size' && (
                 <div className="space-y-4">
                   <p className="mb-4">Our sizes are standard fit. If you prefer an oversized look, we recommend going one size up.</p>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse text-xs">
                       <thead>
                         <tr className="bg-gray-100 dark:bg-gray-700">
                           <th className="p-2 rounded-l">Size</th>
                           <th className="p-2">Chest (cm)</th>
                           <th className="p-2">Length (cm)</th>
                           <th className="p-2 rounded-r">Sleeve (cm)</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                         <tr><td className="p-2 font-bold">S</td><td className="p-2">50</td><td className="p-2">70</td><td className="p-2">20</td></tr>
                         <tr><td className="p-2 font-bold">M</td><td className="p-2">53</td><td className="p-2">72</td><td className="p-2">21</td></tr>
                         <tr><td className="p-2 font-bold">L</td><td className="p-2">56</td><td className="p-2">74</td><td className="p-2">22</td></tr>
                         <tr><td className="p-2 font-bold">XL</td><td className="p-2">60</td><td className="p-2">76</td><td className="p-2">23</td></tr>
                       </tbody>
                     </table>
                   </div>
                   <div className="flex items-center text-xs text-gray-500 mt-2">
                     <Ruler size={14} className="mr-1"/> Measurements may vary by +/- 2cm
                   </div>
                 </div>
              )}
              {activeTab === 'shipping' && (
                 <div className="space-y-3">
                   <div className="flex items-start">
                     <Package size={18} className="mr-3 mt-0.5 text-primary"/>
                     <div>
                       <h4 className="font-bold text-gray-900 dark:text-white">Processing Time</h4>
                       <p>Orders are processed within 1-2 business days.</p>
                     </div>
                   </div>
                   <div className="flex items-start">
                     <CreditCard size={18} className="mr-3 mt-0.5 text-primary"/>
                     <div>
                       <h4 className="font-bold text-gray-900 dark:text-white">Payment Methods</h4>
                       <p>{isCODAvailable ? 'Cash on Delivery (COD) available throughout Morocco.' : 'International orders require secure online payment via PayPal.'}</p>
                     </div>
                   </div>
                 </div>
              )}
            </div>
          </div>

          {/* PayPal Instruction Box (Show on toggle) */}
          {showPayPalInfo && (
            <div ref={payPalInfoRef} className="mb-6 relative bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border border-blue-200 dark:border-blue-700 rounded-2xl shadow-sm animate-fade-in">
               {/* Decorative accent */}
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
               <div className="p-5">
                  <h4 className="font-extrabold text-blue-900 dark:text-blue-100 mb-3 flex items-center text-lg">
                    <CreditCard size={20} className="mr-2.5 text-blue-600 dark:text-blue-400"/> 
                    Payment Required
                  </h4>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed font-medium">
                    Please send the payment via PayPal as "Friends & Family" to complete your order.
                  </p>
                  
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm mb-4 group relative">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Payment Method</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                       <strong className="text-blue-700 dark:text-blue-400 text-lg">PayPal</strong>
                    </div>
                    <div className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700 select-all">
                      bankmarouan@gmail.com
                    </div>
                    
                    {/* Friends & Family Warning - Shown for BOTH now as requested */}
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-bold flex items-center bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                       <AlertCircle size={12} className="mr-1.5"/> Important: Please select "Friends & Family".
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {isCODAvailable ? (
                      <div className="flex items-start gap-2 text-sm font-bold text-gray-800 dark:text-white bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/30">
                         <ArrowDown size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                         <span>
                           After payment, please click the <strong>"Cash On Delivery"</strong> button below to fill in your address and complete the order.
                         </span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-sm font-bold text-gray-800 dark:text-white bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/30">
                         <ArrowDown size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                         <span>
                           After payment, please click the <strong>"Order via WhatsApp"</strong> button below to finalize your order.
                         </span>
                      </div>
                    )}
                    
                    <p className="text-sm font-bold text-gray-800 dark:text-white flex items-start bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <Smartphone size={18} className="mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0"/>
                      Send a screenshot of the payment via WhatsApp to confirm.
                    </p>
                  </div>
               </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
            
            <div className="grid grid-cols-1 gap-3">
              {/* PayPal Toggle (Universal) - Placed at top for both types */}
              <button 
                onClick={() => setShowPayPalInfo(!showPayPalInfo)}
                disabled={isCustomLogo}
                className={`w-full py-3 font-bold rounded-xl shadow-md flex items-center justify-center transition-all ${
                  isCustomLogo 
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={isCustomLogo ? "Payment disabled when Custom Logo is active" : "Toggle Payment Info"}
              >
                <CreditCard size={20} className="mr-2" />
                {showPayPalInfo ? 'Hide Payment Info' : 'Pay via PayPal'}
              </button>

              {/* Secondary Action Button */}
              {isCODAvailable ? (
                 // Morocco: Show COD Button
                <button 
                  onClick={() => setIsCODOpen(true)}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-[1.02]"
                >
                  <Banknote size={22} className="mr-2" />
                  Cash On Delivery
                </button>
              ) : (
                // International Section
                <>
                    {/* Direct Payment via Gumroad */}
                    <a 
                       href={getGumroadLink(product.title)}
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all hover:scale-[1.02]"
                    >
                       <CreditCard size={22} className="mr-2" />
                       Pay via Visa / MasterCard
                    </a>

                    {/* WhatsApp Order Button */}
                    <button 
                      onClick={() => setIsInternationalFormOpen(true)}
                      className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-[1.02]"
                    >
                      <Smartphone size={22} className="mr-2" />
                      Order via WhatsApp
                    </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Nested COD Modal (Morocco) */}
      <CODModal 
        isOpen={isCODOpen} 
        onClose={() => setIsCODOpen(false)} 
        product={product}
        currencySymbol={currencySymbol}
        finalPrice={totalPriceStr} 
        onOpenGuidelines={onOpenGuidelines}
        onOrderSuccess={onOrderSuccess}
      />

      {/* Nested International Order Modal */}
      <InternationalOrderModal
        isOpen={isInternationalFormOpen}
        onClose={() => setIsInternationalFormOpen(false)}
        product={product}
        selection={{
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          finalPrice: totalPriceStr
        }}
        customization={{
          isCustomLogo,
          instructions: customInstructions,
          file: customLogoFile
        }}
        onOrderSuccess={onOrderSuccess}
      />

    </div>
  );
};

export default QuickViewModal;


import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, FileText, Trash2, AlertTriangle, Smartphone, CreditCard } from 'lucide-react';
import { CODFormData, Product } from '../types';

interface CODModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currencySymbol: string;
  finalPrice: string;
  onOpenGuidelines: () => void;
  onOrderSuccess: (details: any) => void;
}

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fez", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan", 
  "Safi", "Mohammedia", "Beni Mellal", "El Jadida", "Taza", "Nador", "Settat", "Larache", "Khemisset", 
  "Guelmim", "Berrechid", "Ouarzazate", "Al Hoceima", "Errachidia", "Tiznit", "Taroudant", "Essaouira", "Other"
];

const CODModal: React.FC<CODModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  currencySymbol, 
  finalPrice, 
  onOpenGuidelines,
  onOrderSuccess
}) => {
  const [formData, setFormData] = useState<CODFormData>({
    fullName: '',
    country: 'Morocco',
    city: '',
    zipCode: '',
    whatsapp: '',
    isCustomLogo: false,
    customInstructions: '',
    customLogoFile: null
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation: Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Maximum size is 10MB.");
        return;
      }

      // Validation: JPEG or PNG
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG or PNG image.");
        return;
      }

      setFormData(prev => ({ ...prev, customLogoFile: file }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, customLogoFile: null }));
  };

  const toggleCustomLogo = () => {
    setFormData(prev => ({ ...prev, isCustomLogo: !prev.isCustomLogo }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const message = `
*NEW COD ORDER* 📦
------------------
*Product:* ${product.title}
*Price:* ${finalPrice}
*Custom Logo:* ${formData.isCustomLogo ? 'YES ✅' : 'NO ❌'}
${formData.isCustomLogo ? `*Instructions:* ${formData.customInstructions}` : ''}
${formData.customLogoFile ? `*File Attached:* ${formData.customLogoFile.name}` : ''}

*Customer Details:*
Name: ${formData.fullName}
Country: ${formData.country}
City: ${formData.city}
Zip: ${formData.zipCode}
WhatsApp: ${formData.whatsapp}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    // Replace with your actual WhatsApp number
    const adminNumber = "+212723242286"; 
    window.open(`https://wa.me/${adminNumber}?text=${encodedMessage}`, '_blank');
    
    // Trigger Success Modal
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    onOrderSuccess({
      id: randomId,
      customerName: formData.fullName,
      productName: product.title,
      amount: finalPrice,
      date: now,
      paymentMethod: 'Cash On Delivery'
    });
    
    onClose();
  };

  // Improved input styling: More defined border and shadow in light mode
  const inputClass = "w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up flex flex-col">
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cash On Delivery Order</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 bg-transparent p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-200 flex items-center border border-blue-100 dark:border-blue-800">
             <span className="font-bold mr-2">Item:</span> {product.title} ({finalPrice})
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
              <input 
                required name="fullName" value={formData.fullName} onChange={handleChange}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Country *</label>
                <select 
                  required name="country" value={formData.country} onChange={handleChange}
                  className={`${inputClass} bg-gray-100 text-gray-600 cursor-not-allowed`}
                  disabled
                >
                  <option value="Morocco">Morocco</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                <select 
                  required name="city" value={formData.city} onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select City...</option>
                  {MOROCCAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Zip Code *</label>
               <input 
                  required name="zipCode" value={formData.zipCode} onChange={handleChange}
                  className={inputClass}
                  placeholder="12345"
                />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp Number *</label>
              <input 
                required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                className={inputClass}
                placeholder="+212 600 000 000"
              />
            </div>

            {/* Custom Logo Toggle */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-2">
               
               <div 
                 className="flex items-center justify-between mb-4 cursor-pointer select-none group bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-all shadow-sm hover:shadow-md" 
                 onClick={toggleCustomLogo}
               >
                 <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                   Add Custom Logo?
                 </span>
                 <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isCustomLogo ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${formData.isCustomLogo ? 'left-7' : 'left-1'}`}></div>
                 </div>
               </div>

               {/* Warning Message */}
               <div className="mb-4 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Make sure your design is at least 150 DPI and has a resolution of 3000 pixels or more for the best printing results! 
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); onOpenGuidelines(); }} 
                      className="text-primary underline ml-1.5 font-bold hover:text-indigo-600"
                    >
                      View Guidelines
                    </button>
                  </p>
               </div>
               
               {formData.isCustomLogo && (
                 <div className="animate-fade-in space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                   
                   <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Design Instructions</label>
                     <input 
                       type="text" name="customInstructions" value={formData.customInstructions} onChange={handleChange}
                       className={inputClass}
                       placeholder="E.g., Center chest, 10cm wide..."
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Upload Design</label>
                     
                     {!formData.customLogoFile ? (
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
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Click to upload image</span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                           Acceptable file formats JPEG and PNG <br/> Maximum file size 10 MB
                         </span>
                       </div>
                     ) : (
                       <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                         <div className="flex items-center overflow-hidden">
                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center flex-shrink-0">
                             <FileText size={20} />
                           </div>
                           <div className="ml-3 min-w-0">
                             <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{formData.customLogoFile.name}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">{(formData.customLogoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                           </div>
                         </div>
                         <button 
                           type="button" 
                           onClick={removeFile}
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     )}
                   </div>

                   {/* 50% Deposit Message for Custom Logo */}
                   <div className="mt-4 relative overflow-hidden bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 border border-yellow-200 dark:border-yellow-700 rounded-xl p-5 shadow-sm">
                     {/* Decorative accent */}
                     <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                     
                     <h4 className="font-extrabold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center text-lg">
                       <AlertTriangle size={20} className="mr-2.5 text-yellow-600" /> Payment Required
                     </h4>
                     
                     <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium leading-relaxed">
                       Please send half the product price so I can complete the printing process.
                     </p>
                     
                     <div className="space-y-4 text-xs bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 shadow-sm">
                        <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
                          <strong className="block text-primary mb-1 text-sm">CIH Bank</strong>
                          <div className="space-y-1 opacity-90">
                             <div className="flex justify-between"><span>Accountant:</span> <span className="font-bold">ANOUAR MAROUAN</span></div>
                             <div className="flex flex-col"><span>RIB:</span> <span className="font-bold select-all">230 815 2414040211007400 17</span></div>
                             <div className="flex flex-col"><span>IBAN:</span> <span className="font-bold select-all">MA64 2308 1524 1404 0211 0074 0017</span></div>
                             <div className="flex justify-between"><span>SWIFT:</span> <span className="font-bold select-all">CIHMMAMC</span></div>
                          </div>
                        </div>
                        <div>
                          <strong className="block text-blue-500 mb-1 text-sm">PayPal</strong>
                          <span className="select-all">bankmarouan@gmail.com</span>
                          <p className="mt-1 text-xs text-red-500 font-bold">Important: Please select "Friends & Family".</p>
                        </div>
                     </div>
                     
                     <p className="text-sm font-bold mt-4 text-gray-800 dark:text-white flex items-start bg-yellow-100/50 dark:bg-yellow-900/30 p-3 rounded-lg">
                       <Smartphone size={18} className="mr-2 mt-0.5 text-yellow-700 dark:text-yellow-500 flex-shrink-0"/>
                       Please send a screenshot of the payment via WhatsApp to [+212723242286].
                     </p>
                   </div>
                 </div>
               )}
            </div>
          </div>

          <div className="pt-4 pb-2">
            <button 
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center transform active:scale-95 text-lg"
            >
              <Check size={22} className="mr-2"/> Confirm Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CODModal;

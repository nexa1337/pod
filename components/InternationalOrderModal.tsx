
import React, { useState } from 'react';
import { X, Send, User, MapPin, Phone, Building, MessageSquare, Globe, Hash } from 'lucide-react';
import { Product } from '../types';

interface InternationalOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selection: {
    size: string;
    color: string;
    quantity: number;
    finalPrice: string;
  };
  customization: {
    isCustomLogo: boolean;
    instructions: string;
    file: File | null;
  };
  onOrderSuccess: (details: any) => void;
}

const InternationalOrderModal: React.FC<InternationalOrderModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  selection,
  customization,
  onOrderSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    orderNumber: '',
    address1: '',
    address2: '',
    company: '',
    whatsapp: '',
    country: '',
    state: '', // Mapped from "Retail shipping price" context as Region/State
    zip: '',
    city: '',
    personalMessage: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `
*NEW INTERNATIONAL ORDER* 🌍
---------------------------
*Product:* ${product.title}
*Price:* ${selection.finalPrice}
*Qty:* ${selection.quantity}
*Size:* ${selection.size}
*Color:* ${selection.color}

*Customization:*
Custom Logo: ${customization.isCustomLogo ? 'YES ✅' : 'NO ❌'}
${customization.isCustomLogo ? `Instructions: ${customization.instructions}` : ''}
${customization.file ? `File: ${customization.file.name} (Attached)` : ''}

*Shipping Details:*
Name: ${formData.fullName}
${formData.company ? `Company: ${formData.company}` : ''}
${formData.orderNumber ? `Order #: ${formData.orderNumber}` : ''}
Address 1: ${formData.address1}
${formData.address2 ? `Address 2: ${formData.address2}` : ''}
City: ${formData.city}
State/Region: ${formData.state}
Zip: ${formData.zip}
Country: ${formData.country}
WhatsApp: ${formData.whatsapp}

*Personal Message:*
${formData.personalMessage || 'N/A'}
    `.trim();

    const adminNumber = "+212723242286";
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Trigger Success Modal
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    onOrderSuccess({
      id: randomId,
      customerName: formData.fullName,
      productName: product.title,
      amount: selection.finalPrice,
      date: now,
      paymentMethod: 'International / PayPal'
    });

    onClose();
  };

  const inputClass = "w-full p-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder-gray-400";

  // Simple list of common countries excluding Morocco (as per request)
  const commonCountries = [
    "United States", "France", "Spain", "United Kingdom", "Germany", "Italy", 
    "Canada", "Belgium", "Netherlands", "Switzerland", "Portugal", "Saudi Arabia", 
    "UAE", "Qatar", "Other"
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
        
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0 bg-white dark:bg-gray-800 rounded-t-2xl">
          <div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <Globe className="text-blue-500" size={20}/> International Shipping
             </h3>
             <p className="text-xs text-gray-500 dark:text-gray-400">Complete the details below to finalize your order.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Contact Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <div className="relative">
                   <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                   <input required name="fullName" onChange={handleChange} className={`${inputClass} pl-10`} placeholder="John Doe" />
                </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">WhatsApp Number *</label>
                 <div className="relative">
                   <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"/>
                   <input required name="whatsapp" onChange={handleChange} className={`${inputClass} pl-10`} placeholder="+1 234 567 8900" />
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1 ml-1">For real-time delivery updates.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Order Number (Optional)</label>
                  <div className="relative">
                     <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                     <input name="orderNumber" onChange={handleChange} className={`${inputClass} pl-10`} placeholder="#1234" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Company (Optional)</label>
                  <div className="relative">
                     <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                     <input name="company" onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Business Name" />
                  </div>
               </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Shipping Address</h4>
            
            <div>
               <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Address Line 1 *</label>
               <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input required name="address1" onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Street address, P.O. box" />
               </div>
            </div>
            
            <div>
               <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Address Line 2 (Optional)</label>
               <input name="address2" onChange={handleChange} className={inputClass} placeholder="Apartment, suite, unit, building, floor" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <input required name="city" onChange={handleChange} className={inputClass} placeholder="City" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Postal / Zip Code *</label>
                  <input required name="zip" onChange={handleChange} className={inputClass} placeholder="Zip Code" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">State / Region *</label>
                  <input required name="state" onChange={handleChange} className={inputClass} placeholder="State / Province" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Country *</label>
                  <select required name="country" onChange={handleChange} className={inputClass}>
                     <option value="">Select Country</option>
                     {commonCountries.map(c => (
                       <option key={c} value={c}>{c}</option>
                     ))}
                  </select>
                  <p className="text-[10px] text-red-400 mt-1">Morocco shipping unavailable in this form.</p>
               </div>
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Personalized Message</h4>
            <div className="relative">
               <MessageSquare size={16} className="absolute left-3 top-4 text-gray-400"/>
               <textarea 
                 name="personalMessage" 
                 onChange={handleChange} 
                 className={`${inputClass} pl-10 min-h-[100px] resize-none`} 
                 placeholder="Include a personalized message with your order..."
               ></textarea>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all transform active:scale-95 mt-4"
          >
            <Send size={20} className="mr-2"/> Send to WhatsApp
          </button>

        </form>
      </div>
    </div>
  );
};

export default InternationalOrderModal;

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query 
    ? PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center pt-20 px-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
       
       <div className="relative w-full max-w-2xl animate-fade-in">
         <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
           <input 
             ref={inputRef}
             type="text" 
             placeholder="Search for products..."
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-14 pr-12 py-4 rounded-xl shadow-2xl text-lg outline-none ring-2 ring-transparent focus:ring-primary transition-all"
           />
           <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
             <X size={24} />
           </button>
         </div>

         {query && (
           <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
             {filtered.length > 0 ? (
               <ul>
                 {filtered.map(p => (
                   <li key={p.id} className="border-b border-gray-100 dark:border-gray-700 last:border-none">
                     <a href="#products" onClick={onClose} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                       <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded object-cover mr-4" />
                       <div className="flex-1">
                         <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{p.title}</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400">${p.price}</p>
                       </div>
                       <ArrowRight size={16} className="text-gray-300 group-hover:text-primary" />
                     </a>
                   </li>
                 ))}
               </ul>
             ) : (
               <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                 No results found for "{query}"
               </div>
             )}
           </div>
         )}
       </div>
    </div>
  );
};

export default SearchOverlay;
import React from 'react';
import { X, Heart, ShoppingBag, Trash2, Eye } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  removeFromWishlist: (id: string) => void;
  onViewProduct: (product: Product) => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ 
  isOpen, 
  onClose, 
  wishlistIds, 
  removeFromWishlist,
  onViewProduct
}) => {
  const wishlistProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="mr-2 text-red-500 fill-red-500" size={20} /> Your Wishlist ({wishlistIds.length})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
           {wishlistProducts.length > 0 ? (
             <div className="space-y-4">
               {wishlistProducts.map(product => (
                 <div key={product.id} className="flex bg-gray-50 dark:bg-gray-800 p-3 rounded-xl gap-4 border border-gray-100 dark:border-gray-700">
                   <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                     <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{product.title}</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">${product.price}</p>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => { onClose(); onViewProduct(product); }}
                         className="flex-1 py-1.5 px-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg flex items-center justify-center hover:opacity-90"
                       >
                         <Eye size={14} className="mr-1"/> View
                       </button>
                       <button 
                         onClick={() => removeFromWishlist(product.id)}
                         className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                         title="Remove"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
               <Heart size={64} className="mb-4 opacity-20" />
               <p className="text-lg font-semibold mb-2">Your wishlist is empty</p>
               <p className="text-sm mb-6">Save items you love to review them later.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
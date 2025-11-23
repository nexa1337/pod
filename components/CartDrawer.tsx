import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // Mock cart empty state
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          ></div>
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold dark:text-white flex items-center">
                <ShoppingBag className="mr-2" size={20} /> Your Bag (0)
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500 dark:text-gray-400">
               <ShoppingBag size={64} className="mb-4 opacity-20" />
               <p className="text-lg font-semibold mb-2">Your bag is empty</p>
               <p className="text-sm mb-6">Looks like you haven't added any gear yet.</p>
               <button 
                 onClick={onClose}
                 className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-indigo-600 transition-colors"
               >
                 Start Shopping
               </button>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
               <div className="flex justify-between mb-4 text-sm font-bold text-gray-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>$0.00</span>
               </div>
               <button disabled className="w-full py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 font-bold rounded-lg cursor-not-allowed flex justify-center items-center">
                  Checkout <ArrowRight size={16} className="ml-2" />
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
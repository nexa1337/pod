import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { GUIDELINES_CONTENT } from '../data';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mistakes' | 'guidelines'>('mistakes');

  if (!isOpen) return null;

  const handleAgree = () => {
    // Send data to WhatsApp
    const message = "Hi, I have read the printing guidelines and mistakes to avoid. I would like to start a custom order.";
    const encodedMessage = encodeURIComponent(message);
    const adminNumber = "1234567890"; 
    window.open(`https://wa.me/${adminNumber}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Important Printing Information
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button 
            onClick={() => setActiveTab('mistakes')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'mistakes' ? 'bg-white dark:bg-gray-900 text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Mistakes to Avoid
          </button>
          <button 
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'guidelines' ? 'bg-white dark:bg-gray-900 text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Printing Guidelines
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
           <div className="prose dark:prose-invert max-w-none">
              {activeTab === 'mistakes' ? (
                 <div dangerouslySetInnerHTML={{ __html: GUIDELINES_CONTENT.mistakes }} />
              ) : (
                 <div dangerouslySetInnerHTML={{ __html: GUIDELINES_CONTENT.guidelines }} />
              )}
           </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-end items-center gap-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 font-semibold">
            Cancel
          </button>
          <button 
            onClick={handleAgree}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow flex items-center transition-transform hover:scale-105"
          >
            I Agree & Continue to WhatsApp <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuidelinesModal;
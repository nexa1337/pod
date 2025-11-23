import React, { useState } from 'react';
import { X, Check, Download } from 'lucide-react';
import { jsPDF } from "jspdf";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    id: string;
    customerName: string;
    productName: string;
    amount: string;
    date: string;
    paymentMethod: string;
  } | null;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, orderDetails }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !orderDetails) return null;

  // Explicitly set background color for QR code to white to ensure visibility in dark mode
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`NEXA-ORDER-${orderDetails.id}`)}&bgcolor=ffffff`;

  const handleDownloadInvoice = () => {
    setIsDownloading(true);

    try {
      const doc = new jsPDF();

      // -- Styling Constants --
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const centerX = pageWidth / 2;
      let yPos = 20;

      // -- Header --
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(20, 20, 20); // Dark Gray
      doc.text("N E X A  1 3 3 7", centerX, yPos, { align: "center" });
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("P O D   M A S T E R S", centerX, yPos, { align: "center" });
      
      yPos += 15;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("OFFICIAL INVOICE", margin, yPos);

      yPos += 5;
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      // -- Order Details --
      yPos += 15;
      
      // Left Column
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BILLED TO:", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(orderDetails.customerName, margin, yPos + 6);
      doc.text(orderDetails.paymentMethod, margin, yPos + 12);

      // Right Column
      doc.setFont("helvetica", "bold");
      doc.text("ORDER #:", pageWidth - margin - 40, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(orderDetails.id, pageWidth - margin, yPos, { align: "right" });
      
      doc.setFont("helvetica", "bold");
      doc.text("DATE:", pageWidth - margin - 40, yPos + 6);
      doc.setFont("helvetica", "normal");
      doc.text(orderDetails.date, pageWidth - margin, yPos + 6, { align: "right" });

      // -- Items Table --
      yPos += 30;
      
      // Table Header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("DESCRIPTION", margin + 5, yPos + 7);
      doc.text("AMOUNT", pageWidth - margin - 5, yPos + 7, { align: "right" });

      // Table Body
      yPos += 18;
      doc.setFont("helvetica", "normal");
      doc.text(orderDetails.productName, margin + 5, yPos);
      doc.text(orderDetails.amount, pageWidth - margin - 5, yPos, { align: "right" });

      yPos += 5;
      doc.setDrawColor(220);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      // -- Total --
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("TOTAL", pageWidth - margin - 50, yPos);
      doc.text(orderDetails.amount, pageWidth - margin - 5, yPos, { align: "right" });

      // -- Footer --
      yPos = 260; // Bottom of page
      doc.setDrawColor(0);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      
      yPos += 10;
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for your business.", centerX, yPos, { align: "center" });
      doc.text("For support, contact +212 600 000 000 or hello@nexa1337.ma", centerX, yPos + 5, { align: "center" });

      // Save PDF
      doc.save(`NEXA_Invoice_${orderDetails.id}.pdf`);
      setIsDownloading(false);

    } catch (error) {
      console.error("Error generating PDF", error);
      setIsDownloading(false);
      alert("Could not generate PDF. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-lg animate-fade-in-up">
        
        {/* Success Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 animate-bounce">
            <Check size={40} className="text-white" strokeWidth={4} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Order Placed!</h2>
          <p className="text-gray-300 text-lg">Thank you for trusting <span className="text-primary font-bold">N E X A 1337</span>.</p>
          <p className="text-sm text-gray-500 mt-1">Your order is being processed.</p>
        </div>

        {/* TICKET DESIGN */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Ticket Header */}
          <div className="bg-gray-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div>
               <div className="text-xl font-black italic tracking-widest text-white leading-none mb-1">
                  N E X A <span className="text-primary">1337</span>
               </div>
               <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Official Receipt</div>
             </div>
             <div className="text-right">
                <div className="text-xs text-gray-400 uppercase">Order ID</div>
                <div className="font-mono font-bold text-primary tracking-wider">#{orderDetails.id}</div>
             </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 relative">
            {/* Cutout Effect */}
            <div className="absolute top-0 left-0 w-6 h-6 bg-black/90 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 right-0 w-6 h-6 bg-black/90 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-6 right-6 border-t-2 border-dashed border-gray-200 dark:border-gray-700 opacity-50"></div>

            <div className="flex flex-col md:flex-row gap-6 pt-4">
              {/* QR Code Section - Adjusted container */}
              <div className="flex flex-col items-center justify-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <img 
                    src={qrUrl} 
                    alt="Order QR" 
                    className="w-24 h-24 rounded-lg" 
                    style={{ imageRendering: 'pixelated' }}
                />
                <span className="text-[10px] uppercase font-bold text-gray-500 mt-2 tracking-wider">Scan to Verify</span>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div>
                   <span className="text-xs text-gray-500 uppercase font-bold">Customer</span>
                   <div className="font-bold text-gray-900 dark:text-white truncate">{orderDetails.customerName}</div>
                </div>
                <div>
                   <span className="text-xs text-gray-500 uppercase font-bold">Product</span>
                   <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{orderDetails.productName}</div>
                </div>
                <div className="flex justify-between">
                   <div>
                     <span className="text-xs text-gray-500 uppercase font-bold">Date</span>
                     <div className="font-medium text-gray-900 dark:text-white text-sm">{orderDetails.date}</div>
                   </div>
                   <div className="text-right">
                     <span className="text-xs text-gray-500 uppercase font-bold">Total</span>
                     <div className="font-bold text-primary text-lg">{orderDetails.amount}</div>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="mt-6 flex items-center justify-center">
               <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                 <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                 Pending Verification
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
            <button 
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="flex items-center justify-center py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-70"
            >
               {isDownloading ? (
                 <span className="flex items-center"><div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div> Generating...</span>
               ) : (
                 <>
                   <Download size={16} className="mr-2" /> Download PDF
                 </>
               )}
            </button>
            <button 
              onClick={onClose}
              className="flex items-center justify-center py-3 bg-primary text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors text-sm shadow-lg shadow-indigo-500/20"
            >
              Close Ticket
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Please check your WhatsApp for real-time updates.</p>
        </div>
        
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>

      </div>
    </div>
  );
};

export default OrderSuccessModal;
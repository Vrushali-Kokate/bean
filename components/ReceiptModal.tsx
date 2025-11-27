import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up print:shadow-none print:w-full print:max-w-none print:fixed print:inset-0 print:z-[300]">
        
        {/* Modal Header - Hidden in Print */}
        <div className="bg-coffee-900 p-4 flex justify-between items-center print:hidden">
          <h2 className="text-white font-serif font-bold flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
            Order Confirmed
          </h2>
          <button onClick={onClose} className="text-coffee-200 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-8 bg-white font-mono text-sm print:p-0">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-coffee-900 uppercase tracking-widest mb-2">Aroma & Bean</h1>
            <p className="text-gray-500">123 Coffee Lane, Brew City</p>
            <p className="text-gray-500">www.aromaandbean.com</p>
          </div>

          <div className="border-b-2 border-dashed border-gray-300 mb-4 pb-4">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-bold">#{order.id.slice(-6)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Date:</span>
              <span>{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Table:</span>
              <span className="font-bold">{order.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guest:</span>
              <span>{order.customerName}</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div className="flex">
                  <span className="w-6 text-center font-bold">{item.quantity}</span>
                  <span>{item.name}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Discount ({order.discountCode})</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Tax (10%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
              <span>TOTAL</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            {/* Fake Barcode */}
            <div className="h-12 bg-gray-800 mx-auto w-3/4 opacity-80" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #000 2px, #000 4px)'
            }}></div>
            <p className="text-xs text-gray-400">Thank you for dining with us!</p>
          </div>
        </div>

        {/* Action Footer - Hidden in Print */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-coffee-900 text-white py-3 rounded-lg font-bold hover:bg-coffee-800 transition-colors flex items-center justify-center"
          >
            <Printer className="mr-2 h-5 w-5" />
            Print Receipt
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
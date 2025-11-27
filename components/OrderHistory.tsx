import React from 'react';
import { X, Clock, Calendar, Coffee } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 bg-coffee-50 border-b border-coffee-100 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-coffee-900 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-coffee-600" />
            Order History
          </h2>
          <button onClick={onClose} className="text-coffee-500 hover:text-coffee-800 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {orders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-coffee-400">
              <Coffee className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No past orders yet</p>
              <p className="text-sm mt-2">Your coffee journey begins with a single sip.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-coffee-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-coffee-50/50 px-6 py-3 flex flex-wrap justify-between items-center gap-2 border-b border-coffee-50">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-coffee-800">#{order.id.slice(-6)}</span>
                      <div className="flex items-center text-xs text-coffee-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(order.date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <span className="text-accent font-bold">${order.total.toFixed(2)}</span>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <ul className="space-y-3">
                      {order.items.map((item, idx) => (
                        <li key={`${order.id}-${idx}`} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span className="font-bold text-coffee-900 w-6">{item.quantity}x</span>
                            <span className="text-coffee-700">{item.name}</span>
                          </div>
                          <span className="text-coffee-500">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-coffee-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-coffee-100 text-coffee-800 rounded-lg hover:bg-coffee-200 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
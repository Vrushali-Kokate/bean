import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { CartItem, DiscountCode } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: (discountCode?: DiscountCode) => void;
  onApplyDiscount: (code: string) => Promise<DiscountCode | null>;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout, onApplyDiscount }) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percent') {
      discountAmount = subtotal * (appliedDiscount.value / 100);
    } else {
      discountAmount = appliedDiscount.value;
    }
  }
  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);
  
  const total = subtotal - discountAmount;

  const handleApplyCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplying(true);
    setDiscountError('');
    
    try {
      const discount = await onApplyDiscount(promoCode);
      if (discount) {
        setAppliedDiscount(discount);
        setPromoCode('');
      } else {
        setDiscountError('Invalid code');
        setAppliedDiscount(null);
      }
    } catch (e) {
      setDiscountError('Error checking code');
    } finally {
      setIsApplying(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setPromoCode('');
    setDiscountError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-6 py-4 bg-coffee-50 border-b border-coffee-100 flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-coffee-900 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Your Order
            </h2>
            <button onClick={onClose} className="text-coffee-500 hover:text-coffee-800 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-coffee-400">
                <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <button onClick={onClose} className="mt-4 text-accent hover:underline">
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-white rounded-lg">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover border border-coffee-100" />
                    <div className="flex-1">
                      <h3 className="font-bold text-coffee-900">{item.name}</h3>
                      <p className="text-accent font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center mt-2 space-x-3">
                        <div className="flex items-center border border-coffee-200 rounded-md">
                            <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="p-1 hover:bg-coffee-50 text-coffee-600"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm font-medium text-coffee-900">{item.quantity}</span>
                            <button 
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="p-1 hover:bg-coffee-50 text-coffee-600"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                        <button 
                            onClick={() => onUpdateQuantity(item.id, -item.quantity)}
                            className="text-coffee-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-coffee-50 border-t border-coffee-100">
              {/* Discount Section */}
              <div className="mb-4">
                {appliedDiscount ? (
                  <div className="flex justify-between items-center bg-green-100 px-3 py-2 rounded border border-green-200">
                    <span className="text-green-700 text-sm font-medium flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      Code: {appliedDiscount.code}
                    </span>
                    <button onClick={removeDiscount} className="text-green-700 hover:text-green-900">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo Code"
                      className="flex-1 px-3 py-2 text-sm border border-coffee-200 rounded focus:outline-none focus:border-accent"
                    />
                    <button 
                      onClick={handleApplyCode}
                      disabled={!promoCode || isApplying}
                      className="bg-coffee-200 text-coffee-800 px-3 py-2 rounded text-sm font-medium hover:bg-coffee-300 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {discountError && <p className="text-red-500 text-xs mt-1">{discountError}</p>}
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-coffee-600">Subtotal</span>
                <span className="font-bold text-coffee-900">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between items-center mb-2 text-green-600">
                  <span className="text-sm">Discount</span>
                  <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-4 text-sm text-coffee-500">
                 <span>Taxes (calculated next)</span>
                 <span>--</span>
              </div>

              <div className="flex justify-between items-center mb-4 pt-2 border-t border-coffee-200">
                <span className="text-lg font-bold text-coffee-900">Total</span>
                <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => onCheckout(appliedDiscount || undefined)}
                className="w-full bg-coffee-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-accent transition-colors shadow-lg flex justify-center items-center"
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
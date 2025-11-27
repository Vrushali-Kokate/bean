import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import CartDrawer from './components/CartDrawer';
import OrderHistory from './components/OrderHistory';
import WelcomeModal from './components/WelcomeModal';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import SteamBackground from './components/SteamBackground';
import ReceiptModal from './components/ReceiptModal';
import { MenuItem, CartItem, Order, DiscountCode } from './types';
import * as db from './services/backend';

const TAX_RATE = 0.10; // 10% tax

const App: React.FC = () => {
  // App Mode State
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Customer Data State
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);

  // Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  
  // Receipt State
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  // UI State
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      // Load Menu from Backend
      const items = await db.getMenu();
      setMenuItems(items);
      
      // Load History
      const orders = await db.getOrders();
      setOrderHistory(orders);
    };
    init();

    // Listener for external updates (optional for multi-tab sync)
    window.addEventListener('storage', init);
    return () => window.removeEventListener('storage', init);
  }, [isAdminMode]); // Re-run when admin mode toggles to ensure menu/orders are fresh

  const handleUserEntry = (name: string, table: string) => {
    setCustomerName(name);
    setTableNumber(table);
    setIsWelcomeModalOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to order`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleApplyDiscount = async (code: string) => {
    return await db.validateDiscountCode(code);
  };

  const handleCheckout = async (discountCode?: DiscountCode) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let discountAmount = 0;
    if (discountCode) {
       if (discountCode.type === 'percent') {
         discountAmount = subtotal * (discountCode.value / 100);
       } else {
         discountAmount = discountCode.value;
       }
    }
    discountAmount = Math.min(discountAmount, subtotal);

    const tax = (subtotal - discountAmount) * TAX_RATE;
    const total = (subtotal - discountAmount) + tax;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cartItems],
      subtotal,
      discountCode: discountCode?.code,
      discountAmount,
      tax,
      total,
      tableNumber,
      customerName,
      status: 'pending'
    };

    // Save to Backend
    await db.createOrder(newOrder);
    
    // Update local state
    setOrderHistory(prev => [newOrder, ...prev]);
    setLastOrder(newOrder);
    
    // Cleanup
    setCartItems([]);
    setIsCartOpen(false);
    
    // Show Receipt
    setIsReceiptOpen(true);
  };

  const handleRecommendation = (item: MenuItem) => {
    setHighlightedItemId(item.id);
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => setHighlightedItemId(null), 3000);
  };

  // Render Admin View
  if (isAdminMode) {
    return <AdminDashboard onLogout={() => setIsAdminMode(false)} />;
  }

  // Render Customer View
  return (
    <div className="min-h-screen font-sans text-coffee-900 selection:bg-accent selection:text-white relative">
      {/* Background Effect */}
      <SteamBackground />

      {isWelcomeModalOpen && <WelcomeModal onSubmit={handleUserEntry} />}
      
      <Header 
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
        onHistoryClick={() => setIsHistoryOpen(true)}
      />
      
      <main className="relative z-10">
        <Hero onRecommend={handleRecommendation} />
        
        <div className="bg-coffee-50 py-2 text-center text-sm text-coffee-600 border-b border-coffee-100">
            Ordering for: <span className="font-bold">{customerName}</span> at <span className="font-bold">Table {tableNumber}</span>
        </div>

        <Menu 
          items={menuItems} 
          onAddToCart={handleAddToCart}
          highlightedItemId={highlightedItemId}
        />
      </main>

      <footer className="bg-coffee-900 text-coffee-200 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif text-2xl font-bold text-white mb-4">Aroma & Bean</p>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>
          <p className="text-sm opacity-60 mb-4">© {new Date().getFullYear()} Aroma & Bean. Crafted with Coffee & Code.</p>
          
          {/* Secret Admin Link */}
          <button 
            onClick={() => setIsAdminMode(true)}
            className="text-xs text-coffee-700 hover:text-coffee-500 transition-colors"
          >
            Staff Login
          </button>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        onApplyDiscount={handleApplyDiscount}
      />

      <OrderHistory 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        // orders={orderHistory.filter(o => o.customerName === customerName)} 
        orders={orderHistory}
      />

      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={lastOrder}
      />

      <Toast 
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
};

export default App;
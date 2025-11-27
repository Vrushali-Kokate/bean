import React from 'react';
import { ShoppingBag, Coffee, History } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onMenuClick, onHistoryClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-coffee-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={onMenuClick}>
            <div className="bg-coffee-800 p-2 rounded-lg">
                <Coffee className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-serif font-bold text-coffee-900 tracking-tight">
              Aroma & Bean
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={onMenuClick} className="text-coffee-700 hover:text-accent font-medium transition-colors">Menu</button>
            <button className="text-coffee-700 hover:text-accent font-medium transition-colors">Our Story</button>
            <button className="text-coffee-700 hover:text-accent font-medium transition-colors">Locations</button>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={onHistoryClick}
              className="p-2 text-coffee-700 hover:text-accent transition-colors"
              title="Order History"
            >
              <History className="h-6 w-6" />
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 text-coffee-700 hover:text-accent transition-colors group"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
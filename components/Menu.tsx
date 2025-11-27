import React, { useState } from 'react';
import { Category, MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  highlightedItemId?: string | null;
}

const Menu: React.FC<MenuProps> = ({ items, onAddToCart, highlightedItemId }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Generate categories dynamically from the items to ensure new admin-added categories show up
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 mb-4">Our Menu</h2>
        <p className="text-coffee-600 max-w-2xl mx-auto">
          Crafted with passion, brewed with precision. Explore our selection of ethically sourced coffees and artisanal pastries.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto no-scrollbar space-x-4 mb-12 justify-start md:justify-center pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-coffee-800 text-white shadow-md transform scale-105'
                : 'bg-white text-coffee-600 border border-coffee-200 hover:border-coffee-400 hover:text-coffee-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
            const isHighlighted = highlightedItemId === item.id;
            return (
                <div 
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    className="relative group rounded-2xl"
                >
                    {/* Gemini Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
                    
                    <div 
                        className={`relative h-full bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border ${isHighlighted ? 'ring-4 ring-accent ring-offset-2 border-transparent' : 'border-coffee-100'}`}
                    >
                        <div className="relative h-64 overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        </div>
                        
                        <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-coffee-900 font-serif">{item.name}</h3>
                            <span className="text-lg font-semibold text-accent">${item.price.toFixed(2)}</span>
                        </div>
                        
                        <p className="text-coffee-600 text-sm mb-4 line-clamp-2">
                            {item.description}
                        </p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-coffee-50">
                            <span className="text-xs text-coffee-400 font-medium">{item.calories} cal</span>
                            <button
                            onClick={() => onAddToCart(item)}
                            className="flex items-center space-x-1 bg-coffee-50 text-coffee-800 hover:bg-coffee-800 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                            >
                            <Plus className="h-4 w-4" />
                            <span>Add to Order</span>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </section>
  );
};

export default Menu;
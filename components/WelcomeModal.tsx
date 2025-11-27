import React, { useState } from 'react';
import { Coffee, Utensils } from 'lucide-react';

interface WelcomeModalProps {
  onSubmit: (name: string, table: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [table, setTable] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !table.trim()) {
      setError('Please enter both your name and table number.');
      return;
    }
    onSubmit(name, table);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-coffee-900/90 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-coffee-800 p-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-coffee-700 rounded-full mb-4">
            <Coffee className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Welcome to Aroma & Bean</h2>
          <p className="text-coffee-200 mt-2">Please enter your details to start ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-coffee-700 mb-1">Table Number</label>
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-coffee-400" />
              <input
                type="text"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="e.g., 12"
                className="w-full pl-10 pr-4 py-3 border border-coffee-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-3 border border-coffee-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
          >
            Start Ordering
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeModal;
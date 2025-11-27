import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getCoffeeRecommendation } from '../services/geminiService';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../constants';

interface HeroProps {
  onRecommend: (item: MenuItem) => void;
}

const Hero: React.FC<HeroProps> = ({ onRecommend }) => {
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{item: MenuItem, reason: string} | null>(null);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsLoading(true);
    setRecommendation(null);

    try {
      const result = await getCoffeeRecommendation(mood);
      if (result) {
        const item = MENU_ITEMS.find(i => i.id === result.menuItemId);
        if (item) {
          setRecommendation({ item, reason: result.reasoning });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-coffee-900 overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
          poster="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
        >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-into-a-cup-518-large.mp4" type="video/mp4" />
            <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Cafe Ambience"
            />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-900 via-coffee-900/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="md:w-2/3 lg:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Sip Into Something <br />
            <span className="text-accent">Extraordinary</span>
          </h1>
          <p className="text-lg text-coffee-100 mb-8 leading-relaxed">
            Experience the perfect blend of artisanal coffee and modern convenience. 
            Order ahead or let our AI Barista find your perfect cup.
          </p>

          {/* AI Barista Interface */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="text-white font-semibold">AI Barista Recommender</h3>
            </div>
            
            {!recommendation ? (
              <form onSubmit={handleAskAi} className="relative">
                <input
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="How are you feeling? (e.g., 'Tired & need focus')"
                  className="w-full bg-white/90 text-coffee-900 placeholder-coffee-400 rounded-lg px-4 py-3 pr-32 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !mood.trim()}
                  className="absolute right-1 top-1 bottom-1 bg-coffee-800 hover:bg-coffee-700 text-white px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Thinking...</span>
                  ) : (
                    <>
                      Suggest
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-start space-x-4">
                  <img 
                    src={recommendation.item.image} 
                    alt={recommendation.item.name} 
                    className="w-16 h-16 rounded-lg object-cover border border-white/20"
                  />
                  <div className="flex-1">
                    <p className="text-coffee-100 text-sm italic mb-1">"{recommendation.reason}"</p>
                    <h4 className="text-white font-bold text-lg">{recommendation.item.name}</h4>
                    <div className="mt-2 flex space-x-2">
                        <button 
                            onClick={() => {
                                onRecommend(recommendation.item);
                                setRecommendation(null);
                                setMood('');
                            }}
                            className="text-xs bg-accent hover:bg-amber-600 text-white px-3 py-1.5 rounded font-medium transition-colors"
                        >
                            View Item
                        </button>
                        <button 
                            onClick={() => setRecommendation(null)}
                            className="text-xs text-coffee-300 hover:text-white underline px-2 py-1.5"
                        >
                            Try again
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
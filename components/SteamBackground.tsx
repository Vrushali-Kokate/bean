import React from 'react';

const SteamBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* CSS Styles injected specifically for this component */}
      <style>{`
        @keyframes rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) scale(3);
            opacity: 0;
          }
        }
        .steam-particle {
          position: absolute;
          bottom: -20px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          filter: blur(20px);
          animation: rise 15s infinite linear;
        }
      `}</style>
      
      {/* Generate random steam particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="steam-particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            animationDuration: `${15 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * -15}s`,
            opacity: 0.3 + Math.random() * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default SteamBackground;
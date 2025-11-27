import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[150] animate-fade-in-up">
      <div className="bg-coffee-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;

import React, { useState, useEffect, useCallback } from 'react';
import { getMotivationalThought } from '../services/geminiService';
import { Lightbulb, X } from 'lucide-react';

export const MotivationalPopup: React.FC = () => {
  const [thought, setThought] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  const fetchThought = useCallback(async () => {
    const newThought = await getMotivationalThought();
    setThought(newThought);
    setIsVisible(true);
    // Auto hide after 10 seconds
    setTimeout(() => setIsVisible(false), 10000);
  }, []);

  useEffect(() => {
    // Show one immediately
    fetchThought();
    
    // Set interval for 1 hour (3600000 ms)
    const interval = setInterval(fetchThought, 3600000);
    return () => clearInterval(interval);
  }, [fetchThought]);

  if (!isVisible || !thought) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm animate-bounce-slow">
      <div className="bg-white border-l-4 border-indigo-600 rounded-lg shadow-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-indigo-50 rounded-full">
          <Lightbulb className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Hourly Motivation</p>
          <p className="text-sm text-gray-600 mt-1 italic">"{thought}"</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { PartyPopper, Cake, Star } from 'lucide-react';

interface Props {
  birthdayUsers: User[];
}

export const BirthdayCelebration: React.FC<Props> = ({ birthdayUsers }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (birthdayUsers.length > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [birthdayUsers]);

  if (!show || birthdayUsers.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
        
        <div className="flex justify-center gap-2 mb-4">
          <PartyPopper className="w-12 h-12 text-pink-500 animate-bounce" />
          <Cake className="w-12 h-12 text-yellow-500 animate-bounce delay-75" />
          <Star className="w-12 h-12 text-blue-500 animate-bounce delay-150" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Happy Birthday!</h2>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {birthdayUsers.map(user => (
            <div key={user.id} className="text-center">
              <img src={user.photo} className="w-20 h-20 rounded-full border-4 border-indigo-200 mx-auto mb-2" alt={user.name} />
              <p className="font-bold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.designation}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-600 mt-6 text-lg italic">"Wishing you a wonderful day filled with joy and success!"</p>
        
        <button 
          onClick={() => setShow(false)}
          className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
        >
          Let's Celebrate!
        </button>
      </div>
    </div>
  );
};


import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ];

  return (
    <div className="flex justify-around items-center h-16">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id as ViewState)}
          className={`p-2 transition-colors ${
            (activeView === item.id || (activeView === 'chat' && item.id === 'home')) ? 'text-black' : 'text-gray-400'
          }`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;

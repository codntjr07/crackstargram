
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
    { id: 'search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Search' },
  ];

  return (
    <div className="flex flex-col h-full py-8 px-4">
      <div className="mb-10 px-2 flex items-center">
        <span className="text-2xl font-bold tracking-tighter">crack</span>
        <svg className="w-6 h-6 ml-0.5 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewState)}
            className={`flex items-center space-x-4 w-full p-3 rounded-lg transition-colors ${
              (activeView === item.id || (activeView === 'chat' && item.id === 'home')) ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

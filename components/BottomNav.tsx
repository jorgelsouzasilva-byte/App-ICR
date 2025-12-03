import React, { useState } from 'react';
import { NavItem } from '../types';
import { Home, BookOpen, Calendar, Heart, Tv, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: NavItem.HOME, icon: Home, label: 'Início' },
    { id: NavItem.BIBLE_STUDIES, icon: BookOpen, label: 'Estudos' },
    { id: NavItem.EVENTS, icon: Calendar, label: 'Eventos' },
    { id: NavItem.CONTRIBUTIONS, icon: Heart, label: 'Doar' },
    { id: NavItem.LIVE_STREAM, icon: Tv, label: 'Ao Vivo' },
    { id: NavItem.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl px-2 py-4 flex justify-between items-center z-40 border border-white/50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full gap-1 transition-all duration-300 group relative`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-y-[-4px]' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                <item.icon
                className={`w-5 h-5`}
                strokeWidth={isActive ? 2.5 : 2}
                />
            </div>
            {/* 
            <span className={`text-[10px] font-bold tracking-tight transition-all ${isActive ? 'text-blue-600' : 'text-slate-300 scale-0 h-0'}`}>
              {item.label}
            </span>
            */}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
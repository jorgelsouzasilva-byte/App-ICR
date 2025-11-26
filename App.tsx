import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import BibleStudies from './views/BibleStudies';
import EventsCalendar from './views/EventsCalendar';
import Contributions from './views/Contributions';
import LiveStream from './views/LiveStream';
import Profile from './views/Profile';
import SmallGroups from './views/SmallGroups';
import AdminDashboard from './views/AdminDashboard';
import { NavItem } from './types';
import { HandHeart, Users, ChevronRight, Play } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>(NavItem.HOME);

  const renderContent = () => {
    switch (activeTab) {
      case NavItem.BIBLE_STUDIES:
        return <BibleStudies />;
      case NavItem.EVENTS:
        return <EventsCalendar />;
      case NavItem.CONTRIBUTIONS:
        return <Contributions />;
      case NavItem.LIVE_STREAM:
        return <LiveStream />;
      case NavItem.PROFILE:
        return <Profile onAdminClick={() => setActiveTab(NavItem.ADMIN)} />;
      case NavItem.GROUPS:
        return <SmallGroups onBack={() => setActiveTab(NavItem.HOME)} />;
      case NavItem.ADMIN:
        return <AdminDashboard onBack={() => setActiveTab(NavItem.PROFILE)} />;
      case NavItem.HOME:
      default:
        return <HomeDashboard onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] md:p-10">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[440px] h-[100dvh] bg-[#f8f9fa] flex flex-col relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden md:h-[90vh] md:rounded-[2.5rem] border-0">
        
        {activeTab !== NavItem.ADMIN && <Header activeTab={activeTab} />}

        <main className={`flex-1 overflow-y-auto ${activeTab === NavItem.ADMIN ? '' : 'pb-28'} scroll-smooth no-scrollbar`}>
          {renderContent()}
        </main>

        {activeTab !== NavItem.ADMIN && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}

// Simple Home Dashboard Component
const HomeDashboard = ({ onChangeTab }: { onChangeTab: (tab: NavItem) => void }) => {
  return (
    <div className="p-6 space-y-8">
      
      {/* Visual Verse of the Day Card */}
      <div className="relative h-56 rounded-[2rem] overflow-hidden shadow-soft-lg group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
        <img 
            src="https://picsum.photos/800/400?grayscale&blur=2" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <h2 className="text-2xl font-bold mb-3">Bem-vinda, Sarah!</h2>
            <p className="opacity-95 leading-relaxed font-serif text-xl italic drop-shadow-md">
            "Porque, onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles."
            </p>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-4 block">— Mateus 18:20</span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onChangeTab(NavItem.LIVE_STREAM)}
          className="bg-white p-5 rounded-[1.5rem] shadow-soft hover:shadow-soft-lg flex flex-col items-start justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
              <span className="font-bold text-slate-700 text-lg block">Ao Vivo</span>
              <span className="text-xs text-slate-400 font-medium">Assista agora</span>
          </div>
        </button>

        <button 
          onClick={() => onChangeTab(NavItem.CONTRIBUTIONS)}
          className="bg-white p-5 rounded-[1.5rem] shadow-soft hover:shadow-soft-lg flex flex-col items-start justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
        >
           <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div>
              <span className="font-bold text-slate-700 text-lg block">Doar</span>
              <span className="text-xs text-slate-400 font-medium">Contribuir</span>
          </div>
        </button>

        <button 
          className="bg-white p-5 rounded-[1.5rem] shadow-soft hover:shadow-soft-lg flex flex-col items-start justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
        >
           <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
             <HandHeart className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
              <span className="font-bold text-slate-700 text-lg block">Oração</span>
              <span className="text-xs text-slate-400 font-medium">Pedidos</span>
          </div>
        </button>

        <button 
          onClick={() => onChangeTab(NavItem.GROUPS)}
          className="bg-white p-5 rounded-[1.5rem] shadow-soft hover:shadow-soft-lg flex flex-col items-start justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
        >
           <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
             <Users className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
              <span className="font-bold text-slate-700 text-lg block">Grupos</span>
              <span className="text-xs text-slate-400 font-medium">Comunidade</span>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
             <h3 className="text-xl font-bold text-slate-800">Estudo em Destaque</h3>
             <button onClick={() => onChangeTab(NavItem.BIBLE_STUDIES)} className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                 <ChevronRight className="w-5 h-5" />
             </button>
        </div>
        
        <div 
          onClick={() => onChangeTab(NavItem.BIBLE_STUDIES)}
          className="group relative h-52 rounded-[2rem] overflow-hidden cursor-pointer shadow-soft-lg"
        >
          <img 
            src="https://picsum.photos/800/400?grayscale" 
            alt="Featured Study" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3">
                <Play className="w-4 h-4 fill-white" />
            </div>
            <span className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-2">Nova Série</span>
            <h4 className="text-white text-2xl font-bold leading-tight">Caminhando em Sabedoria</h4>
            <p className="text-slate-200 text-sm line-clamp-1 mt-1 opacity-80">Um mergulho profundo no livro de Provérbios.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
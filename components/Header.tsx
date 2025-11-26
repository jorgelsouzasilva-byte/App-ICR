import React, { useState } from 'react';
import { NavItem } from '../types';
import { Bell, X, Check, Info, Calendar, DollarSign } from 'lucide-react';

interface HeaderProps {
  activeTab: NavItem;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Lembrete de Culto', message: 'O culto começa em 30 minutos.', time: '25m atrás', type: 'event', read: false },
  { id: 2, title: 'Doação Recebida', message: 'Obrigado pelo seu dízimo de R$ 150,00.', time: '2h atrás', type: 'finance', read: false },
  { id: 3, title: 'Novo Estudo Disponível', message: 'Parte 3 de "Caminhando em Sabedoria" já está no ar.', time: '1d atrás', type: 'study', read: true },
  { id: 4, title: 'Noite dos Jovens', message: 'Não esqueça da Noite dos Jovens nesta sexta!', time: '2d atrás', type: 'event', read: true },
];

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#f8f9fa]/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-soft">
            L
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comunidade</span>
            <h1 className="text-xl font-bold text-slate-800 leading-none">{activeTab}</h1>
          </div>
        </div>
        
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative p-3 rounded-2xl transition-all shadow-soft active:scale-95 ${showNotifications ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:text-blue-600'}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-sm" 
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute top-20 right-6 w-80 bg-white rounded-[2rem] shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[60vh]">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
              <h3 className="font-bold text-slate-800 text-lg">Notificações</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
                >
                  Ler todas
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto p-2 space-y-1">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer flex gap-3 ${!notification.read ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      notification.type === 'event' ? 'bg-purple-100 text-purple-600' :
                      notification.type === 'finance' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'event' && <Calendar className="w-5 h-5" />}
                      {notification.type === 'finance' && <DollarSign className="w-5 h-5" />}
                      {notification.type === 'study' && <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm truncate pr-2 ${!notification.read ? 'font-bold text-slate-800' : 'font-semibold text-slate-600'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Nenhuma notificação nova
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
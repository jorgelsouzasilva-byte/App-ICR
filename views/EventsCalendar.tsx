import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { CalendarEvent } from '../types';
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon, Search, Clock, ArrowLeft, Share2, CheckCircle } from 'lucide-react';

const AppLoader = () => (
    <div className="flex items-center justify-center h-full py-20">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

export default function EventsCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<number>>(new Set());

  useEffect(() => {
      const fetchEvents = async () => {
          setLoading(true);
          const { data, error } = await supabase.from('events').select('*');
          if (error) {
              console.error('Error fetching events:', error);
          } else if (data) {
              // Convert date strings from Supabase to Date objects
              const formattedData = data.map(event => ({
                  ...event,
                  date: new Date(event.date),
              }));
              setEvents(formattedData);
          }
          setLoading(false);
      };
      fetchEvents();
  }, []);

  // Simple calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleRegister = () => {
    if (selectedEvent?.id) {
        setRegisteredEvents(prev => {
            const newSet = new Set(prev);
            newSet.add(selectedEvent.id!);
            return newSet;
        });
    }
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // --- EVENT DETAIL VIEW ---
  if (selectedEvent) {
    const isRegistered = selectedEvent.id ? registeredEvents.has(selectedEvent.id) : false;

    return (
        <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-right duration-300 pb-20">
            {/* Hero Image */}
            <div className="relative h-80 shrink-0">
                <img 
                    src={selectedEvent.coverImage} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/20 to-transparent" />
                
                {/* Navbar */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white">
                     <button 
                        onClick={() => setSelectedEvent(null)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg border border-white/20"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg border border-white/20">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 -mt-20 relative z-10">
                <div className="mb-8">
                     <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm ${
                         selectedEvent.type === 'Culto' ? 'bg-purple-100 text-purple-600' :
                         selectedEvent.type === 'Social' ? 'bg-amber-100 text-amber-600' :
                         'bg-emerald-100 text-emerald-600'
                    }`}>
                        {selectedEvent.type}
                    </span>
                    <h2 className="text-3xl font-bold text-slate-800 leading-tight mb-2">{selectedEvent.title}</h2>
                </div>

                {/* Date & Time Row */}
                <div className="flex gap-4 mb-8">
                     <div className="flex-1 bg-white p-5 rounded-[2rem] shadow-soft flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                             <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Data</span>
                            <span className="font-bold text-slate-800 text-sm">
                                {selectedEvent.date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                     </div>
                     <div className="flex-1 bg-white p-5 rounded-[2rem] shadow-soft flex flex-col items-center justify-center text-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                             <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Horário</span>
                            <span className="font-bold text-slate-800 text-sm">
                                {selectedEvent.date.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                     </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-5 mb-8 p-5 bg-white rounded-[2rem] shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-0.5">Localização</h4>
                        <p className="text-slate-500 text-sm font-medium">{selectedEvent.location}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Sobre o Evento</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {selectedEvent.description}
                    </p>
                </div>
            </div>

             {/* Footer Button */}
             <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-white/50 pb-10">
                {isRegistered ? (
                    <button 
                        disabled
                        className="w-full bg-green-50 text-green-600 font-bold py-4 rounded-2xl border border-green-200 flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Inscrição Confirmada
                    </button>
                ) : (
                    <button 
                        onClick={handleRegister}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700 hover:shadow-blue-300"
                    >
                        Inscreva-se Agora
                    </button>
                )}
            </div>
        </div>
    );
  }

  // --- MAIN CALENDAR VIEW ---
  return (
    <div className="p-6 space-y-8 pb-8">
      {/* Calendar Widget Soft UI */}
      <div className="bg-white rounded-[2.5rem] shadow-soft-lg p-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {monthNames[currentDate.getMonth()]} <span className="text-slate-400 font-medium ml-1">{currentDate.getFullYear()}</span>
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {padding.map(i => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const isToday = day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();
            
            const hasEvent = events.some(e => 
              e.date.getDate() === day && 
              e.date.getMonth() === currentDate.getMonth() && 
              e.date.getFullYear() === currentDate.getFullYear()
            );

            return (
              <div key={day} className="flex justify-center h-9 items-center">
                <button 
                  className={`
                    w-8 h-8 rounded-xl text-sm font-medium flex items-center justify-center relative transition-all
                    ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}
                    ${!isToday && hasEvent ? 'font-bold text-slate-800' : ''}
                  `}
                >
                  {day}
                  {hasEvent && !isToday && (
                      <span className="absolute -bottom-1 w-1 h-1 bg-amber-400 rounded-full"></span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming List */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">
            Próximos Eventos
        </h3>

        {/* Search Bar Soft UI */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-inner-soft text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4 min-h-[200px]">
          {loading ? <AppLoader /> : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className="group flex flex-col sm:flex-row bg-white rounded-[2rem] p-3 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500 border border-white"
              >
                {/* Image Section */}
                <div className="h-32 sm:h-24 sm:w-24 relative shrink-0 rounded-[1.5rem] overflow-hidden">
                    <img 
                        src={event.coverImage} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md rounded-xl px-2.5 py-1.5 flex flex-col items-center shadow-sm">
                        <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mb-0.5">
                            {monthNames[event.date.getMonth()].substring(0,3)}
                        </span>
                        <span className="text-base font-black text-slate-800 leading-none">
                            {event.date.getDate()}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-3 pl-4 flex flex-col justify-center flex-1">
                   <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                event.type === 'Culto' ? 'bg-purple-100 text-purple-600' :
                                event.type === 'Social' ? 'bg-amber-100 text-amber-600' :
                                'bg-emerald-100 text-emerald-600'
                            }`}>
                                {event.type}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{event.title}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{event.location}</span>
                        </div>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p>Nenhum evento encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
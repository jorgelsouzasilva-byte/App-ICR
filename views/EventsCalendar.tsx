import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { CalendarEvent } from '../types';
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon, Search, Clock, ArrowLeft, Share2, CheckCircle, User } from 'lucide-react';
import DataFetchHandler from '../components/DataFetchHandler';

export default function EventsCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<number>>(new Set());

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    const { data, error: dbError } = await supabase.from('events').select('*');
    if (dbError) {
      console.error('Error fetching events:', dbError);
      setError(dbError);
    } else if (data) {
      // Convert date strings from DB to Date objects
      const formattedEvents = data.map(event => ({
        ...event,
        date: new Date(event.date),
      }));
      setEvents(formattedEvents);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleRegister = (eventId?: number) => {
    if (!eventId) return;
    const newSet = new Set(registeredEvents);
    if (newSet.has(eventId)) {
      newSet.delete(eventId);
    } else {
      newSet.add(eventId);
    }
    setRegisteredEvents(newSet);
  };

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    // Weekday headers
    for (let i = 0; i < 7; i++) {
        days.push(<div key={`wd-${i}`} className="text-center text-xs font-bold text-slate-400">{weekdays[i]}</div>);
    }

    // Blank days for the first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="p-1"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const hasEvent = events.some(e => new Date(e.date).toDateString() === new Date(year, month, day).toDateString());

      days.push(
        <div key={day} className="relative p-1">
          <div className={`
            w-full aspect-square flex items-center justify-center rounded-2xl text-sm transition-colors
            ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 font-medium'}
            ${hasEvent && !isToday ? 'bg-blue-50' : ''}
          `}>
            {day}
          </div>
          {hasEvent && (
            <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-blue-500'}`}></div>
          )}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };
  
  const filteredEvents = events
    .filter(event => event.date >= new Date()) // Only show upcoming events
    .filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // --- DETAIL VIEW ---
  if (selectedEvent) {
      const isRegistered = selectedEvent.id ? registeredEvents.has(selectedEvent.id) : false;
      return (
        <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="relative h-64">
                <img src={selectedEvent.coverImage} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-black/20" />
                <button onClick={() => setSelectedEvent(null)} className="absolute top-6 left-6 w-12 h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-lg border border-white/20"><ArrowLeft className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 -mt-16 relative z-10 scroll-smooth pb-32">
                 <div className="bg-white rounded-[2.5rem] p-8 shadow-soft-lg mb-6">
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider mb-3 inline-block">{selectedEvent.type}</span>
                    <h2 className="text-3xl font-bold text-slate-800 leading-tight mb-6">{selectedEvent.title}</h2>
                    <div className="flex flex-col gap-5 text-sm text-slate-500 mb-8 border-b border-slate-50 pb-8">
                        <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-blue-500" /><span>{selectedEvent.date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                        <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-amber-500" /><span>{selectedEvent.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span></div>
                        <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-red-500" /><span>{selectedEvent.location}</span></div>
                    </div>
                    <div className="prose prose-slate prose-sm max-w-none"><p>{selectedEvent.description}</p></div>
                 </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-white/50 pb-10">
                <button 
                    onClick={() => handleRegister(selectedEvent.id)}
                    className={`w-full font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${isRegistered ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-blue-600 text-white shadow-blue-200'}`}
                >
                    {isRegistered ? <><CheckCircle className="w-6 h-6" /> Inscrito</> : 'Inscrever-se'}
                </button>
            </div>
        </div>
      );
  }


  return (
    <div className="p-6 space-y-8">
      {/* Calendar Widget */}
      <div className="bg-white rounded-[2rem] p-6 shadow-soft-lg border border-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={handleNextMonth} className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        {renderCalendar()}
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Próximos Eventos</h3>
         <div className="relative mb-6 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" /></div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-inner-soft text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Buscar eventos..." />
        </div>
        
        <DataFetchHandler
            loading={loading}
            error={error}
            data={events}
            onRetry={fetchEvents}
            emptyComponent={<div className="text-center py-10 text-slate-400"><p>Nenhum evento agendado.</p></div>}
            render={(data) => {
              // FIX: Cast `data` to `CalendarEvent[]`
              const eventsToRender = (data as CalendarEvent[])
                .filter(event => event.date >= new Date())
                .filter(event => 
                  event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  event.location.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => a.date.getTime() - b.date.getTime());

              if (eventsToRender.length === 0) {
                 return <div className="text-center py-10 text-slate-400"><p>Nenhum evento encontrado.</p></div>
              }
              
              return (
                <div className="space-y-4">
                    {eventsToRender.map(event => {
                        const isRegistered = event.id ? registeredEvents.has(event.id) : false;
                        return (
                        <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white p-4 rounded-[1.5rem] shadow-soft flex items-center gap-4 cursor-pointer hover:shadow-soft-lg hover:-translate-y-0.5 transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-100 overflow-hidden relative shadow-inner-soft">
                                {event.coverImage ? 
                                <>
                                <img src={event.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
                                </>
                                : null}
                                <span className="relative text-[10px] font-bold text-slate-500 uppercase z-10">{event.date.toLocaleString('pt-BR', { month: 'short' })}</span>
                                <span className="relative text-xl font-black text-slate-800 z-10 leading-none">{event.date.getDate()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 line-clamp-1">{event.title}</h4>
                                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                            {isRegistered && (
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    )})}
                </div>
              );
            }}
        />
      </div>
    </div>
  );
}
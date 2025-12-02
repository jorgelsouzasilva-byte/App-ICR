import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Play, Calendar, Users, Search } from 'lucide-react';
import { LiveStreamItem } from '../types';
import DataFetchHandler from '../components/DataFetchHandler';

export default function LiveStream() {
  const [streams, setStreams] = useState<LiveStreamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const filters = ['Todos', 'Culto', 'Estudo', 'Louvor', 'Evento Especial'];

  const fetchStreams = async () => {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase.from('streams').select('*').order('date', { ascending: false });
      if (dbError) {
          console.error('Error fetching streams:', dbError);
          setError(dbError);
      } else if (data) {
           const formattedData = data.map(stream => ({
                ...stream,
                dateObj: new Date(stream.date),
            }));
          setStreams(formattedData);
      }
      setLoading(false);
  };
  
  useEffect(() => {
    fetchStreams();
  }, []);

  const liveEvent = streams.find(s => s.isLive);
  
  // 1. Filter Logic
  const filteredStreams = streams.filter(s => {
      if (s.isLive) return false;
      const matchesCategory = activeFilter === 'Todos' || s.category === activeFilter;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  // 2. Grouping Logic (By Month)
  const groupedStreams = filteredStreams.reduce((acc, stream) => {
      if (!stream.dateObj) return acc;
      const monthYear = stream.dateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
      
      if (!acc[capitalizedMonthYear]) {
          acc[capitalizedMonthYear] = [];
      }
      acc[capitalizedMonthYear].push(stream);
      return acc;
  }, {} as Record<string, LiveStreamItem[]>);

  const sortedMonths = Object.keys(groupedStreams);

  return (
    <div className="space-y-8 pb-8">
      {/* Featured / Live Hero */}
      <div className="relative h-64 bg-slate-900 flex items-center justify-center group cursor-pointer">
        {liveEvent ? (
           <>
            <img src={liveEvent.thumbnail} alt="Live" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                AO VIVO
            </div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" />
                {liveEvent.views}
            </div>
            
            <div className="relative z-10 text-center px-6">
                <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-4 mx-auto hover:scale-110 transition-transform border border-white/30">
                    <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <h2 className="text-white font-bold text-xl mb-1">{liveEvent.title}</h2>
                <p className="text-slate-200 text-sm">Junte-se ao culto em andamento</p>
            </div>
           </>
        ) : (
            <div className="text-center text-slate-400">
                <p>{loading ? 'Verificando...' : 'Nenhum evento ao vivo agora.'}</p>
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-slate-800">Mensagens Anteriores</h3>
        </div>

        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all shadow-sm"
            placeholder="Buscar mensagens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
       
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-6 px-6 no-scrollbar">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        activeFilter === filter 
                        ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>

        <div className="space-y-6">
            <DataFetchHandler
                loading={loading}
                error={error}
                data={streams}
                onRetry={fetchStreams}
                emptyComponent={<div className="text-center py-12 bg-slate-100 rounded-3xl border border-dashed border-slate-300"><p className="text-slate-400 text-sm">Nenhuma gravação encontrada.</p></div>}
                render={(data) => {
                  const sortedMonthsToRender = Object.keys(groupedStreams);
                  if (sortedMonthsToRender.length === 0) {
                     return <div className="text-center py-12 bg-slate-100 rounded-3xl border border-dashed border-slate-300"><p className="text-slate-400 text-sm">Nenhuma gravação encontrada para os filtros.</p></div>
                  }
                  return sortedMonthsToRender.map(month => (
                    <div key={month} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sticky top-0 bg-slate-50/95 backdrop-blur py-2 z-10 w-fit px-2 rounded-r-lg -ml-2">
                            {month}
                        </h4>
                        <div className="space-y-4">
                            {groupedStreams[month].map(event => (
                                <div key={event.id} className="flex gap-4 group cursor-pointer bg-white p-2 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0">
                                        <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="w-3 h-3 text-slate-900 fill-slate-900 ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-1 flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">{event.category}</span>
                                        <h4 className="font-bold text-slate-800 text-xs leading-tight mb-1 line-clamp-2">{event.title}</h4>
                                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(event.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} &bull; {event.duration || '1 hr'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  ));
                }}
            />
        </div>
      </div>
    </div>
  );
}
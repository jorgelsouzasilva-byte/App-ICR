import React, { useState } from 'react';
import { MOCK_STUDIES } from '../constants';
import { BibleStudy } from '../types';
import { ArrowLeft, Clock, User, Share2, BookOpen, PlayCircle, Lock, CheckCircle, X, Search } from 'lucide-react';

export default function BibleStudies() {
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [startedStudies, setStartedStudies] = useState<Set<string>>(new Set());
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  const [readingSession, setReadingSession] = useState<{ day: number } | null>(null);
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filters = ['Todos', 'Novo Testamento', 'Velho Testamento', 'Temáticos', 'Família'];

  const handleStartPlan = () => {
    if (selectedStudy) {
        const newSet = new Set(startedStudies);
        newSet.add(selectedStudy.id);
        setStartedStudies(newSet);
    }
  };

  const handleStartReading = (day: number) => {
    setReadingSession({ day });
  };

  const handleCompleteReading = () => {
      if (selectedStudy && readingSession) {
          const currentCompleted = completedDays[selectedStudy.id] || [];
          if (!currentCompleted.includes(readingSession.day)) {
               setCompletedDays({
                   ...completedDays,
                   [selectedStudy.id]: [...currentCompleted, readingSession.day]
               });
          }
          setReadingSession(null);
      }
  };

  const closeReading = () => {
      setReadingSession(null);
  };

  // Filter Logic
  const filteredStudies = MOCK_STUDIES.filter(study => {
    const matchesCategory = activeFilter === 'Todos' || study.category === activeFilter;
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          study.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          study.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedStudy) {
    const isStarted = startedStudies.has(selectedStudy.id);
    const studyCompletedDays = completedDays[selectedStudy.id] || [];
    const totalDays = 3; // Mocked as 3 days for all studies in this demo
    const progressPercent = Math.round((studyCompletedDays.length / totalDays) * 100);

    // Reading View Overlay
    if (readingSession) {
        return (
            <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-bottom duration-300">
               {/* Header */}
               <div className="px-6 py-5 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
                   <div className="flex flex-col">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dia {readingSession.day}</span>
                       <h2 className="text-lg font-bold text-slate-800 line-clamp-1">{selectedStudy.title}</h2>
                   </div>
                   <button 
                      onClick={closeReading}
                      className="p-3 bg-white rounded-2xl shadow-soft text-slate-500 hover:text-red-500 transition-colors"
                   >
                       <X className="w-5 h-5" />
                   </button>
               </div>
  
               {/* Content */}
               <div className="flex-1 overflow-y-auto p-6 scroll-smooth pb-32">
                  <div className="bg-white rounded-[2rem] p-6 shadow-soft-lg mb-6">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Caminhando na Luz</h3>
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="lead text-xl text-slate-600 italic border-l-4 border-blue-500 pl-4 mb-8">
                            "Se, porém, andarmos na luz, como ele está na luz, temos comunhão uns com os outros, e o sangue de Jesus, seu Filho, nos purifica de todo pecado." 
                            <span className="block text-sm font-sans font-bold not-italic text-slate-400 mt-2">— 1 João 1:7</span>
                        </p>
                        
                        <p>
                            Hoje, começamos nossa jornada entendendo o que significa verdadeiramente andar na luz. 
                            A luz expõe as coisas. Quando acendemos uma luz em um quarto escuro, vemos tudo claramente — o bom e o ruim.
                        </p>
                        <p>
                            Deus nos convida não a esconder nossa bagunça, mas a trazê-la para a Sua luz. É neste lugar de vulnerabilidade que a verdadeira cura e comunhão acontecem.
                            Muitas vezes temos medo de que, se as pessoas realmente nos conhecessem, não nos amariam. Mas o Evangelho diz que Deus nos conhece plenamente e nos ama completamente.
                        </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2rem] p-6 shadow-soft border border-amber-100/50">
                       <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            Reflexão
                       </h4>
                       <p className="text-slate-700 leading-relaxed">
                          Qual é uma área da sua vida que você tem mantido no escuro? Tire um momento para orar e pedir a Deus coragem para trazê-la à Sua luz hoje.
                       </p>
                       <div className="mt-6 text-xs font-bold text-amber-400 uppercase tracking-wide opacity-80">
                            Dica: Tire 5 minutos para meditar
                       </div>
                   </div>
               </div>
  
               {/* Footer Action */}
               <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-white/50 pb-10">
                   <button 
                      onClick={handleCompleteReading}
                      className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-blue-300"
                   >
                       <CheckCircle className="w-6 h-6" />
                       Marcar como Concluído
                   </button>
               </div>
            </div>
        );
    }

    return (
      <div className="bg-[#f8f9fa] min-h-full animate-in slide-in-from-right duration-300 pb-10">
        <div className="relative h-72">
          <img 
            src={selectedStudy.coverImage} 
            alt={selectedStudy.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-transparent" />
          <button 
            onClick={() => setSelectedStudy(null)}
            className="absolute top-6 left-6 w-12 h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-lg border border-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 -mt-16 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-soft-lg mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider mb-3 inline-block">Estudo Bíblico</span>
                <h2 className="text-3xl font-bold text-slate-800 leading-tight">{selectedStudy.title}</h2>
                </div>
                <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Share2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 border-b border-slate-50 pb-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                    </div>
                <span>{selectedStudy.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                <span>{selectedStudy.duration}</span>
                </div>
            </div>

            <div className="prose prose-slate prose-sm max-w-none">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Visão Geral</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{selectedStudy.description}</p>
                <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                    <p className="text-slate-600 italic leading-relaxed m-0">{selectedStudy.content}</p>
                </div>
            </div>
          </div>
          
          {!isStarted ? (
            <button 
                onClick={handleStartPlan}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700 hover:shadow-blue-300"
            >
                Iniciar Plano de Leitura
            </button>
          ) : (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-[2rem] shadow-soft mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-700">Seu Progresso</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner-soft">
                        <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Cronograma</h3>
                <div className="space-y-4">
                     {[1, 2, 3].map((day) => {
                        const isDayCompleted = studyCompletedDays.includes(day);
                        const isUnlocked = day === 1 || studyCompletedDays.includes(day - 1);
                        
                        return (
                        <div key={day} className={`flex items-center gap-5 p-5 rounded-[1.5rem] transition-all ${
                            isUnlocked || isDayCompleted
                                ? 'bg-white shadow-soft' 
                                : 'bg-transparent border border-slate-200 opacity-50'
                        }`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                                isDayCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : isUnlocked ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {isDayCompleted ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : isUnlocked ? (
                                    <span className="font-bold text-lg">{day}</span>
                                ) : (
                                    <Lock className="w-5 h-5" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-base ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>Dia {day}</h4>
                                <p className="text-xs text-slate-400 font-medium">Leitura & Devocional</p>
                            </div>
                             {isUnlocked && !isDayCompleted && (
                                <button 
                                    onClick={() => handleStartReading(day)}
                                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-110 transition-transform"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                     )})}
                </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Estudos</h2>
        <p className="text-slate-400 text-sm font-medium">Cresça na sua jornada de fé</p>
      </div>

      {/* Search Input Soft UI */}
      <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-inner-soft text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Buscar estudos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-6 mb-2 -mx-6 px-6 no-scrollbar">
        {filters.map((filter) => (
            <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                    activeFilter === filter 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-y-[-2px]' 
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
            >
                {filter}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredStudies.map((study) => {
          const isStarted = startedStudies.has(study.id);
          const studyCompletedDays = completedDays[study.id] || [];
          const progress = studyCompletedDays.length > 0 
            ? Math.round((studyCompletedDays.length / 3) * 100) 
            : 0;

          return (
          <div 
            key={study.id}
            onClick={() => setSelectedStudy(study)}
            className="group flex flex-col gap-3 cursor-pointer animate-in fade-in duration-500"
          >
            <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-soft relative bg-white p-1.5">
                <img 
                    src={study.coverImage} 
                    alt={study.title}
                    className="w-full h-full object-cover rounded-[1.2rem] transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-[1.2rem]" />
                {isStarted && (
                     <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
                        <PlayCircle className="w-4 h-4 fill-blue-600 text-blue-600" />
                     </div>
                )}
            </div>
            <div className="px-1">
                <h3 className="text-xs font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                {study.title}
                </h3>
                {isStarted && (
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-2">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${Math.max(5, progress)}%` }}
                        ></div>
                    </div>
                )}
            </div>
          </div>
          );
        })}
      </div>
      {filteredStudies.length === 0 && (
          <div className="text-center py-12 text-slate-400">
              <p>Nenhum estudo encontrado.</p>
          </div>
      )}
    </div>
  );
}
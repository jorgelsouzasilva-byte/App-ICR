import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, BookOpen, Calendar, Plus, BarChart3, PieChart, Baby, User as UserIcon, Edit2, Save, X, Trash2, ChevronDown, Check, Image as ImageIcon, Search, Mail, Phone, MapPin, Award } from 'lucide-react';
import { BibleStudy, CalendarEvent, StudyDay, User } from '../types';
import { supabase } from '../services/supabase';

interface AdminDashboardProps {
  onBack: () => void;
}

const AppLoader = ({ text }: { text: string }) => (
    <div className="text-center py-10 text-slate-400">{text}</div>
);

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'estudos' | 'eventos' | 'membresia'>('geral');
  
  // Data State
  const [studies, setStudies] = useState<BibleStudy[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor State
  const [editingStudy, setEditingStudy] = useState<BibleStudy | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);

  // Membership State
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
        setLoading(true);
        const [membersRes, studiesRes, eventsRes] = await Promise.all([
            supabase.from('profiles').select('*'),
            supabase.from('studies').select('*'),
            supabase.from('events').select('*')
        ]);
        
        if (membersRes.data) setMembers(membersRes.data as User[]);
        if (studiesRes.data) setStudies(studiesRes.data);
        if (eventsRes.data) setEvents(eventsRes.data.map(e => ({...e, date: new Date(e.date)})));
        
        setLoading(false);
    };
    fetchAllData();
  }, []);

  // --- HANDLERS FOR STUDIES ---
  const handleEditStudy = (study: BibleStudy) => {
    setEditingStudy({ ...study, days: study.days || [] });
  };

  const handleCreateStudy = () => {
    setEditingStudy({
        id: `new-${Date.now()}`,
        title: '',
        coverImage: 'https://picsum.photos/400/600',
        description: '',
        content: '',
        author: '',
        duration: '',
        category: 'Temáticos',
        days: []
    });
  };

  const handleSaveStudy = async () => {
    if (!editingStudy) return;

    const studyData = { ...editingStudy };
    let result;
    if (studyData.id.startsWith('new-')) {
        const { id, ...insertData } = studyData;
        result = await supabase.from('studies').insert(insertData).select().single();
    } else {
        result = await supabase.from('studies').update(studyData).eq('id', studyData.id).select().single();
    }
    
    const { data, error } = result;
    if (error) {
        alert('Erro ao salvar estudo: ' + error.message);
    } else if (data) {
        if (studyData.id.startsWith('new-')) {
            setStudies([data, ...studies]);
        } else {
            setStudies(studies.map(s => s.id === data.id ? data : s));
        }
        setEditingStudy(null);
    }
  };

  const handleAddDay = () => {
      if (!editingStudy) return;
      const newDayNum = (editingStudy.days?.length || 0) + 1;
      const newDay: StudyDay = { day: newDayNum, title: `Dia ${newDayNum}`, content: '', scriptureReference: '' };
      setEditingStudy({
          ...editingStudy,
          days: [...(editingStudy.days || []), newDay]
      });
  };

  const handleUpdateDay = (index: number, field: keyof StudyDay, value: string | number) => {
      if (!editingStudy || !editingStudy.days) return;
      const updatedDays = [...editingStudy.days];
      updatedDays[index] = { ...updatedDays[index], [field]: value };
      setEditingStudy({ ...editingStudy, days: updatedDays });
  };

  const handleRemoveDay = (index: number) => {
      if (!editingStudy || !editingStudy.days) return;
      const updatedDays = editingStudy.days.filter((_, i) => i !== index);
      const renumberedDays = updatedDays.map((d, i) => ({ ...d, day: i + 1 }));
      setEditingStudy({ ...editingStudy, days: renumberedDays });
  };

  // --- HANDLERS FOR EVENTS ---
  const handleEditEvent = (event: CalendarEvent) => {
      setEditingEvent({ ...event });
  };

  const handleCreateEvent = () => {
      setEditingEvent({
          id: `new-${Date.now()}`,
          title: '',
          date: new Date(),
          location: '',
          type: 'Culto',
          coverImage: 'https://picsum.photos/800/600',
          description: ''
      });
  };

  const handleSaveEvent = async () => {
      if (!editingEvent || !editingEvent.title) return;
      
      const eventData = { ...editingEvent };
      let result;
      if (typeof eventData.id === 'string' && eventData.id.startsWith('new-')) {
          const { id, ...insertData } = eventData;
          result = await supabase.from('events').insert(insertData).select().single();
      } else {
          result = await supabase.from('events').update(eventData).eq('id', eventData.id).select().single();
      }

      const { data, error } = result;
      if(error) {
          alert('Error saving event: ' + error.message);
      } else if (data) {
          const savedEvent = { ...data, date: new Date(data.date) };
          if (typeof eventData.id === 'string' && eventData.id.startsWith('new-')) {
              setEvents([savedEvent, ...events]);
          } else {
              setEvents(events.map(e => e.id === savedEvent.id ? savedEvent : e));
          }
          setEditingEvent(null);
      }
  };

  // --- RENDERERS ---

  const renderStudyEditor = () => {
      if (!editingStudy) return null;
      return (
        <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-bottom duration-300">
             <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setEditingStudy(null)} className="p-3 bg-white rounded-2xl shadow-soft text-slate-500 hover:text-slate-800 transition-colors"><X className="w-5 h-5" /></button>
                    <h2 className="text-lg font-bold text-slate-800">{editingStudy.id.startsWith('new-') ? 'Novo Estudo' : 'Editar Estudo'}</h2>
                </div>
                <button onClick={handleSaveStudy} className="bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"><Save className="w-4 h-4" />Salvar</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="bg-white p-6 rounded-[2rem] shadow-soft space-y-4 border border-white">
                        <h3 className="text-slate-800 font-bold flex items-center gap-2 border-b border-slate-50 pb-3 mb-4"><BookOpen className="w-5 h-5 text-blue-500" />Informações Básicas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Título do Estudo</label>
                                <input type="text" value={editingStudy.title} onChange={(e) => setEditingStudy({...editingStudy, title: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ex: Livro de João"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Autor</label>
                                <input type="text" value={editingStudy.author} onChange={(e) => setEditingStudy({...editingStudy, author: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ex: Pr. Miguel"/>
                            </div>
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Duração</label>
                                <input type="text" value={editingStudy.duration} onChange={(e) => setEditingStudy({...editingStudy, duration: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ex: 4 Semanas"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Categoria</label>
                                <div className="relative">
                                    <select value={editingStudy.category} onChange={(e) => setEditingStudy({...editingStudy, category: e.target.value as any})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all appearance-none">
                                        <option>Temáticos</option><option>Novo Testamento</option><option>Velho Testamento</option><option>Família</option><option>Jovens</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">URL da Imagem de Capa</label>
                             <div className="flex gap-2">
                                <input type="text" value={editingStudy.coverImage} onChange={(e) => setEditingStudy({...editingStudy, coverImage: e.target.value})} className="flex-1 border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" />
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-inner-soft"><img src={editingStudy.coverImage} className="w-full h-full object-cover" alt="Preview" /></div>
                             </div>
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Descrição Geral</label>
                            <textarea value={editingStudy.description} onChange={(e) => setEditingStudy({...editingStudy, description: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all h-32 resize-none" placeholder="Uma breve descrição sobre o que trata este estudo..."/>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-soft space-y-4 border border-white">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                             <h3 className="text-slate-800 font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-500" />Passos do Estudo</h3>
                            <button onClick={handleAddDay} className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 flex items-center gap-2 transition-colors"><Plus className="w-3 h-3" />Adicionar Dia</button>
                        </div>
                        <div className="space-y-4">
                            {(editingStudy.days || []).length === 0 && <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Adicione dias para criar o roteiro de leitura.</div>}
                            {editingStudy.days?.map((day, index) => (
                                <div key={index} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-blue-600 uppercase bg-blue-100 px-3 py-1 rounded-lg">Dia {day.day}</span><button onClick={() => handleRemoveDay(index)} className="p-2 bg-white rounded-xl text-red-400 hover:text-red-600 shadow-sm hover:shadow-md transition-all"><Trash2 className="w-4 h-4" /></button></div>
                                    <div className="space-y-3">
                                        <input type="text" value={day.title} onChange={(e) => handleUpdateDay(index, 'title', e.target.value)} className="w-full border-none rounded-xl px-4 py-3 text-sm font-bold bg-white shadow-sm" placeholder="Título do Dia"/>
                                        <input type="text" value={day.scriptureReference} onChange={(e) => handleUpdateDay(index, 'scriptureReference', e.target.value)} className="w-full border-none rounded-xl px-4 py-3 text-sm text-slate-600 bg-white shadow-sm" placeholder="Referência Bíblica (ex: João 3:16)"/>
                                        <textarea value={day.content} onChange={(e) => handleUpdateDay(index, 'content', e.target.value)} className="w-full border-none rounded-xl px-4 py-3 text-sm bg-white shadow-sm h-24 resize-none" placeholder="Conteúdo devocional do dia..."/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const renderEventEditor = () => {
    if (!editingEvent) return null;
    return (
        <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setEditingEvent(null)} className="p-3 bg-white rounded-2xl shadow-soft text-slate-500 hover:text-slate-800 transition-colors"><X className="w-5 h-5" /></button>
                    <h2 className="text-lg font-bold text-slate-800">{typeof editingEvent.id === 'string' && editingEvent.id.startsWith('new-') ? 'Novo Evento' : 'Editar Evento'}</h2>
                </div>
                <button onClick={handleSaveEvent} className="bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"><Save className="w-4 h-4" />Salvar</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-[2rem] shadow-soft border border-white space-y-6">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome do Evento</label>
                        <input type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ex: Culto de Jovens"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Data e Hora</label>
                             <input type="datetime-local" value={editingEvent.date ? new Date(editingEvent.date.getTime() - (editingEvent.date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''} onChange={(e) => setEditingEvent({...editingEvent, date: new Date(e.target.value)})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"/>
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tipo</label>
                            <div className="relative">
                                <select value={editingEvent.type} onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value as any})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all appearance-none">
                                    <option>Culto</option><option>Social</option><option>Ação Social</option><option>Estudo</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Localização</label>
                        <input type="text" value={editingEvent.location} onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ex: Salão Principal"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">URL da Imagem</label>
                         <div className="flex gap-2">
                            <input type="text" value={editingEvent.coverImage} onChange={(e) => setEditingEvent({...editingEvent, coverImage: e.target.value})} className="flex-1 border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="https://..."/>
                             <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-inner-soft">{editingEvent.coverImage && <img src={editingEvent.coverImage} className="w-full h-full object-cover" alt="Preview" />}</div>
                         </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Descrição Detalhada</label>
                        <textarea value={editingEvent.description} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full border-none shadow-inner-soft rounded-2xl px-5 py-4 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all h-32 resize-none" placeholder="Descreva o evento..."/>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  const renderMemberDetails = () => {
    if (!selectedMember) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedMember(null)}>
            <div className="bg-white rounded-[2rem] shadow-soft-lg w-full max-w-md p-8 animate-in zoom-in-95 duration-300 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                <div className="flex flex-col items-center pt-4 text-center">
                    <img src={selectedMember.avatar} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg" />
                    <h2 className="text-2xl font-bold text-slate-800">{selectedMember.name}</h2>
                    <p className="text-slate-400 text-sm font-medium">Membro desde {selectedMember.memberSince ? new Date(selectedMember.memberSince).getFullYear() : 'N/A'}</p>
                </div>
                <div className="mt-8 space-y-4 text-sm">
                     <div className="flex items-center gap-4 text-slate-600 bg-slate-50 p-3 rounded-xl"><Mail className="w-5 h-5 text-slate-400 shrink-0" /><span className="font-medium truncate">{selectedMember.email}</span></div>
                     <div className="flex items-center gap-4 text-slate-600 bg-slate-50 p-3 rounded-xl"><Phone className="w-5 h-5 text-slate-400 shrink-0" /><span className="font-medium">{selectedMember.phone}</span></div>
                     <div className="flex items-center gap-4 text-slate-600 bg-slate-50 p-3 rounded-xl"><MapPin className="w-5 h-5 text-slate-400 shrink-0" /><span className="font-medium">{selectedMember.group}</span></div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-around">
                     <div className="text-center"><div className="text-xl font-bold text-blue-600">12</div><div className="text-xs uppercase font-bold text-slate-400">Estudos</div></div>
                     <div className="text-center"><div className="text-xl font-bold text-amber-600">45</div><div className="text-xs uppercase font-bold text-slate-400">Eventos</div></div>
                     <div className="text-center"><div className="text-xl font-bold text-emerald-600">R$850</div><div className="text-xs uppercase font-bold text-slate-400">Doados</div></div>
                </div>
            </div>
        </div>
    );
  };
  
  const filteredMembers = members.filter(user => 
    user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(memberSearch.toLowerCase())) ||
    (user.group && user.group.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div className="min-h-full bg-[#f8f9fa] pb-20">
      <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        <div className="bg-slate-800 p-1.5 rounded-2xl flex backdrop-blur-md">
            {['geral', 'membresia', 'estudos', 'eventos'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${activeTab === tab ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}>
                    {tab}
                </button>
            ))}
        </div>
      </div>
      <div className="p-6 -mt-6 relative z-20 space-y-6">
        {loading ? <AppLoader text="Carregando dados..." /> : (
            <>
                {activeTab === 'geral' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft-lg flex items-center justify-between border border-white">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total de Membros</p>
                                <h2 className="text-4xl font-black text-slate-800">{members.length}</h2>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Users className="w-7 h-7" /></div>
                        </div>
                    </div>
                )}
                {activeTab === 'membresia' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative group">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" /></div>
                             <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Buscar membro..." className="w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-inner-soft text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
                        </div>
                        <div className="space-y-2">
                            {filteredMembers.map(member => (
                                <button key={member.id} onClick={() => setSelectedMember(member)} className="w-full text-left flex items-center gap-4 p-4 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all">
                                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.group}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>{member.role === 'admin' ? 'Admin' : 'Membro'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'estudos' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button onClick={handleCreateStudy} className="w-full py-5 bg-white border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm"><Plus className="w-5 h-5" />Cadastrar Novo Estudo</button>
                        {studies.map((study) => (
                            <div key={study.id} className="bg-white p-5 rounded-[2rem] shadow-soft border border-white hover:shadow-soft-lg transition-shadow">
                                <div className="flex gap-4 mb-4">
                                    <img src={study.coverImage} className="w-16 h-16 rounded-2xl object-cover bg-slate-200 shadow-sm" alt="" />
                                    <div className="flex-1"><h4 className="font-bold text-slate-800 line-clamp-1">{study.title}</h4><span className="text-xs text-slate-500 font-medium">{study.category} • {study.duration}</span></div>
                                    <button onClick={() => handleEditStudy(study)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'eventos' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button onClick={handleCreateEvent} className="w-full py-5 bg-white border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm"><Plus className="w-5 h-5" />Cadastrar Novo Evento</button>
                        {events.map((event) => (
                            <div key={event.id} className="bg-white p-5 rounded-[2rem] shadow-soft border border-white hover:shadow-soft-lg transition-shadow">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-100 overflow-hidden relative shadow-inner-soft">
                                        {event.coverImage && <><img src={event.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" /><div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" /></>}
                                        <span className="relative text-[10px] font-bold text-slate-500 uppercase z-10">{event.date.toLocaleString('pt-BR', { month: 'short' })}</span>
                                        <span className="relative text-xl font-black text-slate-800 z-10 leading-none">{event.date.getDate()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0"><h4 className="font-bold text-slate-800 line-clamp-1">{event.title}</h4><span className="text-xs text-slate-500 block mb-1 font-medium">{event.type}</span><div className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="w-3 h-3" />{event.date.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' })}</div></div>
                                    <button onClick={() => handleEditEvent(event)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors shrink-0"><Edit2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
      </div>

      {renderStudyEditor()}
      {renderEventEditor()}
      {renderMemberDetails()}
    </div>
  );
}
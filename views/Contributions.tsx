import React, { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { CreditCard, DollarSign, Clock, ArrowUpRight, ArrowLeft, Filter, Search, ChevronRight } from 'lucide-react';

export default function Contributions() {
  const [amount, setAmount] = useState<string>('');
  const [giveType, setGiveType] = useState('Dízimo');
  
  // History Overlay State
  const [showHistoryOverlay, setShowHistoryOverlay] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const transactionTypes = ['Todos', 'Dízimo', 'Oferta', 'Missões', 'Construção'];

  // Filter Transactions Logic
  const filteredHistory = MOCK_TRANSACTIONS.filter(t => {
      const matchesType = historyFilter === 'Todos' || t.type === historyFilter;
      const matchesSearch = t.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.amount.toString().includes(searchQuery) ||
                            t.date.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
  });

  // History Overlay View
  if (showHistoryOverlay) {
      return (
        <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowHistoryOverlay(false)} 
                        className="p-3 bg-white rounded-2xl shadow-soft text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-800">Histórico</h2>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-soft text-slate-400">
                    <Filter className="w-5 h-5" />
                </div>
            </div>

            {/* Search Input */}
            <div className="px-6 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-inner-soft text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Buscar no histórico..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pb-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-2">
                    {transactionTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setHistoryFilter(type)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                historyFilter === type 
                                ? 'bg-slate-800 text-white shadow-lg' 
                                : 'bg-white text-slate-500 hover:bg-slate-100 shadow-soft'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-3">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((t) => (
                        <div key={t.id} className="bg-white p-5 rounded-[1.5rem] shadow-soft flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-500 border border-white">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                    t.type === 'Dízimo' ? 'bg-blue-50 text-blue-600' :
                                    t.type === 'Oferta' ? 'bg-amber-50 text-amber-600' :
                                    t.type === 'Missões' ? 'bg-purple-50 text-purple-600' :
                                    'bg-emerald-50 text-emerald-600'
                                }`}>
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{t.type}</p>
                                    <p className="text-xs text-slate-400">{t.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800 text-lg">+R${t.amount.toFixed(2)}</p>
                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-bold">
                                    {t.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-400">
                        Nenhuma transação encontrada.
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Donation Card */}
      <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-soft-lg relative overflow-hidden border border-white">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"></div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Fazer Contribuição</h2>
        
        <div className="relative mb-10 max-w-[200px] mx-auto">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-slate-300">R$</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent border-none text-5xl font-bold py-2 pl-12 focus:outline-none text-slate-800 placeholder:text-slate-200 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
            {['Dízimo', 'Oferta', 'Missões', 'Construção'].map((type) => (
                <button 
                    key={type}
                    onClick={() => setGiveType(type)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                        giveType === type 
                        ? 'bg-slate-800 text-white shadow-lg' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        <button className="w-full bg-blue-600 text-white font-bold py-5 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95">
            <CreditCard className="w-5 h-5" />
            Doar Agora
        </button>
      </div>

      {/* History Preview */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold text-slate-800">Recentes</h3>
            <button 
                onClick={() => setShowHistoryOverlay(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
                Ver tudo
            </button>
        </div>
        
        <div className="space-y-3">
            {MOCK_TRANSACTIONS.slice(0, 3).map((t) => (
                <div key={t.id} className="p-4 bg-white rounded-[1.5rem] shadow-soft flex justify-between items-center hover:translate-x-1 transition-transform cursor-default border border-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 text-sm">{t.type}</p>
                            <p className="text-xs text-slate-400">{t.date}</p>
                        </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                        <p className="font-bold text-slate-800">+R${t.amount.toFixed(0)}</p>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
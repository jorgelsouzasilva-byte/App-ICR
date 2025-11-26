import React from 'react';
import { MOCK_GROUPS } from '../constants';
import { MapPin, Clock, Calendar, Users, Navigation, ArrowLeft } from 'lucide-react';

interface SmallGroupsProps {
  onBack?: () => void;
}

export default function SmallGroups({ onBack }: SmallGroupsProps) {
  
  const handleGetDirections = (address: string) => {
    // Encodes the address and opens Google Maps in a new tab
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6 pb-20 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
            <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
        )}
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Pequenos Grupos</h2>
            <p className="text-slate-500 text-sm">Encontre uma comunidade perto de você</p>
        </div>
      </div>

      {/* Intro Card */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-lg mb-1">Por que participar?</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                    Nossos grupos são o lugar perfeito para criar amizades profundas, estudar a palavra e compartilhar a vida.
                </p>
            </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {MOCK_GROUPS.map((group) => (
          <div 
            key={group.id} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all"
          >
            {/* Image Header */}
            <div className="h-32 relative overflow-hidden">
                <img 
                    src={group.image} 
                    alt={group.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5 block">
                        {group.neighborhood}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-none">{group.name}</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-medium">{group.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-sm font-medium">{group.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600 col-span-2">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm leading-tight">{group.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 col-span-2">
                        <Users className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="text-xs text-slate-400">Líderes: <strong className="text-slate-600">{group.leader}</strong></span>
                    </div>
                </div>

                <button 
                    onClick={() => handleGetDirections(group.address)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                    <Navigation className="w-4 h-4 text-blue-600" />
                    Como Chegar
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
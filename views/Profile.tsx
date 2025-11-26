import React, { useState } from 'react';
import { Mail, Phone, MapPin, Edit2, Settings, Award, ArrowLeft, Bell, Lock, Shield, LogOut, ChevronRight, Camera, Save, LayoutDashboard } from 'lucide-react';

interface ProfileProps {
  onAdminClick?: () => void;
}

export default function Profile({ onAdminClick }: ProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  // Profile Data State
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    group: 'North Hills',
    memberSince: '2019',
    avatar: 'https://picsum.photos/200/200'
  });

  // Temporary state for the edit form
  const [editForm, setEditForm] = useState(profile);

  const handleOpenEdit = () => {
    setEditForm(profile);
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    setProfile(editForm);
    setShowEditProfile(false);
  };

  const handleAvatarChange = () => {
    // Simulate changing avatar by getting a new random image
    const randomId = Math.floor(Math.random() * 1000);
    setEditForm({
        ...editForm, 
        avatar: `https://picsum.photos/200/200?random=${randomId}`
    });
  };

  // --- EDIT PROFILE VIEW ---
  if (showEditProfile) {
    return (
        <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-right duration-300">
             {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowEditProfile(false)} 
                        className="p-3 bg-white rounded-2xl shadow-soft text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-800">Editar Perfil</h2>
                </div>
                <button 
                    onClick={handleSaveProfile}
                    className="text-blue-600 font-bold text-sm hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl"
                >
                    Salvar
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                {/* Photo Edit */}
                 <div className="flex flex-col items-center mb-10 mt-4">
                    <div className="relative mb-4 group">
                        <div className="w-32 h-32 rounded-full p-1.5 bg-white shadow-soft-lg">
                            <img 
                                src={editForm.avatar} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover" 
                            />
                        </div>
                        <button 
                            onClick={handleAvatarChange}
                            className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-4 border-[#f8f9fa] hover:scale-110 active:scale-95 transition-transform"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
                        <input 
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full bg-white border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            placeholder="Digite seu nome completo"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                        <input 
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="w-full bg-white border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            placeholder="nome@exemplo.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Telefone</label>
                        <input 
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            className="w-full bg-white border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            placeholder="+55 (11) 99999-9999"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Pequeno Grupo</label>
                        <input 
                            type="text"
                            value={editForm.group}
                            onChange={(e) => setEditForm({...editForm, group: e.target.value})}
                            className="w-full bg-white border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            placeholder="ex: Zona Norte"
                        />
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-[#f8f9fa]">
                 <button 
                    onClick={handleSaveProfile}
                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-[1.5rem] shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-700"
                >
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
  }

  // --- SETTINGS VIEW ---
  if (showSettings) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Settings Header */}
        <div className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center gap-4 shadow-sm sticky top-0 z-10">
          <button 
            onClick={() => setShowSettings(false)} 
            className="p-3 bg-white rounded-2xl shadow-soft text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">Configurações</h2>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Preferences Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Preferências</h3>
            <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden p-2 space-y-1">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">Notificações Push</span>
                    <span className="text-xs text-slate-400 font-medium">Lembretes e avisos</span>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">Emails</span>
                    <span className="text-xs text-slate-400 font-medium">Newsletters semanais</span>
                  </div>
                </div>
                <button 
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${emailUpdates ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${emailUpdates ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Segurança</h3>
            <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden p-2 space-y-1">
              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Alterar Senha</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
              
              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Privacidade</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </section>

          {/* Actions */}
          <button className="w-full bg-white text-red-500 font-bold py-5 rounded-[1.5rem] shadow-soft flex items-center justify-center gap-2 hover:bg-red-50 hover:shadow-none transition-all mt-8">
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
          
          <p className="text-center text-xs text-slate-400 font-medium mt-6">App Versão 1.0.4 • Lumina Faith</p>
        </div>
      </div>
    );
  }

  // --- MAIN PROFILE VIEW ---
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-4">
        <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full p-2 bg-white shadow-soft-lg">
                <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                />
            </div>
            <button 
              onClick={handleOpenEdit}
              className="absolute bottom-1 right-1 p-3 bg-slate-800 text-white rounded-2xl shadow-lg border-4 border-[#f8f9fa] hover:scale-110 active:scale-95 transition-transform"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{profile.name}</h2>
        <p className="text-slate-400 text-sm font-medium">Membro desde {profile.memberSince}</p>
      </div>

      {/* Info Cards */}
      <div className="bg-white rounded-[2rem] shadow-soft p-6 space-y-5 border border-white">
        <div className="flex items-center gap-4 text-slate-600">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium">{profile.email}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
             <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium">{profile.phone}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
             <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium">{profile.group}</span>
        </div>
      </div>

      {/* Stats / Activity */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Atividades</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[2rem] shadow-soft flex flex-col justify-between h-32 border border-white">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <Award className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-3xl font-black text-slate-800">12</div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Estudos</div>
                </div>
            </div>
             <div className="bg-white p-5 rounded-[2rem] shadow-soft flex flex-col justify-between h-32 border border-white">
                 <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
                    <Award className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-3xl font-black text-slate-800">45</div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Eventos</div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {onAdminClick && (
             <button 
                onClick={onAdminClick}
                className="w-full py-5 bg-slate-800 text-white text-sm font-bold rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-slate-700 transition-colors shadow-lg shadow-slate-300"
             >
                <LayoutDashboard className="w-5 h-5" />
                Acessar Área Administrativa
            </button>
        )}

        <button 
            onClick={() => setShowSettings(true)}
            className="w-full py-5 bg-white text-slate-500 text-sm font-bold rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors shadow-soft"
        >
            <Settings className="w-5 h-5" />
            Configurações
        </button>
      </div>
    </div>
  );
}
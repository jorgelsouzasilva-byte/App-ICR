import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import BibleStudies from './views/BibleStudies';
import EventsCalendar from './views/EventsCalendar';
import Contributions from './views/Contributions';
import LiveStream from './views/LiveStream';
import Profile from './views/Profile';
import SmallGroups from './views/SmallGroups';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import { NavItem, User } from './types';
import { HandHeart, Users, ChevronRight, Play, AlertTriangle, LogOut } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase } from './services/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Loading Component
const AppLoader = () => (
    <div className="flex items-center justify-center h-screen bg-[#f0f2f5]">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

// App-level Error Component for initialization failures
const AppError = ({ message, onLogout }: { message: string, onLogout: () => void }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0f2f5] p-8 text-center">
         <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-red-500 shadow-soft-lg mb-6">
            <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Erro ao Carregar</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-8">
            {message}
        </p>
         <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
            Tentar Novamente
        </button>
         <button
            onClick={onLogout}
            className="mt-4 px-6 py-2 text-slate-500 text-xs font-semibold"
        >
            Sair da Conta
        </button>
    </div>
);


export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>(NavItem.HOME);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setError(null); // Reset error on new session
          await fetchUserProfile(session.user, event);
        } else {
          // User is signed out or session expired
          setLoggedInUser(null);
        }
        
        // This is crucial: setLoading(false) after the async profile fetch is done
        // or we know there's no session. This guarantees the loading screen will disappear.
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (user: SupabaseUser, event?: string) => {
    try {
      let { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: row not found
        throw fetchError;
      }

      // If profile doesn't exist and this is a sign-in event (first time after sign-up), create one.
      if (!profile && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        const name = user.user_metadata.name || user.email?.split('@')[0] || 'Novo Usuário';
        const phone = user.user_metadata.phone || '';
        const group = user.user_metadata.group || 'Não definido';


        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: name,
            phone: phone,
            group: group,
            memberSince: new Date().toISOString(),
            avatar: `https://picsum.photos/seed/${user.id}/200`,
            role: 'user',
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        profile = newProfile;
      }
      
      if (profile) {
        setLoggedInUser({
          id: profile.id,
          name: profile.name,
          email: user.email || profile.email,
          phone: profile.phone,
          group: profile.group,
          memberSince: profile.memberSince,
          avatar: profile.avatar,
          role: profile.role,
        });
      } else {
        // This can happen if a user is deleted from auth but the session lingers.
        // Or if the profile somehow failed to be created.
        throw new Error("O perfil do usuário não foi encontrado e não pôde ser criado.");
      }
    } catch (error: any) {
      console.error('Error fetching/creating user profile:', error);
      setError(`Não foi possível carregar seu perfil. Verifique sua conexão ou a configuração do banco de dados (Tabela: profiles). Detalhes: ${error.message}`);
    }
  };
  
  const handleLogout = async () => {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if(error) console.error("Error signing out:", error);
      // The onAuthStateChange listener will handle setting user to null.
      setActiveTab(NavItem.HOME);
      setLoading(false);
  }

  const handleProfileUpdate = (updatedProfile: User) => {
    setLoggedInUser(updatedProfile);
  };

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    return <AppError message={error} onLogout={handleLogout} />;
  }
  
  if (!loggedInUser) {
    return <Login />;
  }

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
        return <Profile 
                  user={loggedInUser} 
                  onAdminClick={() => setActiveTab(NavItem.ADMIN)} 
                  onLogout={handleLogout}
                  onProfileUpdate={handleProfileUpdate}
                />;
      case NavItem.GROUPS:
        return <SmallGroups onBack={() => setActiveTab(NavItem.HOME)} />;
      case NavItem.ADMIN:
        return <AdminDashboard onBack={() => setActiveTab(NavItem.PROFILE)} />;
      case NavItem.HOME:
      default:
        return <HomeDashboard user={loggedInUser} onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] md:p-10">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[440px] h-[100dvh] bg-[#f8f9fa] flex flex-col relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden md:h-[90vh] md:rounded-[2.5rem] border-0">
        
        {activeTab !== NavItem.ADMIN && <Header activeTab={activeTab} />}

        <main className={`flex-1 overflow-y-auto ${activeTab === NavItem.ADMIN ? '' : 'pb-28'} scroll-smooth no-scrollbar`}>
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>

        {activeTab !== NavItem.ADMIN && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}

// Simple Home Dashboard Component
const HomeDashboard = ({ user, onChangeTab }: { user: User, onChangeTab: (tab: NavItem) => void }) => {
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
            <h2 className="text-2xl font-bold mb-3">Bem-vindo(a), {user.name.split(' ')[0]}!</h2>
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
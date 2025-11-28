import React from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { Shield, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  // Find specific users from mock data to simulate login
  const adminUser = MOCK_USERS.find(u => u.role === 'admin');
  const regularUser = MOCK_USERS.find(u => u.role === 'user');

  if (!adminUser || !regularUser) {
    return <div>Erro: Usuários de simulação não encontrados.</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] p-4 md:p-10">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center h-full">

        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 font-black text-4xl shadow-soft-lg mb-8 border border-white">
            L
        </div>

        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Bem-vindo(a)</h1>
        <p className="text-slate-500 text-center mb-12">Faça login para se conectar com sua comunidade.</p>

        <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-soft-lg border border-white space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                <input 
                    type="email"
                    defaultValue="usuario@lumina.com"
                    className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
                <input 
                    type="password"
                    defaultValue="123456"
                    className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                />
            </div>
        </div>

        <div className="w-full mt-8 space-y-4">
            <button 
                onClick={() => onLogin(regularUser)}
                className="w-full py-5 bg-blue-600 text-white text-sm font-bold rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95"
            >
                <UserIcon className="w-5 h-5" />
                Entrar como Membro
            </button>
            <button 
                onClick={() => onLogin(adminUser)}
                className="w-full py-5 bg-slate-800 text-white text-sm font-bold rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-slate-700 transition-colors shadow-lg shadow-slate-300 active:scale-95"
            >
                <Shield className="w-5 h-5" />
                Entrar como Admin
            </button>
        </div>
        
        <p className="text-center text-xs text-slate-400 font-medium mt-12">
            Esqueceu a senha? <a href="#" className="font-bold text-blue-600">Recuperar</a>
        </p>
      </div>
    </div>
  );
}
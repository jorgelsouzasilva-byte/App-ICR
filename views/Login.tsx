import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
              group,
            },
          },
        });
        if (error) throw error;
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
        setIsSignUp(false); // Switch back to login view
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The App component will detect the successful login and handle the redirect.
      }
    } catch (err: any) {
      if (err.message.includes('Email rate limit exceeded')) {
        setError('Muitas tentativas. Por favor, aguarde um pouco.');
      } else if (err.message.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else {
        setError(err.error_description || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] p-4 md:p-10">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center h-full">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 font-black text-4xl shadow-soft-lg mb-8 border border-white">
          L
        </div>

        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
          {isSignUp ? 'Criar Conta' : 'Bem-vindo(a)'}
        </h1>
        <p className="text-slate-500 text-center mb-12">
          {isSignUp ? 'Preencha os campos para se registrar.' : 'Faça login para se conectar com sua comunidade.'}
        </p>

        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-[2.5rem] shadow-soft-lg border border-white space-y-6">
          {isSignUp && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  placeholder="(Opcional)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Pequeno Grupo</label>
                <input
                  type="text"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  placeholder="Ex: Grupo de Jovens"
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border-none shadow-inner-soft rounded-2xl px-5 py-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-center text-red-500">{error}</p>}
          {message && <p className="text-xs text-center text-green-600">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white text-sm font-bold rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 font-medium mt-8">
          {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} className="font-bold text-blue-600 ml-1">
            {isSignUp ? 'Faça Login' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </div>
  );
}
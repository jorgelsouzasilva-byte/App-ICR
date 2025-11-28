import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yszxevrelpwkfgumejpp.supabase.co';

// --- INSTRUÇÕES CRÍTICAS DE SEGURANÇA ---
// A chave que você forneceu ('sbp_...') é uma CHAVE SECRETA (Service Role Key).
// **NUNCA USE UMA CHAVE SECRETA NO CÓDIGO DO LADO DO CLIENTE (FRONTEND).**
// Ela concede acesso administrativo total ao seu banco de dados e expõe seus dados.

// Você precisa usar a CHAVE PÚBLICA (anon key).
//
// ONDE ENCONTRAR A CHAVE CORRETA:
// 1. Vá para o seu projeto no Supabase: https://app.supabase.com
// 2. No menu à esquerda, clique em "Project Settings" (ícone de engrenagem).
// 3. Clique em "API".
// 4. Em "Project API keys", copie a chave do campo "anon" (public).
//
// A chave correta é um longo texto que geralmente começa com "eyJ...".
// Cole essa chave 'anon' abaixo no lugar do texto em maiúsculas.
const supabaseKey = 'sb_publishable_ZQFuvfSsuuawrO0-QF0fsA_iot8GKyC';


if (!supabaseKey || supabaseKey.startsWith('COLE_SUA_CHAVE')) {
    const errorMessage = "Chave de API do Supabase não configurada. Por favor, adicione sua chave pública (anon key) no arquivo 'services/supabase.ts'. Não use a chave secreta.";
    // Render error message in the DOM for visibility
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="padding: 2rem; text-align: center; font-family: sans-serif; color: #555;">${errorMessage}</div>`;
    }
    throw new Error(errorMessage);
}


export const supabase = createClient(supabaseUrl, supabaseKey);
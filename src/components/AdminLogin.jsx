import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, AlertTriangle, Eye, EyeOff, X } from 'lucide-react';

import { supabase } from '../lib/supabaseClient';

const AdminLogin = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('');

  const ACCESS_CODE = 'wisey2026!';

  useEffect(() => {
    checkGlobalLock();
  }, []);

  const checkGlobalLock = async () => {
    try {
      const { data } = await supabase
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'admin_status')
        .single();
      
      if (data && data.valor === 'locked') {
        setIsLocked(true);
        setError('SISTEMA BLOQUEADO PERMANENTEMENTE NO BANCO DE DADOS.');
      }
    } catch (e) {
      console.log("Configurações ainda não criadas no Supabase.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (password === ACCESS_CODE) {
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');

      if (newAttempts >= 6) {
        setIsLocked(true);
        setError('BLOQUEANDO ACESSO PERMANENTEMENTE...');
        
        // Salva o bloqueio no Banco de Dados
        try {
          await supabase
            .from('configuracoes')
            .upsert({ chave: 'admin_status', valor: 'locked' });
        } catch(e) {}
          
        setError('SISTEMA BLOQUEADO PERMANENTEMENTE NO BANCO DE DADOS.');
        return;
      }

      let lockTime = 0;
      if (newAttempts === 3) lockTime = 60000; // 1 min
      else if (newAttempts === 4) lockTime = 300000; // 5 min
      else if (newAttempts === 5) lockTime = 900000; // 15 min

      if (lockTime > 0) {
        setIsLocked(true);
        const minutes = lockTime / 60000;
        setError(`Muitas tentativas falhas. Tente novamente em ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}.`);
        setTimeout(() => {
          setIsLocked(false);
          setError('');
        }, lockTime);
      } else {
        setError(`Código inválido. Tentativa ${newAttempts} de 6.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-10 relative shadow-[0_0_100px_rgba(220,38,38,0.1)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-600/10 rounded-3xl mx-auto mb-6 flex items-center justify-center text-red-600 shadow-inner">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Acesso Restrito</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Criptografia Terminal Wisey_OS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Chave de Segurança</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                disabled={isLocked}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm focus:outline-none focus:border-red-600 transition-all font-bold placeholder:text-slate-700 text-white"
                placeholder="DIGITE O CÓDIGO"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase"
              >
                <AlertTriangle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isLocked}
            className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${
              isLocked 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
              : 'bg-red-600 text-white shadow-[0_15px_40px_-10px_rgba(220,38,38,0.4)] hover:bg-red-700'
            }`}
          >
            {isLocked ? 'SISTEMA BLOQUEADO' : 'AUTENTICAR'}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
          <ShieldCheck size={16} />
          <div className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-[8px] font-black uppercase tracking-widest">SSL Secure Access</span>
          <div className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-[8px] font-black uppercase tracking-widest">Wisey 2026</span>
        </div>
      </motion.div>
    </div>
iv>
  );
};

export default AdminLogin;

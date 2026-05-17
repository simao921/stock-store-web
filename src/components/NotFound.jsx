import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Terminal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden text-white select-none">
      {/* Background Decorative Effects */}
      <div className="absolute inset-0 z-0">
        {/* Neon Red glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        {/* Matrix grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Futuristic Glowing Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.15)]"
        >
          <ShieldAlert size={14} className="animate-bounce" /> ROTA DE SEGURANÇA QUEBRADA
        </motion.div>

        {/* Big Giant 404 Glitch Number */}
        <div className="relative inline-block select-text">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="text-8xl md:text-9xl font-black font-heading tracking-tighter text-white relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            404
          </motion.h1>
          <h1 className="text-8xl md:text-9xl font-black font-heading tracking-tighter text-red-600 absolute inset-0 -translate-x-1 translate-y-1 opacity-70 z-0 animate-pulse select-none">
            404
          </h1>
          <h1 className="text-8xl md:text-9xl font-black font-heading tracking-tighter text-blue-600 absolute inset-0 translate-x-1 -translate-y-1 opacity-70 z-0 animate-pulse select-none">
            404
          </h1>
        </div>

        {/* Dynamic description and message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-black uppercase font-heading tracking-tight">Caminho não encontrado</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            O endereço digitado não existe ou foi removido para fins de otimização de segurança na <span className="text-red-500 font-bold">Wisey Store</span>.
          </p>
        </motion.div>

        {/* Terminal/Security Info Console */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-3xl bg-[#0c0c0f] border-2 border-white/5 text-left font-mono text-xs space-y-2 text-white/50 relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <span className="flex items-center gap-2 font-black text-white/70 uppercase">
              <Terminal size={14} className="text-red-500" /> STATUS CONSOLA
            </span>
            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">ERROR_NOT_FOUND</span>
          </div>
          <p><span className="text-red-500">&gt;</span> ERROR: RESOURCE_NOT_FOUND</p>
          <p><span className="text-red-500">&gt;</span> SECURE_BYPASS: DISALLOWED</p>
          <p><span className="text-red-500">&gt;</span> ACTION: REDIRECT_RECOMMENDED</p>
          
          <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none">
            <Sparkles size={160} />
          </div>
        </motion.div>

        {/* Beautiful Retro-Futuristic Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-4"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} /> VOLTAR PARA A LOJA
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

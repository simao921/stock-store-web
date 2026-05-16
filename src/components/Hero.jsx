import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Zap, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-black flex items-center justify-center min-h-[80vh]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Badge Principal */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-5 py-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">O MELHOR PREÇO DO MERCADO</span>
          </motion.div>

          {/* Título Estilo Vault-Blox */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black tracking-tight uppercase leading-[0.9] mb-8 font-heading"
          >
            <span className="text-white">COMPRE ROBUX COM</span><br />
            <span className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">BÔNUS EXCLUSIVO</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm md:text-lg font-medium max-w-2xl mb-12 uppercase tracking-[0.1em]"
          >
            Receba os seus Robux de forma <span className="text-white">imediata e segura</span>. <br className="hidden md:block" />
            Promoção ativa: <span className="text-emerald-400 font-bold">+100% de bônus em todas as compras</span>.
          </motion.p>

          {/* Botões e Stats */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
            <motion.a 
              href="#catalog"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3 shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all"
            >
              <ShoppingCart size={18} /> COMEÇAR A COMPRAR
            </motion.a>
            
            <div className="flex items-center gap-8 px-8 h-12">
               <div className="flex items-center gap-3">
                 <ShieldCheck className="text-emerald-500" size={20} />
                 <div className="text-left">
                   <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Segurança</div>
                   <div className="text-xs font-black text-white">100% GARANTIDA</div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Zap className="text-emerald-500" size={20} />
                 <div className="text-left">
                   <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Entrega</div>
                   <div className="text-xs font-black text-white">INSTANTÂNEA</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Social Proof Simples */}
          <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                  U{i}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-emerald-400">
                <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
              </div>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">+5.000 Clientes Satisfeitos</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

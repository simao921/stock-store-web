import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, ShieldCheck } from 'lucide-react';

const Support = () => {
  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Assistência Prioritária</span>
          <h1 className="text-7xl md:text-[8rem] font-heading font-black tracking-tighter uppercase leading-[0.8] mb-12">
            <span className="block text-white">CENTRAL DE</span>
            <span className="text-outline-premium block mt-2">SUPORTE</span>
          </h1>
          <p className="text-white/30 text-lg md:text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest leading-relaxed">
            Nossa equipe está pronta para garantir a sua <span className="text-white">soberania no jogo</span>.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-32">
           <div className="glass-card p-16 flex flex-col items-center text-center border-white/5 group hover:border-purple-500/30 transition-all">
              <div className="w-20 h-20 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-10 text-purple-500 group-hover:scale-110 transition-transform">
                 <MessageCircle size={36} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 font-heading text-white">Discord Oficial</h3>
              <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest leading-loose mb-12 max-w-xs">
                 Tempo médio de resposta: 15 minutos. Abra um ticket para suporte técnico ou financeiro.
              </p>
              <a 
                href="https://discord.gg/xqCtsTh9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                 ABRIR TICKET NO DISCORD
              </a>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
           <div className="flex items-center gap-6 p-8 glass-card border-white/5">
              <Clock className="text-purple-500 shrink-0" size={32} />
              <div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">Horário de Operação</h4>
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Segunda a Sábado • 10:00 - 22:00</p>
              </div>
           </div>
           <div className="flex items-center gap-6 p-8 glass-card border-white/5">
              <ShieldCheck className="text-purple-500 shrink-0" size={32} />
              <div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">Garantia de Entrega</h4>
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Suporte técnico especializado</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Support;

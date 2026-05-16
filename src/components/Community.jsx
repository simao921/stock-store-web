import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Award, Shield } from 'lucide-react';

const Community = () => {
  const stats = [
    { label: 'Membros', val: '+5.000', icon: Users },
    { label: 'Scripts Ativos', val: '150+', icon: Award },
    { label: 'Suporte 24/7', val: 'Online', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Ecossistema Elite</span>
          <h1 className="text-7xl md:text-[8rem] font-heading font-black tracking-tighter uppercase leading-[0.8] mb-12">
            <span className="block text-white">NOSSA</span>
            <span className="text-outline-premium block mt-2">COMUNIDADE</span>
          </h1>
          <p className="text-white/30 text-lg md:text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest leading-relaxed">
            Faça parte do maior hub de <span className="text-white">inteligência competitiva</span> do Roblox.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
           {stats.map((s, i) => (
             <div key={i} className="glass-card p-12 text-center border-white/5">
                <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-8 text-purple-500">
                   <s.icon size={28} />
                </div>
                <div className="text-4xl font-black font-heading text-white mb-2">{s.val}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{s.label}</div>
             </div>
           ))}
        </div>

        <div className="glass-card p-16 flex flex-col md:flex-row items-center justify-between gap-12 border-white/5 bg-gradient-to-br from-purple-900/10 to-transparent">
           <div className="max-w-xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 font-heading">Pronto para o Próximo Nível?</h2>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest leading-loose">
                 Junte-se a milhares de jogadores que já dominam o servidor. Troque experiências, receba atualizações exclusivas e participe de sorteios semanais.
              </p>
           </div>
           <a 
             href="https://discord.gg/xqCtsTh9" 
             target="_blank" 
             rel="noopener noreferrer"
             className="px-16 py-6 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-white/10 flex items-center gap-4"
           >
              ENTRAR NO DISCORD <MessageSquare size={20} />
           </a>
        </div>

      </div>
    </div>
  );
};

export default Community;

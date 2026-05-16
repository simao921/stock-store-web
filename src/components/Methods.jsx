import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Zap, Clock, ShieldCheck, RefreshCcw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Methods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const { data } = await supabase
          .from('estoque')
          .select('*')
          .eq('categoria', 'Método')
          .order('created_at', { ascending: false });
        if (data) setMethods(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  const highlights = [
    { icon: Zap, name: 'Puxa-Play', color: '#a855f7', desc: 'Teleporte instantâneo para servidores.' },
    { icon: Clock, name: 'Anti-Cooldown', color: '#d946ef', desc: 'Habilidades sem tempo de recarga.' },
    { icon: ShieldCheck, name: 'Anti-Detect', color: '#6366f1', desc: 'Proteção contra banimentos.' },
  ];

  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
          <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Knowledge Base</span>
          <h1 className="text-7xl md:text-[8rem] font-heading font-black tracking-tighter uppercase leading-[0.8] mb-12">
            <span className="block text-white">HUB DE</span>
            <span className="block text-red-700 mt-2">MÉTODOS</span>
          </h1>
          <p className="text-white/30 text-lg md:text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest leading-relaxed">
            Domine os sistemas mais complexos com <span className="text-white">tecnologia de ponta</span>.
          </p>
        </motion.div>

        {/* ... Rest of the component remains the same ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {highlights.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-10 border-white/5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${h.color}10`, border: `1px solid ${h.color}20` }}>
                <h.icon size={22} style={{ color: h.color }} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-white">{h.name}</h3>
              <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight uppercase font-heading text-white">Biblioteca Ativa</h2>
          <div className="h-px flex-grow mx-12 bg-white/5" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20 opacity-20"><RefreshCcw className="animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {methods.map((method, i) => (
              <motion.div key={method.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="group relative flex flex-col rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-red-600/30 transition-all">
                <div className="relative h-72 overflow-hidden bg-black">
                  {method.imagem_url ? <img src={method.imagem_url} alt={method.nome} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" /> : <div className="w-full h-full flex items-center justify-center bg-red-600/5"><Zap size={48} className="text-red-600/20" /></div>}
                  <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-red-500">{method.categoria}</div>
                </div>
                <div className="p-12 flex flex-col flex-grow">
                  <h3 className="text-3xl font-black mb-6 tracking-tighter uppercase font-heading text-white">{method.nome}</h3>
                  <p className="text-[11px] text-white/30 mb-10 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{method.descricao}</p>
                  <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="text-3xl font-black font-heading text-white"><span className="text-sm text-red-600 mr-2">R$</span>{method.valor.toFixed(2)}</div>
                    <Link to={`/produto/${method.id}`} className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-red-700 hover:text-white transition-all shadow-xl shadow-white/5">ACESSAR <ArrowRight size={16} /></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Methods;

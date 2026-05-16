import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, MessageSquare, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#05020a] border-t border-white/5 pt-32 pb-20 px-8 relative overflow-hidden">
      {/* Glow de fundo roxo */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative z-10">
        
        {/* Brand Column */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center p-2 shadow-lg shadow-purple-500/10 group-hover:border-purple-500/50 transition-all">
               <img src="/assets/logo.png" alt="WISEY" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase font-heading text-white">
              Wisey<span className="text-purple-600">.</span>
            </span>
          </Link>
          <p className="text-white/30 text-sm font-medium leading-relaxed uppercase tracking-widest max-w-[280px]">
             A infraestrutura definitiva para quem busca performance e soberania em métodos digitais.
          </p>
          <div className="flex gap-4">
             <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-purple-500 transition-colors cursor-pointer"><Shield size={20} /></div>
             <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-purple-500 transition-colors cursor-pointer"><Zap size={20} /></div>
             <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-purple-500 transition-colors cursor-pointer"><Globe size={20} /></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-8">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Navegação</h4>
           <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link to="/methods" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Métodos</Link></li>
              <li><Link to="/community" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Comunidade</Link></li>
              <li><Link to="/faq" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Perguntas Frequentes</Link></li>
           </ul>
        </div>

        {/* Support */}
        <div className="space-y-8">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Suporte & Legal</h4>
           <ul className="space-y-4">
              <li><Link to="/support" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Atendimento</Link></li>
              <li><Link to="/policies" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/policies" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link to="/policies" className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Reembolsos</Link></li>
           </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
          © 2026 Wisey Store • Built for the elite
        </p>
        <div className="flex items-center gap-6">
           <MessageSquare size={16} className="text-white/10 hover:text-purple-500 cursor-pointer" />
           <Mail size={16} className="text-white/10 hover:text-purple-500 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

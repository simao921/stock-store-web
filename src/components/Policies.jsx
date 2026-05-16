import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, RotateCcw } from 'lucide-react';

const Policies = () => {
  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-8 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Documentação Oficial</span>
          <h1 className="text-7xl md:text-[8rem] font-heading font-black tracking-tighter uppercase leading-[0.8] mb-12">
            <span className="block text-white">TERMOS E</span>
            <span className="text-outline-premium block mt-2">POLÍTICAS</span>
          </h1>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">Última atualização: Maio de 2026</p>
        </motion.div>

        <div className="space-y-16">
          {/* Termos de Uso */}
          <section className="glass-card p-12 border-white/5">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Shield size={20} />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tighter font-heading text-white">Termos de Uso</h2>
            </div>
            <div className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
              <p>1. Ao utilizar a Wisey Store, você concorda com todas as diretrizes de segurança e termos aqui estabelecidos.</p>
              <p>2. Nossos scripts são ferramentas de automação e devem ser usados com responsabilidade. Não nos responsabilizamos por mau uso.</p>
              <p>3. É proibida a redistribuição ou revenda não autorizada de qualquer conteúdo adquirido em nossa plataforma.</p>
            </div>
          </section>

          {/* Privacidade */}
          <section className="glass-card p-12 border-white/5">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Lock size={20} />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tighter font-heading text-white">Privacidade</h2>
            </div>
            <div className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
              <p>1. Seus dados (Nick do Discord e E-mail) são usados exclusivamente para a entrega e suporte dos produtos.</p>
              <p>2. Não compartilhamos informações de clientes com terceiros em nenhuma circunstância.</p>
              <p>3. Utilizamos criptografia de ponta para garantir que suas transações sejam seguras.</p>
            </div>
          </section>

          {/* Reembolsos */}
          <section className="glass-card p-12 border-white/5">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <RotateCcw size={20} />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tighter font-heading text-white">Reembolsos</h2>
            </div>
            <div className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
              <p>1. Devido à natureza digital dos nossos produtos, reembolsos são analisados caso a caso pela equipa técnica.</p>
              <p>2. Caso o produto não funcione conforme descrito e não possamos resolver em 48h, o reembolso será processado.</p>
              <p>3. Reembolsos por "arrependimento" não são aplicáveis a produtos digitais após o download/acesso.</p>
            </div>
          </section>
        </div>

        <div className="mt-32 text-center">
           <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
              Dúvidas sobre os termos? <a href="https://discord.gg/xqCtsTh9" className="text-purple-500 underline ml-2">Fale conosco no Discord</a>
           </p>
        </div>

      </div>
    </div>
  );
};

export default Policies;

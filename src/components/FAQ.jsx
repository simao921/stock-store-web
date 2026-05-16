import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "Como recebo meu script após a compra?", a: "Após a confirmação do pagamento, você deve abrir um ticket em nosso Discord enviando o ID do seu pedido. Nossa equipe fará a entrega imediata." },
    { q: "Os métodos são seguros e anti-ban?", a: "Sim, todos os nossos métodos passam por testes rigorosos de detecção antes de serem disponibilizados no catálogo." },
    { q: "Posso solicitar reembolso?", a: "Oferecemos reembolso total caso o produto apresente defeito técnico que não possamos resolver em até 48 horas." },
    { q: "Quais as formas de pagamento?", a: "Atualmente aceitamos PIX e Cartão via suporte manual no Discord." },
    { q: "Como funcionam as atualizações?", a: "Todos os clientes têm acesso vitalício às atualizações do produto adquirido através da nossa comunidade." },
  ];

  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-8 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Central de Ajuda</span>
          <h1 className="text-7xl md:text-[8rem] font-heading font-black tracking-tighter uppercase leading-[0.8] mb-12">
            <span className="block text-white">DÚVIDAS</span>
            <span className="text-outline-premium block mt-2">FREQUENTES</span>
          </h1>
        </motion.div>

        <div className="space-y-6">
           {faqs.map((faq, i) => (
             <div key={i} className="glass-card overflow-hidden border-white/5">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-10 py-8 flex items-center justify-between text-left hover:bg-white/[0.01] transition-colors"
                >
                   <span className="text-lg font-black uppercase tracking-tight text-white/80">{faq.q}</span>
                   <div className={`p-2 rounded-full transition-all ${openIndex === i ? 'bg-purple-600 text-white rotate-180' : 'bg-white/5 text-white/40'}`}>
                      {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                   </div>
                </button>
                <AnimatePresence>
                   {openIndex === i && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }} 
                       animate={{ height: 'auto', opacity: 1 }} 
                       exit={{ height: 0, opacity: 0 }}
                       className="px-10 pb-8"
                     >
                        <p className="text-white/40 text-sm font-medium uppercase tracking-widest leading-loose pt-4 border-t border-white/5">
                           {faq.a}
                        </p>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
           ))}
        </div>

        <div className="mt-32 text-center p-12 glass-card border-white/5">
           <HelpCircle size={40} className="mx-auto mb-6 text-purple-500 opacity-50" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              Ainda com dúvidas? <a href="/support" className="text-white underline ml-2">Fale com o Suporte</a>
           </p>
        </div>

      </div>
    </div>
  );
};

export default FAQ;

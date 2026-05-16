import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, AlertCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const CheckoutPage = ({ cart, finalTotal, discordNick, onOrderComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    termos: false
  });
  const [orderId, setOrderId] = useState(null);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!formData.termos) return alert('Você deve aceitar os termos de uso.');
    if (cart.length === 0) return alert('Seu carrinho está vazio.');
    
    setLoading(true);
    try {
      // Como a tabela 'pedidos' atual é limitada, vamos enviar o ID do primeiro produto do carrinho
      // e o Nick do Discord. O resto (Nome/Email) será guardado apenas para esta sessão por enquanto.
      
      const { data, error } = await supabase.from('pedidos').insert([
        {
          discord_nick: discordNick,
          produto_id: cart[0].id, // Envia o ID do primeiro produto
          status: 'pendente'
        }
      ]).select();

      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }

      if (data && data.length > 0) {
        setOrderId(data[0].id);
        setStep(2);
      } else {
        throw new Error("Nenhum dado retornado do servidor.");
      }
    } catch (err) {
      alert(`Erro ao processar: ${err.message || 'Verifique sua conexão'}`);
      console.error("Erro no checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-purple-500 outline-none font-bold transition-all text-white";

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-16 px-4">
           {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-white/20'}`}>
                    {step > s ? <CheckCircle2 size={20} /> : s}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-white' : 'text-white/20'}`}>
                    {s === 1 ? 'Identificação' : 'Finalização'}
                 </span>
                 {s === 1 && <div className="w-12 h-px bg-white/5 mx-4" />}
              </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-12">
                 <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Seus Dados</h2>
                    <p className="text-white/30 text-xs font-black uppercase tracking-widest">Preencha para prosseguir com o pedido</p>
                 </div>

                 <form onSubmit={handleNext} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Nome</label>
                          <input required type="text" className={inputCls} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Sobrenome</label>
                          <input required type="text" className={inputCls} value={formData.sobrenome} onChange={e => setFormData({...formData, sobrenome: e.target.value})} />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Email Principal</label>
                       <input required type="email" className={inputCls} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="pt-6 space-y-4">
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <input required type="checkbox" className="w-5 h-5 rounded-lg bg-white/5 border-white/10 checked:bg-purple-600 transition-all cursor-pointer" checked={formData.termos} onChange={e => setFormData({...formData, termos: e.target.checked})} />
                          <span className="text-[11px] text-white/40 font-medium leading-tight group-hover:text-white transition-colors">
                             Li e aceito os <Link to="/policies" className="text-purple-400 underline">Termos de Uso</Link>.
                          </span>
                       </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-purple-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 mt-10">
                       {loading ? 'Processando...' : 'PRÓXIMO PASSO'} <ArrowRight size={18} />
                    </button>
                 </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="glass-card p-12 text-center border-white/5">
                  <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-purple-500">
                     <AlertCircle size={40} />
                  </div>
                  
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Finalize seu Pedido</h2>
                  <p className="text-white/40 text-sm font-medium leading-relaxed max-w-md mx-auto mb-10 uppercase tracking-widest">
                     O sistema automático está em manutenção. Entre em contacto no Discord.
                  </p>

                  <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 mb-10 space-y-6">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">ID do Pedido</span>
                        <span className="text-sm font-black text-purple-400">#{orderId?.toString().slice(0,8)}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Valor Total</span>
                        <span className="text-xl font-black text-white">R$ {finalTotal.toFixed(2)}</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <a 
                       href="https://discord.gg/xqCtsTh9" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full py-6 rounded-3xl bg-purple-600 text-white font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3"
                     >
                        ABRIR TICKET NO DISCORD <MessageCircle size={18} />
                     </a>
                     <Link 
                       to="/" 
                       onClick={onOrderComplete}
                       className="w-full py-6 rounded-3xl bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                     >
                        VOLTAR PARA A LOJA
                     </Link>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage;

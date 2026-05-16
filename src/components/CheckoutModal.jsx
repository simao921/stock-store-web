import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, QrCode, CreditCard, ShoppingCart, MessageSquare, ArrowRight, Heart, Sparkles, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';

const CheckoutModal = ({ isOpen, onClose, cart, total, finalTotal, discordNick, onOrderComplete }) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const pixKey = "wisey.vendas@pix.com.br"; 
  
  // Dynamic PIX Payload
  const pixPayload = `00020126580014BR.GOV.BCB.PIX0114${pixKey}5204000053039865404${finalTotal.toFixed(2)}5802BR5908Wisey6009Vendas62070503***6304`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!discordNick) {
      alert('Por favor, informe seu nick do Discord no carrinho.');
      onClose();
      return;
    }

    setSaving(true);
    try {
      const orders = cart.map(item => ({
        id_produto: item.id,
        discord_nick: discordNick,
        status: 'pendente',
        valor_pago: item.valor
      }));

      const { error } = await supabase.from('pedidos').insert(orders);
      if (error) throw error;

      setIsSuccess(true);
      // Wait a bit to show success screen before clearing cart
      setTimeout(() => {
        onOrderComplete();
        window.open("https://discord.gg/xqCtsTh9", "_blank");
      }, 4000);
    } catch (err) {
      console.error(err);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            className="relative w-full max-w-xl bg-[#0c0c0f] border border-white/10 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(139,92,246,0.15)]"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"><X size={24} /></button>

            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <CreditCard size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">Finalizar via PIX</h2>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Escaneie o QR Code real abaixo</p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="shrink-0 group">
                   <div className="w-44 h-44 bg-white p-4 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105 duration-500">
                      <QRCodeSVG 
                        value={pixPayload} 
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                   </div>
                   <p className="text-[10px] font-black text-center mt-4 text-purple-400 uppercase tracking-widest animate-pulse">Aguardando Pagamento</p>
                </div>

                <div className="flex-grow w-full space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">Total a Pagar</span>
                        <div className="text-4xl font-black text-white leading-none">
                           <span className="text-sm text-purple-500 mr-1">R$</span>{finalTotal.toFixed(2)}
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">Itens</span>
                        <div className="text-lg font-black text-white/60">{cart.length}</div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block">PIX Copia e Cola</span>
                     <div className="relative group">
                        <input 
                          readOnly 
                          value={pixPayload}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-[10px] font-mono text-white/20 focus:outline-none truncate"
                        />
                        <button 
                          onClick={copyToClipboard}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all shadow-lg"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              disabled={saving}
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-3 py-6 rounded-3xl bg-purple-600 text-white font-black uppercase tracking-widest text-sm hover:bg-purple-500 transition-all shadow-[0_20px_60px_-10px_rgba(168,85,247,0.5)] disabled:opacity-50"
            >
              {saving ? 'Validando...' : 'Confirmar Pagamento'}
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-[10px] font-medium text-white/20 mt-8 uppercase tracking-widest leading-relaxed">
              * Pagamento processado instantaneamente.<br/>
              A entrega será realizada pelo Discord: <strong>{discordNick}</strong>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            className="text-center p-12 bg-[#0c0c0f] border border-red-600/20 rounded-[4rem] max-w-md w-full shadow-[0_0_150px_rgba(16,185,129,0.1)]"
          >
            <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-10 border border-red-600/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
               >
                 <CheckCircle size={48} />
               </motion.div>
            </div>
            
            <h2 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">Obrigado!</h2>
            <p className="text-white/40 text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest">
              Sua compra na <span className="text-purple-400 font-black">Wisey Store</span> foi registrada com sucesso.
            </p>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-10">
               <div className="flex items-center justify-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest">
                  <Sparkles size={16} /> Pedido Enviado para Fila
               </div>
               <p className="text-[10px] text-white/20 mt-2 uppercase">Aguardando entrega no Discord</p>
            </div>

            <div className="flex items-center justify-center gap-3 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em]">
               <RefreshCcw size={12} className="animate-spin" /> Redirecionando...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutModal;

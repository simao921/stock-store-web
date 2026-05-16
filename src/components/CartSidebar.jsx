import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, MessageSquare, Plus, Minus, Ticket, QrCode, Copy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose, cart, removeFromCart, updateQuantity, coupon, setCoupon, applyCoupon, discount, appliedCoupon, total, finalTotal, robloxNick, setRobloxNick }) => {
  const [paymentStep, setPaymentStep] = useState(1); // 1: Cart, 2: PIX
  
  const pixKey = "contaffxzx0@gmail.com";
  const merchantName = "Carlos Eduardo";
  const merchantCity = "SAO PAULO";

  const generatePixPayload = () => {
    // Implementação simplificada do BRCode para PIX Estático
    const formatField = (id, value) => {
      const len = value.length.toString().padStart(2, '0');
      return `${id}${len}${value}`;
    };

    const amount = finalTotal.toFixed(2);
    
    // Merchant Account Info (GUI + Key)
    const gui = formatField('00', 'br.gov.bcb.pix');
    const key = formatField('01', pixKey);
    const merchantAccount = formatField('26', gui + key);

    const txidValue = "W" + Math.random().toString(36).substring(2, 12).toUpperCase();
    const additionalDataField = formatField('62', formatField('05', txidValue));

    let payload = [
      formatField('00', '01'), // Payload Format Indicator
      merchantAccount,
      formatField('52', '0000'), // Merchant Category Code
      formatField('53', '986'),  // Transaction Currency (BRL)
      formatField('54', amount), // Transaction Amount
      formatField('58', 'BR'),   // Country Code
      formatField('59', merchantName.substring(0, 25)), // Merchant Name
      formatField('60', merchantCity.substring(0, 15)), // Merchant City
      additionalDataField,      // Unique TXID
    ].join('');

    // CRC16 Calculation
    const crc16 = (data) => {
      let crc = 0xFFFF;
      for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
          else crc <<= 1;
        }
      }
      return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };

    return payload + "6304" + crc16(payload + "6304"); 
  };

  const pixPayload = generatePixPayload();

  const handleClose = () => {
    onClose();
    setTimeout(() => setPaymentStep(1), 500); // Reset after animation
  };

  const copyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    alert("Código PIX Copia e Cola copiado!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => paymentStep === 1 && handleClose()} 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] ${paymentStep === 2 ? 'cursor-default' : 'cursor-pointer'}`} 
          />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#050505] border-l border-white/5 shadow-2xl z-[101] flex flex-col">
            
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {paymentStep === 2 && (
                  <button onClick={() => setPaymentStep(1)} className="p-2 -ml-2 hover:bg-white/5 rounded-xl text-white/40"><ArrowLeft size={20} /></button>
                )}
                <div className="p-3 rounded-2xl bg-red-600/10 text-red-600">
                  {paymentStep === 1 ? <ShoppingBag size={20} /> : <QrCode size={20} />}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  {paymentStep === 1 ? 'Seu Carrinho' : 'Pagamento PIX'}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40"><X /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-8">
              {paymentStep === 1 ? (
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full py-20 flex flex-col items-center justify-center opacity-30 text-white">
                      <ShoppingBag size={64} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-[10px]">Vazio</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <motion.div layout key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                              {item.imagem_url ? <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-[10px]">R</div>}
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-tight text-white">{item.nome}</h4>
                              <p className="text-[10px] text-red-500 font-bold">R$ {item.valor.toFixed(2)}</p>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Quantidade</span>
                           <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 px-3 border border-white/5">
                              <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white"><Minus size={14} /></button>
                              <span className="text-xs font-black min-w-[20px] text-center text-white">{item.quantity || 1}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white"><Plus size={14} /></button>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="p-6 bg-white rounded-[2rem] mb-8 shadow-2xl shadow-red-600/10">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}&bgcolor=ffffff`} 
                      alt="PIX QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Escaneie o QR Code</h3>
                  <div className="flex flex-col gap-1 mb-8">
                     <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Pagamento Seguro via PIX</span>
                     <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Processamento Automático</span>
                  </div>

                  <div className="w-full p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                    <div className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em] text-left">PIX Copia e Cola</div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold text-white/40 break-all text-left line-clamp-2">{pixPayload}</span>
                      <button onClick={copyPix} className="p-3 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white transition-all text-white/40 flex-shrink-0">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center gap-4 p-4 rounded-xl bg-red-600/5 border border-red-600/10 text-left">
                    <CheckCircle2 className="text-red-600 shrink-0" size={20} />
                    <p className="text-[9px] font-bold text-white/40 uppercase leading-relaxed">
                      Após o pagamento, o seu pedido será processado <span className="text-white">automaticamente</span>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-6">
              {paymentStep === 1 ? (
                <>
                  {/* Roblox Nick */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                      <MessageSquare size={12} className="text-red-500" /> Nick Roblox
                    </div>
                    <input type="text" placeholder="Ex: PlayerRoblox" value={robloxNick} onChange={(e) => setRobloxNick(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:border-red-600 outline-none font-bold text-white" />
                  </div>

                  {/* Coupon Field */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                      <Ticket size={12} className="text-red-500" /> Cupom de Desconto
                    </div>
                    <div className="flex gap-2">
                       <input type="text" placeholder="Código" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-grow bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:border-red-600 outline-none font-bold text-white uppercase" />
                       <button onClick={applyCoupon} className="px-6 rounded-xl bg-white text-black font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">Aplicar</button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between text-2xl font-black tracking-tighter text-white">
                       <span>TOTAL</span>
                       <span className="premium-gradient">R$ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setPaymentStep(2)} 
                    className={`w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-700 hover:text-white transition-all shadow-xl shadow-red-600/5 ${(!robloxNick || cart.length === 0) ? 'opacity-20 pointer-events-none' : ''}`}
                  >
                    FINALIZAR PEDIDO <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleClose}
                  className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                >
                  JÁ REALIZEI O PAGAMENTO
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

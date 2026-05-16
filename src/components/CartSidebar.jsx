import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, MessageSquare, Plus, Minus, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose, cart, removeFromCart, updateQuantity, coupon, setCoupon, applyCoupon, discount, appliedCoupon, total, finalTotal, discordNick, setDiscordNick }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#050505] border-l border-white/5 shadow-2xl z-[101] flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500"><ShoppingBag size={20} /></div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Seu Carrinho</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40"><X /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-white">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="font-black uppercase tracking-widest text-[10px]">Vazio</p>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div layout key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                          {item.imagem_url ? <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-purple-500 font-black text-[10px]">{item.categoria[0]}</div>}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-tight text-white">{item.nome}</h4>
                          <p className="text-[10px] text-purple-400 font-bold">R$ {item.valor.toFixed(2)}</p>
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

            <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-6">
              
              {/* Discord Nick */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                  <MessageSquare size={12} className="text-purple-400" /> Nick Discord
                </div>
                <input type="text" placeholder="Ex: wisey#0001" value={discordNick} onChange={(e) => setDiscordNick(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:border-purple-500 outline-none font-bold text-white" />
              </div>

              {/* Coupon Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                  <Ticket size={12} className="text-purple-400" /> Cupom de Desconto
                </div>
                <div className="flex gap-2">
                   <input type="text" placeholder="Código" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-grow bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:border-purple-500 outline-none font-bold text-white uppercase" />
                   <button onClick={applyCoupon} className="px-6 rounded-xl bg-white text-black font-black uppercase text-[10px] hover:bg-purple-500 hover:text-white transition-all">Aplicar</button>
                </div>
                {appliedCoupon && (
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <CheckCircle2 size={12} /> Cupom {appliedCoupon} Ativado
                   </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                   <div className="flex justify-between text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <span>Desconto</span>
                      <span>-R$ {(total * discount).toFixed(2)}</span>
                   </div>
                )}
                <div className="flex justify-between text-2xl font-black tracking-tighter pt-2 text-white">
                   <span>TOTAL</span>
                   <span className="premium-gradient">R$ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" onClick={onClose} className={`w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-purple-600 hover:text-white transition-all shadow-xl ${(!discordNick || cart.length === 0) ? 'opacity-20 pointer-events-none' : ''}`}>
                FINALIZAR COMPRA <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

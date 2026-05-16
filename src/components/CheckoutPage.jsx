import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, AlertCircle, MessageCircle, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

// Função para gerar o Payload do PIX (Estático)
const generatePixPayload = (key, name, city, amount, txid = "WISEYSTORE") => {
  const formatField = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const merchantAccountInfo = 
    formatField('00', 'br.gov.bcb.pix') + 
    formatField('01', key);

  const additionalDataField = formatField('05', txid);

  let payload = 
    formatField('00', '01') +
    formatField('26', merchantAccountInfo) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', amount.toFixed(2)) +
    formatField('58', 'BR') +
    formatField('59', name.slice(0, 25)) +
    formatField('60', city.slice(0, 15)) +
    formatField('62', additionalDataField) +
    '6304';

  // Cálculo de CRC16 simplificado (Padrão para PIX)
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

  return payload + crc16(payload);
};

const CheckoutPage = ({ cart, finalTotal, discordNick, onOrderComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    termos: false
  });
  const [orderId, setOrderId] = useState(null);
  const [pixCode, setPixCode] = useState('');

  const receiverName = "Carlos Eduardo";
  const receiverCity = "Sao Paulo";
  const pixKey = "contaffxzx0@gmail.com";

  useEffect(() => {
    if (step === 2) {
      const code = generatePixPayload(pixKey, receiverName, receiverCity, finalTotal);
      setPixCode(code);
    }
  }, [step, finalTotal]);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!formData.termos) return alert('Você deve aceitar os termos de uso.');
    if (cart.length === 0) return alert('Seu carrinho está vazio.');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.from('pedidos').insert([
        {
          discord_nick: discordNick,
          produto_id: cart[0].id,
          status: 'pendente'
        }
      ]).select();

      if (error) throw error;

      if (data && data.length > 0) {
        setOrderId(data[0].id);
        setStep(2);
      }
    } catch (err) {
      alert(`Erro ao processar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-emerald-500 outline-none font-bold transition-all text-white";

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-16 px-4">
           {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/20'}`}>
                    {step > s ? <CheckCircle2 size={20} /> : s}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-white' : 'text-white/20'}`}>
                    {s === 1 ? 'Identificação' : 'Pagamento'}
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
                          <input required type="checkbox" className="w-5 h-5 rounded-lg bg-white/5 border-white/10 checked:bg-emerald-500 transition-all cursor-pointer" checked={formData.termos} onChange={e => setFormData({...formData, termos: e.target.checked})} />
                          <span className="text-[11px] text-white/40 font-medium leading-tight group-hover:text-white transition-colors">
                             Li e aceito os <Link to="/policies" className="text-emerald-400 underline">Termos de Uso</Link>.
                          </span>
                       </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 mt-10">
                       {loading ? 'Processando...' : 'GERAR PAGAMENTO'} <ArrowRight size={18} />
                    </button>
                 </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="glass-card p-12 text-center border-white/5">
                  <div className="mb-10">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Pagamento PIX</h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Escaneie o código ou copie o código abaixo</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] border-4 border-emerald-500/20">
                    <QRCodeSVG value={pixCode} size={200} level="H" includeMargin={false} />
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 text-left">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Beneficiário</span>
                          <span className="text-xs font-bold text-white">{receiverName}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Valor Total</span>
                          <span className="text-xl font-black text-emerald-400">R$ {finalTotal.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block text-left ml-4">Código PIX (Copia e Cola)</label>
                      <div className="relative group">
                        <input readOnly value={pixCode} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-[10px] text-white/40 font-mono outline-none group-hover:border-emerald-500/30 transition-all" />
                        <button onClick={copyToClipboard} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all shadow-lg">
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-8 space-y-4">
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
                        Após o pagamento, o produto será enviado automaticamente para o seu email e vinculado ao seu Nick do Discord.
                      </p>
                      <div className="flex gap-4">
                        <a href="https://discord.gg/xqCtsTh9" target="_blank" rel="noopener noreferrer" className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2">
                           SUPORTE <MessageCircle size={16} />
                        </a>
                        <Link to="/" onClick={onOrderComplete} className="flex-1 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center">
                           CONCLUIR
                        </Link>
                      </div>
                    </div>
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

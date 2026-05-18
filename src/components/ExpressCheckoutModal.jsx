import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, QrCode, CreditCard, MessageSquare, ArrowRight, Sparkles, CheckCircle2, Ticket, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';

const ExpressCheckoutModal = ({ isOpen, onClose, product }) => {
  const [step, setStep] = useState(1); // 1: Identify Nick, 2: PIX Payment, 3: Success
  const [robloxNick, setRobloxNick] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixCode, setPixCode] = useState('');
  
  // Coupon States
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const receiverName = "Carlos Eduardo";
  const receiverCity = "Sao Paulo";
  const pixKey = "contaffxzx0@gmail.com";

  const [countdown, setCountdown] = useState(12);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRobloxNick('');
      setAcceptTerms(false);
      setPixCode('');
      setCoupon('');
      setDiscount(0);
      setAppliedCoupon(null);
      setCountdown(12);
    }
  }, [isOpen]);

  // Gestao do temporizador e redirecionamento automatico no sucesso
  useEffect(() => {
    let interval;
    if (step === 3) {
      setCountdown(12);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            window.open("https://discord.gg/xqCtsTh9", "_blank");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, onClose]);

  const finalPrice = product ? product.valor * (1 - discount) : 0;

  // Generate PIX Payload (Static BRCode)
  useEffect(() => {
    if (step === 2 && product) {
      const code = generatePixPayload(pixKey, receiverName, receiverCity, finalPrice);
      setPixCode(code);
    }
  }, [step, product, finalPrice]);

  const generatePixPayload = (key, name, city, amount) => {
    const txid = "W" + Math.random().toString(36).substring(2, 12).toUpperCase();
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

  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const { data, error } = await supabase
        .from('cupons')
        .select('*')
        .eq('codigo', coupon.trim().toUpperCase())
        .eq('ativo', true)
        .single();

      if (error || !data) {
        alert('Cupom inválido ou expirado.');
        setDiscount(0);
        setAppliedCoupon(null);
      } else {
        setDiscount(parseFloat(data.desconto));
        setAppliedCoupon(data.codigo);
        alert(`Cupom ${data.codigo} aplicado! Desconto de ${(data.desconto * 100).toFixed(0)}%`);
      }
    } catch (err) {
      alert('Erro ao validar cupom.');
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!robloxNick.trim()) return alert('Por favor, insira o seu nick do Roblox.');
    if (!acceptTerms) return alert('Você deve aceitar os termos de uso.');
    setStep(2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Salvar pedido no Supabase Apenas quando clicar em "JÁ REALIZEI O PAGAMENTO" e definir status como 'pendente'
  const handleDone = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('pedidos').insert([
        {
          roblox_nick: robloxNick.trim(),
          produto_id: product.id,
          status: 'pendente', // Salvo como pendente para validacao manual do admin
          valor_pago: finalPrice
        }
      ]);

      if (error) throw error;

      setStep(3);
    } catch (err) {
      alert(`Erro ao salvar pedido: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* Backdrop tap to close (only if not on success step or loading) */}
      {step !== 3 && !loading && (
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-lg bg-[#0c0c0f] border-2 border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_120px_rgba(220,38,38,0.25)] z-10 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={26} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-500 border border-red-600/30">
                <CreditCard size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase font-heading text-white">Compra Rápida</h2>
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Identificação & Vínculo</p>
              </div>
            </div>

            {/* Selected Package Details */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 mb-8 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1">Pacote Selecionado</span>
                <span className="text-xl font-black text-white uppercase">{product.nome}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1">Preço Final</span>
                <span className="text-2xl font-black text-red-500 font-heading">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              {/* Nick Roblox */}
              <div className="space-y-3">
                <label className="text-xs font-black text-white/80 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MessageSquare size={14} className="text-red-500" /> Nick do Roblox (Sem senha)
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: JogadorRoblox"
                  value={robloxNick}
                  onChange={(e) => setRobloxNick(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-red-600 outline-none font-bold text-white transition-all placeholder:text-white/30"
                />
              </div>

              {/* Coupon Field */}
              <div className="space-y-3">
                <label className="text-xs font-black text-white/80 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Ticket size={14} className="text-red-500" /> Cupom de Desconto
                </label>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="Código" 
                     value={coupon} 
                     onChange={(e) => setCoupon(e.target.value)} 
                     className="flex-grow bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-red-600 outline-none font-bold text-white uppercase placeholder:text-white/30" 
                   />
                   <button 
                     type="button"
                     onClick={applyCoupon} 
                     className="px-6 rounded-2xl bg-white text-black font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-md"
                   >
                     Aplicar
                   </button>
                </div>
                {appliedCoupon && (
                  <span className="text-xs text-emerald-400 font-black uppercase tracking-wider block mt-1">
                    ✓ Cupom {appliedCoupon} Ativado (-{(discount * 100).toFixed(0)}%)
                  </span>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    required
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-5 h-5 rounded-lg bg-white/5 border-2 border-white/10 checked:bg-red-600 transition-all cursor-pointer accent-red-600 scale-110"
                  />
                  <span className="text-xs text-white/70 font-semibold leading-relaxed group-hover:text-white transition-colors">
                    Li e concordo com os Termos de Uso e Políticas de Reembolso.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!robloxNick.trim() || !acceptTerms}
                className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest text-sm hover:bg-red-500 transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3 mt-8 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                IR PARA O PAGAMENTO <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-lg bg-[#0c0c0f] border-2 border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_120px_rgba(220,38,38,0.25)] z-10 overflow-hidden"
          >
            <button disabled={loading} onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors disabled:opacity-20">
              <X size={26} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-500 border border-red-600/30">
                <QrCode size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase font-heading text-white">Pagamento PIX</h2>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mt-1">Escaneie ou copie o código</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-5 rounded-3xl inline-block mb-8 shadow-2xl border-4 border-red-600/20">
                <QRCodeSVG value={pixCode} size={180} level="H" includeMargin={false} />
              </div>

              <div className="w-full bg-white/[0.04] border-2 border-white/5 rounded-2xl p-6 text-left mb-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white/50 uppercase tracking-wider">Status do Pix</span>
                  <span className="font-black text-red-500 animate-pulse uppercase tracking-wider">Aguardando Pagamento</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                  <span className="font-bold text-white/50 uppercase tracking-wider">Valor Total</span>
                  <span className="font-black text-white text-lg font-heading">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                  <span className="font-bold text-white/50 uppercase tracking-wider">Vinculado a</span>
                  <span className="font-black text-red-500 uppercase tracking-wider">{robloxNick}</span>
                </div>
              </div>

              <div className="w-full space-y-3 mb-8">
                <label className="text-xs font-black text-white/80 uppercase tracking-widest block text-left ml-2">Código PIX (Copia e Cola)</label>
                <div className="relative">
                  <input
                    readOnly
                    value={pixCode}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-6 pr-16 text-xs text-white/70 font-mono outline-none font-bold"
                  />
                  <button
                    disabled={loading}
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                <button
                  disabled={loading}
                  onClick={handleDone}
                  className="w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all shadow-2xl cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Confirmando...' : 'JÁ REALIZEI O PAGAMENTO'}
                </button>
                <button
                  disabled={loading}
                  onClick={() => setStep(1)}
                  className="w-full py-4 rounded-3xl bg-white/5 border border-white/10 text-white/50 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  VOLTAR / ALTERAR NICK
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center p-12 bg-[#0c0c0f] border-2 border-red-600/30 rounded-[3.5rem] max-w-md w-full shadow-[0_0_150px_rgba(220,38,38,0.25)] z-10 animate-in zoom-in duration-300"
          >
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-600/20 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle2 size={44} />
              </motion.div>
            </div>

            <h2 className="text-3xl font-black tracking-tighter text-white mb-3 uppercase font-heading">Pedido Registrado!</h2>
            <p className="text-red-500 text-sm font-black mb-8 leading-relaxed uppercase tracking-wider">
              Agora, abra um ticket no Discord e envie o seu comprovante de pagamento!
            </p>

            <div className="bg-white/[0.04] border-2 border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 text-white text-xs font-black uppercase tracking-widest mb-3">
                <Sparkles size={14} className="text-red-500" /> Redirecionando...
              </div>
              <p className="text-[11px] text-white/70 uppercase font-black tracking-wider leading-relaxed mb-4">
                Abriremos o teu suporte em <span className="text-red-500">{countdown} segundos</span> para entrega imediata dos teus Robux!
              </p>
              
              {/* Barra de Progresso do Countdown */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-red-600 h-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 12, ease: "linear" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://discord.gg/xqCtsTh9"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                ABRIR DISCORD IMEDIATAMENTE <ArrowRight size={14} />
              </a>
              <div className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 pt-2">
                <Zap size={12} className="animate-pulse" /> Conectando ao suporte...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpressCheckoutModal;

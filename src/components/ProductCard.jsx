import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onBuyNow }) => {
  // Extrair o valor base para mostrar o "taxado" e o bônus
  const totalAmountStr = product.nome.split(' ')[0].replace('.', '');
  const totalAmount = parseInt(totalAmountStr);
  const baseAmount = Math.floor(totalAmount / 2).toLocaleString('pt-BR');
  const bonusAmount = baseAmount;
  
  // Preço falso para o efeito de desconto de 90%
  const fakeOriginalPrice = (product.valor * 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col md:flex-row items-center gap-6 bg-[#0c0c0f] border-2 border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-white/[0.02]"
    >
      {/* Icone Robux */}
      <div className="w-12 h-12 rounded-xl bg-white/5 border-2 border-white/15 flex items-center justify-center flex-shrink-0">
        <div className="w-6 h-6 border-2 border-white/30 rounded-lg flex items-center justify-center transform rotate-45">
          <div className="w-2 h-2 bg-white/60 rounded-sm" />
        </div>
      </div>

      {/* Quantidades */}
      <div className="flex-grow flex flex-col md:flex-row items-center gap-4 md:gap-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-white font-heading">{product.nome.split(' ')[0]}</span>
          <span className="text-lg font-bold text-white/40 line-through decoration-red-600/70">{baseAmount}</span>
        </div>
        
        <div className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-white/80">
          {bonusAmount} a mais
        </div>
      </div>

      {/* Preço e Botão */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-white/50 line-through uppercase tracking-wider">De: R$ {fakeOriginalPrice}</span>
        </div>
        
        <button 
          onClick={() => onBuyNow(product)}
          className="px-10 py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 min-w-[160px] cursor-pointer"
        >
          R$ {product.valor.toFixed(2).replace('.', ',')}
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);

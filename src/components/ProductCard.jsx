import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Zap } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-600/20"
    >
      {/* Imagem */}
      <div className="relative aspect-video overflow-hidden bg-black">
        {product.imagem_url ? (
          <img 
            src={product.imagem_url} 
            alt={product.nome} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-950/5">
            <Zap size={32} className="text-red-600/10" />
          </div>
        )}
        
        {/* Bonus Badge */}
        <div className="absolute top-4 right-4">
           <div className="px-3 py-1 rounded-lg bg-red-600 text-black text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              +100% BÔNUS
           </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
           <div className="flex items-center gap-0.5 text-red-600">
              {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
           </div>
           <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Entrega Imediata</span>
        </div>

        <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2 group-hover:text-red-500 transition-colors font-heading leading-tight">
          {product.nome}
        </h3>
        
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed mb-6">
          {product.descricao || 'Adquira agora com bônus acumulativo.'}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
           <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Preço</span>
              <div className="text-2xl font-black font-heading text-white">
                 <span className="text-xs text-red-600 mr-1">R$</span>
                 {product.valor.toFixed(2)}
              </div>
           </div>
           
           <button 
             onClick={() => navigate(`/produto/${product.id}`)}
             className="flex-grow py-4 rounded-xl bg-red-600 text-black font-black uppercase tracking-widest text-[10px] hover:bg-red-500 transition-all shadow-lg shadow-red-600/5 flex items-center justify-center gap-2"
           >
              COMPRAR <ShoppingCart size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

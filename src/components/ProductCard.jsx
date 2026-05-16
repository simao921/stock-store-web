import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Zap, ChevronRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative flex flex-col h-full bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_20px_50px_rgba(168,85,247,0.1)]"
    >
      {/* Imagem com Overlay Dinâmico */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {product.imagem_url ? (
          <img 
            src={product.imagem_url} 
            alt={product.nome} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-950/10">
            <Zap size={40} className="text-purple-500/20" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
        
        {/* Badges Flutuantes */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-purple-400">
              {product.categoria || 'Premium'}
           </div>
           {product.quantidade > 0 && (
             <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                Em Estoque
             </div>
           )}
        </div>
      </div>

      {/* Conteúdo Organizado */}
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
           <div className="flex items-center gap-1 text-amber-500/50 group-hover:text-amber-500 transition-colors">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
           </div>
           <span className="text-[10px] font-black text-white/10 uppercase tracking-widest group-hover:text-purple-500/50 transition-colors">Digital Product</span>
        </div>

        <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 group-hover:text-purple-500 transition-colors font-heading leading-tight">
          {product.nome}
        </h3>
        
        <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest leading-relaxed mb-10 line-clamp-2">
          {product.descricao || 'Otimização máxima para performance competitiva e resultados imediatos.'}
        </p>

        {/* Footer do Card com Preço e Ação */}
        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Preço Final</span>
              <div className="text-3xl font-black font-heading text-white">
                 <span className="text-sm text-purple-500 mr-1">R$</span>
                 {product.valor.toFixed(2)}
              </div>
           </div>
           
           <button 
             onClick={() => navigate(`/produto/${product.id}`)}
             className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-xl group-hover:shadow-purple-500/20"
           >
              <ChevronRight size={24} />
           </button>
        </div>
      </div>

      {/* Brilho Interno no Hover */}
      <div className="absolute inset-0 pointer-events-none border border-white/0 group-hover:border-purple-500/20 rounded-[2.5rem] transition-all duration-500" />
    </motion.div>
  );
};

export default ProductCard;

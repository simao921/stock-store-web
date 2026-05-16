import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, Star, CheckCircle2, TrendingUp } from 'lucide-react';

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from('estoque').select('*').eq('id', id).single();
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Zap className="animate-spin text-purple-500" /></div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-3 text-white/30 hover:text-white transition-colors mb-16 uppercase tracking-[0.3em] text-[10px] font-black">
          <ArrowLeft size={16} /> Voltar ao Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left: Product Media */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="aspect-video rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl shadow-purple-500/10">
                {product.imagem_url ? (
                  <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Zap size={80} className="text-purple-500/10" /></div>
                )}
             </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <div>
                <div className="flex items-center gap-4 mb-6">
                   <span className="px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400">
                      {product.categoria}
                   </span>
                   <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                   </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-heading text-white leading-tight mb-8">
                   {product.nome}
                </h1>
                <div className="text-5xl font-black font-heading text-white mb-10">
                   <span className="text-2xl text-purple-500 mr-2">R$</span>
                   {product.valor.toFixed(2)}
                </div>
             </div>

             <div className="glass-card p-10 border-white/5 bg-white/[0.01]">
                <p className="text-white/40 text-sm font-medium uppercase tracking-widest leading-loose">
                   {product.descricao || 'Este produto oferece a máxima eficiência tecnológica para dominar o seu ambiente de jogo. Testado e aprovado pelos melhores jogadores.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/5">
                   <div className="flex items-center gap-4 text-white/60">
                      <ShieldCheck className="text-purple-500" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Anti-Cheat Bypass</span>
                   </div>
                   <div className="flex items-center gap-4 text-white/60">
                      <Zap className="text-purple-500" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Entrega Imediata</span>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="flex-grow py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-4"
                >
                   <ShoppingCart size={20} /> ADICIONAR AO CARRINHO
                </button>
                <div className="px-8 py-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                   <TrendingUp className="text-red-500" size={20} />
                   <div>
                      <div className="text-white font-black text-sm">+200</div>
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Vendas</div>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-8 py-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-white/20">
                   <CheckCircle2 size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Suporte Vitalício</span>
                </div>
                <div className="flex items-center gap-3 text-white/20">
                   <CheckCircle2 size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Atualizações Grátis</span>
                </div>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;

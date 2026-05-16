import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const x = useTransform(mouseX, [-500, 500], [-15, 15]);
  const y = useTransform(mouseY, [-500, 500], [-15, 15]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-48 pb-20 overflow-hidden bg-black"
    >
      
      {/* PORTAL SYSTEM (DINÂMICO) */}
      <motion.div style={{ x, y }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[700px] h-[700px] flex items-center justify-center">
          <div className="absolute inset-0 border border-purple-500/[0.03] rounded-full" />
          <div className="absolute inset-[10%] border border-dashed border-purple-500/10 rounded-full animate-spin-slow" />
          <div className="absolute inset-[25%] border-2 border-dashed border-purple-600/5 rounded-full animate-spin-reverse" />
          <div className="absolute w-[600px] h-[600px] bg-purple-600/5 blur-[160px] rounded-full opacity-50" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Logo Redondo Interativo */}
          <motion.div 
            style={{ x: useTransform(x, v => v * 0.5), y: useTransform(y, v => v * 0.5) }}
            className="mb-16 relative"
          >
             <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-tr from-purple-600 to-purple-400 animate-spin-slow">
                <div className="absolute inset-0 rounded-full bg-black" />
             </div>
             
             <div className="absolute inset-1 rounded-full bg-black border border-white/10 flex items-center justify-center p-8 shadow-[0_0_120px_rgba(168,85,247,0.3)] group overflow-hidden">
                <img 
                  src="/assets/logo.png" 
                  alt="Wisey Logo" 
                  className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 rounded-full"
                />
                {/* Efeito de Reflexo no Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          </motion.div>

          <div className="space-y-4 mb-16">
             <motion.h1 
               style={{ x: useTransform(x, v => v * -0.2), y: useTransform(y, v => v * -0.2) }}
               className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.75] font-heading"
             >
               <span className="block text-white">WISEY</span>
               <span className="block text-purple-600 mt-4">STORE</span>
             </motion.h1>
          </div>

          <p className="text-white/30 text-base md:text-lg font-medium max-w-2xl mx-auto mb-20 uppercase tracking-[0.5em] leading-relaxed">
            A infraestrutura definitiva para <span className="text-white">Scripts e Métodos</span>.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <motion.a 
              href="#catalog" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-16 py-7 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-purple-500/20"
            >
               <span className="relative z-10 flex items-center gap-4">EXPLORAR HUB <ArrowRight size={18} /></span>
            </motion.a>
            
            <div className="flex items-center gap-10 px-10 border-l border-white/10 h-16">
               <div className="text-left">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Uptime</div>
                  <div className="text-sm font-black text-emerald-400">99.9%</div>
               </div>
               <div className="text-left">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-sm font-black text-purple-500">Verificado</div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Indicador de Scroll Dinâmico */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/10"
      >
         <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;

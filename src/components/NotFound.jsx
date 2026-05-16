import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary blur-[120px] rounded-full -z-10"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary blur-[120px] rounded-full -z-10"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
        className="relative mb-12"
      >
        <div className="text-[200px] font-black opacity-5 select-none font-heading leading-none">404</div>
        <img 
          src="/assets/logo.png" 
          alt="Wisey Monkey" 
          className="w-64 h-64 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_50px_rgba(139,92,246,0.5)]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-6 font-heading">OOPS! O WISEY SE PERDEU.</h1>
        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-md mx-auto font-medium">
          Parece que esta página foi para outra dimensão. Volte para a segurança da loja Wisey.
        </p>

        <button 
          onClick={onBack}
          className="btn-primary group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          VOLTAR PARA A LOJA
        </button>
      </motion.div>

      {/* Matrix-like falling text effect background can be added here */}
    </div>
  );
};

export default NotFound;

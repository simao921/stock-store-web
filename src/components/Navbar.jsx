import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';

const Navbar = ({ cartCount, onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const links = [
    { name: 'Produtos', path: '/' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Suporte', path: '/support' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'h-20 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'h-24 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto h-full w-full px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10"
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src="/assets/logo.png" alt="WISEY" className="w-full h-full object-cover relative rounded-full" />
            </motion.div>
            <span className="font-black text-xl tracking-tighter uppercase font-heading text-white">
              WISEY<span className="text-emerald-500">STORE</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                  style={{ color: active ? '#10b981' : 'rgba(255,255,255,0.4)' }}
                >
                  <span className="hover:text-white transition-colors">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="relative p-3 rounded-xl transition-all bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/40"
            >
              <ShoppingBag size={18} className="text-emerald-400" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              className="hidden sm:flex px-6 py-2.5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
            >
              Discord
            </motion.a>

            <button
              onClick={() => setMobileOpen(p => !p)}
              className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-0 right-0 z-50 lg:hidden p-6 bg-black/95 backdrop-blur-3xl border-b border-white/5"
          >
            <div className="flex flex-col gap-1">
              {links.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="py-4 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  style={{ 
                    background: location.pathname === link.path ? 'rgba(16,185,129,0.1)' : 'transparent',
                    color: location.pathname === link.path ? '#10b981' : 'rgba(255,255,255,0.4)' 
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

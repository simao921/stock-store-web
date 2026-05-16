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
    { name: 'Loja', path: '/' },
    { name: 'Métodos', path: '/methods' },
    { name: 'Comunidade', path: '/community' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Suporte', path: '/support' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'h-24 bg-[#05020a]/80 backdrop-blur-2xl border-b border-white/5' : 'h-28 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto h-full w-full px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative w-12 h-12"
            >
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src="/assets/logo.png" alt="WISEY" className="w-full h-full object-contain relative rounded-full" />
            </motion.div>
            <span className="font-black text-2xl tracking-tighter uppercase font-heading text-white">
              Wisey<span className="text-purple-500">.</span>
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
                  className="relative text-[11px] font-black uppercase tracking-[0.2em] transition-colors"
                  style={{ color: active ? 'white' : 'rgba(255,255,255,0.3)' }}
                >
                  <span className="hover:text-white transition-colors">{link.name}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-purple-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="relative p-3.5 rounded-2xl transition-all bg-white/5 border border-white/10 hover:border-purple-500/50"
            >
              <ShoppingBag size={20} className="text-white/80" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg shadow-purple-500/20"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            <motion.a
              href="https://discord.gg/xqCtsTh9"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              className="hidden sm:flex px-8 py-3.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-white/5"
            >
              Discord
            </motion.a>

            <button
              onClick={() => setMobileOpen(p => !p)}
              className="lg:hidden p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 right-0 z-50 lg:hidden p-8 bg-[#05020a]/95 backdrop-blur-3xl border-b border-white/5"
          >
            <div className="flex flex-col gap-2">
              {links.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="py-5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  style={{ 
                    background: location.pathname === link.path ? 'rgba(168,85,247,0.1)' : 'transparent',
                    color: location.pathname === link.path ? '#a855f7' : 'rgba(255,255,255,0.4)' 
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

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackgroundEffects from './components/BackgroundEffects';

import { RefreshCcw } from 'lucide-react';

// Lazy load pages for performance
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const FAQ = lazy(() => import('./components/FAQ'));
const Support = lazy(() => import('./components/Support'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const Policies = lazy(() => import('./components/Policies'));

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('wisey_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) { return []; }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [discordNick, setDiscordNick] = useState('');

  useEffect(() => {
    localStorage.setItem('wisey_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === '6' || e.code === 'Digit6')) {
        e.preventDefault();
        setIsAdminLoginOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('estoque').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // APLICAÇÃO DE CUPÃO REAL VIA SUPABASE
  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const { data, error } = await supabase
        .from('cupons')
        .select('*')
        .eq('codigo', coupon.toUpperCase())
        .eq('ativo', true)
        .single();

      if (error || !data) {
        alert('Cupão inválido ou expirado.');
        setDiscount(0);
        setAppliedCoupon(null);
      } else {
        setDiscount(parseFloat(data.desconto));
        setAppliedCoupon(data.codigo);
        alert(`Cupão ${data.codigo} aplicado! Desconto de ${(data.desconto * 100).toFixed(0)}%`);
      }
    } catch (err) {
      alert('Erro ao validar cupão.');
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.valor * (curr.quantity || 1)), 0);
  const finalTotal = cartTotal * (1 - discount);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen text-white selection:bg-red-600/30 overflow-x-hidden w-full bg-black relative">
        <BackgroundEffects />
        <Navbar 
          onDashboardToggle={() => setIsAdminLoginOpen(true)}
          showDashboard={showAdmin}
          cartCount={cart.reduce((a, b) => a + (b.quantity || 1), 0)}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <CartSidebar 
          isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
          cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart}
          coupon={coupon} setCoupon={setCoupon} applyCoupon={applyCoupon}
          discount={discount} appliedCoupon={appliedCoupon}
          total={cartTotal} finalTotal={finalTotal}
          discordNick={discordNick} setDiscordNick={setDiscordNick}
        />

        <AnimatePresence>
          {isAdminLoginOpen && (
            <AdminLogin onLogin={() => { setIsAdminLoginOpen(false); setShowAdmin(true); }} onClose={() => setIsAdminLoginOpen(false)} />
          )}
        </AnimatePresence>

        <main className="relative z-10 w-full min-h-screen">
          {showAdmin ? (
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCcw className="animate-spin text-red-600" /></div>}>
              <AdminPanel onLogout={() => setShowAdmin(false)} />
            </Suspense>
          ) : (
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCcw className="animate-spin text-red-600" /></div>}>
              <Routes>
                <Route path="/" element={
                  <div className="animate-in fade-in duration-700 w-full">
                    <Hero />
                    <section id="catalog" className="max-w-5xl mx-auto px-8 py-40">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-heading">
                          <span className="text-white">Pacotes com dobro de</span> <span className="text-red-600">Robux</span>
                        </h2>
                        <div className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                          100% A MAIS
                        </div>
                      </div>
                      {loading ? (
                        <div className="flex justify-center py-20 opacity-20"><RefreshCcw className="animate-spin text-red-600" /></div>
                      ) : (!products || products.length === 0) ? (
                        <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20 text-center">
                          <Package size={64} className="mb-4 text-red-600" />
                          <p className="font-heading font-black uppercase tracking-[0.3em] text-white">Catálogo em Atualização</p>
                          <p className="text-[10px] mt-2 text-white/50 uppercase tracking-widest">Estamos a preparar os melhores pacotes para ti.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                      )}
                    </section>
                  </div>
                } />
                <Route path="/checkout" element={<CheckoutPage cart={cart} finalTotal={finalTotal} discordNick={discordNick} onOrderComplete={() => setCart([])} />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/support" element={<Support />} />
                <Route path="/produto/:id" element={<ProductDetails onAddToCart={addToCart} />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          )}
        </main>

        {!showAdmin && <Footer />}
      </div>
    </Router>
  );
}

export default App;

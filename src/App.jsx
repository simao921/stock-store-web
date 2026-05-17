import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackgroundEffects from './components/BackgroundEffects';
import ExpressCheckoutModal from './components/ExpressCheckoutModal';

import { RefreshCcw, Package } from 'lucide-react';

// Lazy load pages for performance
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const FAQ = lazy(() => import('./components/FAQ'));
const Support = lazy(() => import('./components/Support'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const Policies = lazy(() => import('./components/Policies'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [expressProduct, setExpressProduct] = useState(null);

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

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen text-white selection:bg-red-600/30 overflow-x-hidden w-full bg-black relative">
        <BackgroundEffects />
        
        <Navbar />

        <ExpressCheckoutModal 
          isOpen={!!expressProduct} 
          onClose={() => setExpressProduct(null)} 
          product={expressProduct} 
        />

        <Suspense fallback={null}>
          {isAdminLoginOpen && (
            <AdminLogin onLogin={() => { setIsAdminLoginOpen(false); setShowAdmin(true); }} onClose={() => setIsAdminLoginOpen(false)} />
          )}
        </Suspense>

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
                          {products.map(p => (
                            <ProductCard 
                              key={p.id} 
                              product={p} 
                              onBuyNow={setExpressProduct} 
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                } />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/support" element={<Support />} />
                <Route path="/produto/:id" element={<ProductDetails onBuyNow={setExpressProduct} />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="*" element={<NotFound />} />
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingCart, Edit2, Trash2, X, Activity, LogOut, DollarSign, TrendingUp, Ticket, Plus, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const tabs = [
  { id: 'inventory', label: 'Estoque', icon: Package },
  { id: 'orders',    label: 'Vendas',  icon: ShoppingCart },
  { id: 'coupons',   label: 'Cupões',  icon: Ticket },
  { id: 'overview',  label: 'Métricas', icon: Activity },
];

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab]   = useState('inventory');
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [coupons, setCoupons]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    nome: '', descricao: '', valor: '', categoria: 'Robux', quantidade: 1, imagem_url: ''
  });

  const [newCoupon, setNewCoupon] = useState({
    codigo: '', desconto: '', ativo: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: prod }  = await supabase.from('estoque').select('*').order('created_at', { ascending: false });
      const { data: ord }   = await supabase.from('pedidos').select('*, estoque(nome,valor)').order('created_at', { ascending: false });
      const { data: cup }   = await supabase.from('cupons').select('*').order('created_at', { ascending: false });
      
      setProducts(prod || []);
      setOrders(ord || []);
      setCoupons(cup || []);
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Eliminar permanentemente?')) return;
    await supabase.from('estoque').delete().eq('id', id);
    fetchData();
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = { ...newProduct, valor: parseFloat(newProduct.valor), quantidade: parseInt(newProduct.quantidade) };
    if (editingProduct) await supabase.from('estoque').update(payload).eq('id', editingProduct.id);
    else await supabase.from('estoque').insert([payload]);
    setIsModalOpen(false);
    fetchData();
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Eliminar este cupão?')) return;
    await supabase.from('cupons').delete().eq('id', id);
    fetchData();
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    const payload = { ...newCoupon, desconto: parseFloat(newCoupon.desconto) };
    if (editingCoupon) await supabase.from('cupons').update(payload).eq('id', editingCoupon.id);
    else await supabase.from('cupons').insert([payload]);
    setIsCouponModalOpen(false);
    fetchData();
  };

  const updateOrderStatus = async (id, status) => {
    await supabase.from('pedidos').update({ status }).eq('id', id);
    fetchData();
  };

  const totalRevenue = (orders || []).filter(o => o.status === 'entregue' || o.status === 'pago').reduce((s, o) => s + (o.valor_pago || 0), 0);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600 mb-3 block">Admin Hub</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-heading text-white leading-tight">Wisey Admin</h1>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
            <button onClick={onLogout} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"><LogOut size={16}/> Logout</button>
            <button 
               type="button"
               onClick={async (e) => {
                 e.preventDefault();
                 console.log("Iniciando geração de pacotes...");
                 if (window.confirm("Deseja apagar os produtos antigos e criar os novos pacotes Vault-Blox?")) {
                    try {
                      // 1. Verificar Configuração
                      if (!supabase.supabaseUrl || supabase.supabaseUrl.includes("undefined")) {
                        alert("ERRO DE CONFIGURAÇÃO: As chaves do Supabase não foram encontradas. Verifica a Vercel!");
                        return;
                      }

                      // 2. Limpar Produtos Antigos
                      console.log("Limpando estoque...");
                      const { error: delErr } = await supabase.from('estoque').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                      if (delErr) {
                         alert(`ERRO AO LIMPAR: O Supabase diz: ${delErr.message}. (Dica: Criaste a tabela estoque no SQL Editor?)`);
                         throw delErr;
                      }

                      // 3. Criar Novos Pacotes
                      console.log("Inserindo novos pacotes...");
                      const pacotes = [
                        { nome: '45.000 ROBUX', descricao: '45.000 ROBUX (22.500 + 22.500 BÔNUS)', valor: 59.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
                        { nome: '20.000 ROBUX', descricao: '20.000 ROBUX (10.000 + 10.000 BÔNUS)', valor: 39.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
                        { nome: '9.000 ROBUX', descricao: '9.000 ROBUX (4.500 + 4.500 BÔNUS)', valor: 27.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
                        { nome: '6.300 ROBUX', descricao: '6.300 ROBUX (3.150 + 3.150 BÔNUS)', valor: 24.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
                        { nome: '3.400 ROBUX', descricao: '3.400 ROBUX (1.700 + 1.700 BÔNUS)', valor: 19.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' }
                      ];

                      const { error: insErr } = await supabase.from('estoque').insert(pacotes);
                      if (insErr) {
                         alert(`ERRO AO GERAR: O Supabase diz: ${insErr.message}`);
                         throw insErr;
                      }

                      // 4. Atualizar Visual
                      console.log("Sucesso! Atualizando lista...");
                      await fetchData();
                      alert("BOA! Pacotes Vault-Blox criados com sucesso! Já podes ver no site.");
                    } catch (err) {
                      console.error("Erro Fatal no Admin:", err);
                    }
                 }
               }} 
               className="px-6 py-5 rounded-2xl bg-red-600/10 text-red-500 font-black uppercase tracking-widest text-[11px] hover:bg-red-600 hover:text-black border border-red-600/20 transition-all flex items-center gap-2"
            >
               GERAR PACOTES VAULT
            </button>
            <button 
               onClick={() => { 
                 if(activeTab === 'coupons') { setEditingCoupon(null); setNewCoupon({codigo: '', desconto: '', ativo: true}); setIsCouponModalOpen(true); }
                 else { setEditingProduct(null); setNewProduct({nome: '', descricao: '', valor: '', categoria: 'Robux', quantidade: 1, imagem_url: ''}); setIsModalOpen(true); }
               }} 
               className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-red-600/5 flex items-center gap-3"
            >
               <Plus size={18} /> {activeTab === 'coupons' ? 'Criar Cupão' : 'Novo Produto'}
            </button>
          </motion.div>
        </div>

        <div className="flex gap-2 mb-16 p-1.5 bg-white/[0.02] border border-white/5 rounded-[2rem] w-fit">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              className={`relative px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === t.id ? 'text-black' : 'text-white/20 hover:text-white'}`}
            >
              <div className="flex items-center gap-3 relative z-10">
                 <t.icon size={16} />
                 {t.label}
              </div>
              {activeTab === t.id && (
                <motion.div layoutId="admin-tab" className="absolute inset-0 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && (
            <motion.div key="inv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {products.length === 0 ? (
                <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                  <Package size={64} className="mb-4" />
                  <p className="font-heading font-black uppercase tracking-[0.3em]">Estoque Vazio</p>
                  <p className="text-[10px] mt-2">Clica em "Gerar Pacotes Vault" para começar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {products.map(p => (
                    <div key={p.id} className="glass-card p-8 group border-white/5 hover:border-red-600/30 transition-all">
                       <div className="aspect-video rounded-3xl overflow-hidden mb-8 bg-black border border-white/5">
                          {p.imagem_url ? <img src={p.imagem_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Package size={48} /></div>}
                       </div>
                       <div className="flex justify-between items-start mb-8">
                          <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">{p.nome}</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">{p.categoria}</span>
                          </div>
                          <span className="text-2xl font-black font-heading text-white">R${p.valor.toFixed(2)}</span>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => { setEditingProduct(p); setNewProduct(p); setIsModalOpen(true); }} className="flex-grow py-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"><Edit2 size={14}/> Editar</button>
                          <button onClick={() => deleteProduct(p.id)} className="px-5 py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'coupons' && (
            <motion.div key="cup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {coupons.length === 0 ? (
                <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                  <Ticket size={64} className="mb-4" />
                  <p className="font-heading font-black uppercase tracking-[0.3em]">Sem Cupões</p>
                </div>
              ) : (
                <div className="glass-card overflow-hidden border-white/5">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                         <tr>
                            <th className="px-12 py-8">Código</th>
                            <th className="px-12 py-8">Desconto</th>
                            <th className="px-12 py-8">Status</th>
                            <th className="px-12 py-8 text-right">Ações</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {coupons.map(c => (
                            <tr key={c.id} className="text-xs hover:bg-white/[0.01] transition-all">
                               <td className="px-12 py-8 font-black uppercase text-red-500 tracking-widest">{c.codigo}</td>
                               <td className="px-12 py-8 font-black text-white text-lg">{(c.desconto * 100).toFixed(0)}%</td>
                               <td className="px-12 py-8">
                                  <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${c.ativo ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                     {c.ativo ? 'Ativo' : 'Inativo'}
                                  </span>
                               </td>
                               <td className="px-12 py-8 text-right space-x-6">
                                  <button onClick={() => { setEditingCoupon(c); setNewCoupon(c); setIsCouponModalOpen(true); }} className="text-white/20 hover:text-white transition-colors"><Edit2 size={16}/></button>
                                  <button onClick={() => deleteCoupon(c.id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="ord" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {orders.length === 0 ? (
                <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                  <ShoppingCart size={64} className="mb-4" />
                  <p className="font-heading font-black uppercase tracking-[0.3em]">Nenhuma Venda</p>
                </div>
              ) : (
                <div className="glass-card overflow-hidden border-white/5">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                         <tr><th className="px-12 py-8">Cliente</th><th className="px-12 py-8">Produto</th><th className="px-12 py-8">Valor</th><th className="px-12 py-8 text-center">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {orders.map(o => (
                            <tr key={o.id} className="text-xs hover:bg-white/[0.01] transition-all">
                               <td className="px-12 py-8 font-black uppercase text-white/60">{o.discord_nick}</td>
                               <td className="px-12 py-8 font-bold text-white/40 uppercase">{o.estoque?.nome || 'Removido'}</td>
                               <td className="px-12 py-8 text-white font-black text-base">R${(o.valor_pago || 0).toFixed(2)}</td>
                               <td className="px-12 py-8">
                                  <div className="flex justify-center">
                                     <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-[9px] font-black uppercase tracking-widest text-red-500 outline-none cursor-pointer hover:border-red-600/50 transition-all">
                                        <option value="pendente">Pendente</option>
                                        <option value="pago">Pago</option>
                                        <option value="entregue">Entregue</option>
                                     </select>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { label: 'Faturamento Bruto', val: `R$ ${totalRevenue.toFixed(2)}`, color: 'text-red-600', icon: DollarSign },
                 { label: 'Entregas Concluídas', val: orders.filter(o => o.status === 'entregue').length, color: 'text-red-500', icon: CheckCircle2 },
                 { label: 'Total de Pedidos', val: orders.length, color: 'text-white', icon: TrendingUp },
               ].map((s, i) => (
                 <div key={i} className="glass-card p-12 flex flex-col items-center text-center border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-white/20 group-hover:text-white group-hover:border-red-600/30 transition-all">
                       <s.icon size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">{s.label}</span>
                    <span className={`text-5xl font-black font-heading ${s.color} relative z-10`}>{s.val}</span>
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(isModalOpen || isCouponModalOpen) && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-[#0c0c0f] border border-white/10 rounded-[3rem] p-16 shadow-2xl shadow-red-600/10">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 font-heading text-white">
                   {isCouponModalOpen ? 'Gestão de Cupão' : 'Gestão de Produto'}
                </h2>
                
                {isCouponModalOpen ? (
                  <form onSubmit={handleSaveCoupon} className="space-y-8">
                    <input required className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold text-white transition-all" placeholder="CÓDIGO" value={newCoupon.codigo} onChange={e => setNewCoupon({...newCoupon, codigo: e.target.value.toUpperCase()})} />
                    <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold text-white transition-all" placeholder="DESCONTO (EX: 0.10)" value={newCoupon.desconto} onChange={e => setNewCoupon({...newCoupon, desconto: e.target.value})} />
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setIsCouponModalOpen(false)} className="flex-grow py-6 rounded-3xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[11px] text-white">Cancelar</button>
                       <button type="submit" className="flex-grow py-6 rounded-3xl bg-red-700 text-white font-black uppercase tracking-widest text-[11px] hover:bg-emerald-700 shadow-xl shadow-red-600/20">Salvar Cupão</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    <input required className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold text-white transition-all" placeholder="NOME DO PRODUTO" value={newProduct.nome} onChange={e => setNewProduct({...newProduct, nome: e.target.value})} />
                    <div className="grid grid-cols-2 gap-6">
                       <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold text-white transition-all" placeholder="PREÇO" value={newProduct.valor} onChange={e => setNewProduct({...newProduct, valor: e.target.value})} />
                       <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold text-white transition-all" placeholder="QTD" value={newProduct.quantidade} onChange={e => setNewProduct({...newProduct, quantidade: e.target.value})} />
                    </div>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold text-white transition-all" placeholder="URL DA IMAGEM" value={newProduct.imagem_url} onChange={e => setNewProduct({...newProduct, imagem_url: e.target.value})} />
                    <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-base outline-none focus:border-red-600 font-bold h-40 resize-none text-white transition-all" placeholder="DESCRIÇÃO DETALHADA" value={newProduct.descricao} onChange={e => setNewProduct({...newProduct, descricao: e.target.value})} />
                    <div className="flex gap-6">
                       <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-6 rounded-3xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[11px] text-white">Sair</button>
                       <button type="submit" className="flex-grow py-6 rounded-3xl bg-red-700 text-white font-black uppercase tracking-widest text-[11px] hover:bg-emerald-700 shadow-xl shadow-red-600/20">Gravar Alterações</button>
                    </div>
                  </form>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;

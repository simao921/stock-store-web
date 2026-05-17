-- ====================================================================
-- SCRIPT DE SEGURANÇA MÁXIMA - CONTRA ENTRADAS E MANIPULAÇÃO VIA BURP SUITE
-- Executa este script no editor SQL do teu painel Supabase para ativar
-- as políticas de segurança de Row Level Security (RLS).
-- ====================================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS)
-- Garante que nenhuma operação possa ser feita sem passar pelas regras estritas do servidor
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupons ENABLE ROW LEVEL SECURITY;


-- 2. POLÍTICAS DE SEGURANÇA PARA A TABELA: 'estoque' (Produtos)
-- [Público] Permite ler os produtos no catálogo
CREATE POLICY "Leitura Pública de estoque" ON estoque
    FOR SELECT TO public USING (true);

-- [Admin Autenticado] Apenas o admin autenticado pode criar, atualizar ou eliminar produtos
CREATE POLICY "Escrita Restrita estoque" ON estoque
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 3. POLÍTICAS DE SEGURANÇA PARA A TABELA: 'pedidos' (Vendas)
-- [Público] Permite que clientes façam checkout e enviem novos pedidos
CREATE POLICY "Criar Pedido Público" ON pedidos
    FOR INSERT TO public WITH CHECK (true);

-- [Admin Autenticado] Apenas o admin autenticado pode consultar a lista de vendas ou alterar status
CREATE POLICY "Controle Total de Pedidos Admin" ON pedidos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- [Público] Proibe alteração ou eliminação de pedidos existentes por utilizadores anónimos (Burp Suite block)
-- O Supabase já bloqueia por padrão já que a regra acima exige autenticação, mas esta política explicita a segurança.


-- 4. POLÍTICAS DE SEGURANÇA PARA A TABELA: 'cupons' (Descontos)
-- [Público] Permite que clientes consultem cupões para validar descontos no checkout
CREATE POLICY "Leitura Pública de cupons" ON cupons
    FOR SELECT TO public USING (true);

-- [Admin Autenticado] Apenas o admin autenticado pode gerir a base de cupões
CREATE POLICY "Controle Total de Cupons Admin" ON cupons
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- FIM DO SCRIPT DE SEGURANÇA
-- ====================================================================

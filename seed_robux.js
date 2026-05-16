import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zjxpjeqatuwccoedsufl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeHBqZXFhdHV3Y2NvZWRzdWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzE2MzUsImV4cCI6MjA5MzMwNzYzNX0.ojtC84wKdZLQrZTFZdMZihuPuMLcgEoPSWD7qRpI3mU'
const supabase = createClient(supabaseUrl, supabaseKey)

const robuxPackages = [
  {
    nome: '400 Robux (+400 Bônus)',
    descricao: 'Pacote inicial com 100% de bônus acumulativo. Total de 800 Robux creditados na sua conta.',
    valor: 19.90,
    categoria: 'Robux',
    quantidade: 999,
    imagem_url: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08238?auto=format&fit=crop&q=80&w=800'
  },
  {
    nome: '800 Robux (+800 Bônus)',
    descricao: 'Pacote médio para quem busca custo-benefício. Total de 1600 Robux creditados.',
    valor: 39.90,
    categoria: 'Robux',
    quantidade: 999,
    imagem_url: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08238?auto=format&fit=crop&q=80&w=800'
  },
  {
    nome: '1700 Robux (+1700 Bônus)',
    descricao: 'O pacote mais vendido! Ideal para grandes compras. Total de 3400 Robux creditados.',
    valor: 79.90,
    categoria: 'Robux',
    quantidade: 999,
    imagem_url: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08238?auto=format&fit=crop&q=80&w=800'
  },
  {
    nome: '4500 Robux (+4500 Bônus)',
    descricao: 'Pacote VIP para jogadores hardcore. Total de 9000 Robux creditados na sua conta.',
    valor: 199.90,
    categoria: 'Robux',
    quantidade: 999,
    imagem_url: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08238?auto=format&fit=crop&q=80&w=800'
  },
  {
    nome: '10000 Robux (+10000 Bônus)',
    descricao: 'Pacote Supremo! O melhor valor por Robux do mercado. Total de 20000 Robux creditados.',
    valor: 399.90,
    categoria: 'Robux',
    quantidade: 999,
    imagem_url: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08238?auto=format&fit=crop&q=80&w=800'
  }
];

async function seedProducts() {
  console.log('Iniciando inserção de pacotes Robux...');
  
  // Primeiro, limpamos o estoque antigo (opcional, mas recomendado para o novo estilo)
  const { error: deleteError } = await supabase.from('estoque').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
    console.error('Erro ao limpar estoque antigo:', deleteError);
    return;
  }

  const { data, error } = await supabase.from('estoque').insert(robuxPackages);

  if (error) {
    console.error('Erro ao inserir produtos:', error);
  } else {
    console.log('Pacotes Robux inseridos com sucesso!');
  }
}

seedProducts();

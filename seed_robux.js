import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://idhrilllxmujnrovcvkb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaHJpbGxseG11am5yb3ZjdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDM0OTEsImV4cCI6MjA5NDUxOTQ5MX0.yx1MjgxL0kS2pXW9d5-OI8MpswNumTT-eXI_pubPrj0'
const supabase = createClient(supabaseUrl, supabaseKey)

const robuxPackages = [
  { nome: '45.000 ROBUX', descricao: '45.000 ROBUX (22.500 + 22.500 BÔNUS)', valor: 59.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
  { nome: '20.000 ROBUX', descricao: '20.000 ROBUX (10.000 + 10.000 BÔNUS)', valor: 39.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
  { nome: '9.000 ROBUX', descricao: '9.000 ROBUX (4.500 + 4.500 BÔNUS)', valor: 27.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
  { nome: '6.300 ROBUX', descricao: '6.300 ROBUX (3.150 + 3.150 BÔNUS)', valor: 24.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' },
  { nome: '3.400 ROBUX', descricao: '3.400 ROBUX (1.700 + 1.700 BÔNUS)', valor: 19.90, categoria: 'ROBUX', quantidade: 999, imagem_url: 'https://i.imgur.com/8QO9f9H.png' }
];

async function seedProducts() {
  console.log('Iniciando inserção de pacotes Robux...');
  
  try {
    // Primeiro, limpamos o estoque antigo
    const { error: deleteError } = await supabase.from('estoque').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Erro ao limpar estoque antigo:', deleteError);
      return;
    }

    const { data, error } = await supabase.from('estoque').insert(robuxPackages);

    if (error) {
      console.error('Erro ao inserir produtos:', error);
    } else {
      console.log('Pacotes Robux inseridos com sucesso na nova base de dados!');
    }
  } catch (e) {
    console.error('Erro catastrófico:', e);
  }
}

seedProducts();

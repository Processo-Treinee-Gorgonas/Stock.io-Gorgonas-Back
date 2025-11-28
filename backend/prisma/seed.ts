// Importa Prisma Client e o Enum direto do pacote padrão
import { PrismaClient, CategoriasNome } from '@prisma/client';

// 2. Inicializa o Prisma
const prisma = new PrismaClient();

// 3. Define os dados que queremos criar
// (Esta é a lista que você me deu, agora em formato de dados)
const seedData = [
  { nome: CategoriasNome.MERCADO, subcategorias: ['Hortifruti', 'Açougue e Peixaria', 'Padaria', 'Bebidas'] },
  { nome: CategoriasNome.FARMACIA, subcategorias: ['Medicamentos', 'Vitaminas', 'Higiene Pessoal', 'Primeiros Socorros'] },
  { nome: CategoriasNome.BELEZA, subcategorias: ['Maquiagem', 'Skincare', 'Cabelo', 'Perfumes'] },
  { nome: CategoriasNome.MODA, subcategorias: ['Feminino', 'Masculino', 'Calçados', 'Acessórios'] },
  { nome: CategoriasNome.ELETRONICOS, subcategorias: ['Celulares', 'Computadores', 'TVs e Vídeo', 'Áudio'] },
  { nome: CategoriasNome.JOGOS, subcategorias: ['Jogos de Console', 'Jogos de PC', 'Consoles', 'Acessórios Gamer'] },
  { nome: CategoriasNome.BRINQUEDOS, subcategorias: ['Bonecas', 'Jogos de Tabuleiro', 'Blocos de Montar', 'Carrinhos'] },
  { nome: CategoriasNome.CASA, subcategorias: ['Cama, Mesa e Banho', 'Eletrodomésticos', 'Decoração', 'Cozinha'] },
];

async function main() {
  console.log(`Iniciando o seeding...`);

  // 4. Itera sobre cada categoria na nossa lista
  for (const cat of seedData) {
    
    // 5. Usa 'upsert' (atualizar ou inserir)
    // Isso é inteligente: se a categoria 'MERCADO' já existir, ele não faz nada.
    // Se não existir, ele a cria.
    await prisma.categoria.upsert({
      where: { nome: cat.nome }, // Como encontrar a categoria
      update: {}, // O que fazer se encontrar (nada)
      create: {
        // O que fazer se NÃO encontrar (criar)
        nome: cat.nome,
        // 6. A MÁGICA:
        // Cria as subcategorias filhas AO MESMO TEMPO
        subcategorias: {
          create: cat.subcategorias.map(subNome => ({ nome: subNome })),
        },
      },
    });
  }
  console.log(`Seeding finalizado.`);
}

// 7. Executa a função 'main' e lida com erros
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 8. Fecha a conexão com o banco
    await prisma.$disconnect();
  });
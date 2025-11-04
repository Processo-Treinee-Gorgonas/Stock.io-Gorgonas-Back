import { IsString } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;
  descricao: string;
  preco: number; // Prisma Decimal aceita string; número também funciona
  estoque: number;
  lojaId: number;
  subcategoriaId: number;
  imagens?: string[]; // URLs (caso use relação ImagemProduto { url: string })
}

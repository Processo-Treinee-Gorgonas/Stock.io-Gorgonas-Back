export class UpdateProdutoDto {
  nome?: string;
  descricao?: string;
  preco?: string | number;
  estoque?: number;
  subcategoriaId?: number;

  imagens?: string[];
}

import { IsNumber, IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProdutoDto {

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  preco: number;

  @IsNumber()
  @IsNotEmpty()
  estoque: number;

  @IsNumber()
  @IsNotEmpty()
  lojaId: number;

  @IsNumber()
  @IsNotEmpty()
  subcategoriaId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagens?: string[];
}

import { IsString, IsNotEmpty, IsOptional, IsUrl, MaxLength, IsInt } from 'class-validator';

// DTO (Data Transfer Object) para validação dos dados ao criar uma nova loja.
export class CreateLojaDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(255) // Limita o tamanho máximo do nome
  nome: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' }) // Obrigatório conforme schema Prisma
  descricao: string;

  @IsInt({ message: 'O ID da categoria deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O ID da categoria é obrigatório' })
  categoriaId: number; // ID da categoria à qual a loja pertence

  @IsString()
  @IsUrl({}, { message: 'A URL do logo deve ser uma URL válida' })
  @IsOptional() // Campo opcional
  @MaxLength(255)
  logo?: string; // Nome do campo no schema Prisma

  @IsString()
  @IsUrl({}, { message: 'A URL do banner deve ser uma URL válida' })
  @IsOptional()
  @MaxLength(255)
  banner?: string; // Nome do campo no schema Prisma

  @IsString()
  @IsUrl({}, { message: 'A URL do sticker deve ser uma URL válida' })
  @IsOptional()
  @MaxLength(255)
  sticker?: string; // Nome do campo no schema Prisma

  // O ID do usuário (dono da loja) não é incluído aqui,
  // pois será obtido a partir do token do usuário autenticado no controller/service.
}
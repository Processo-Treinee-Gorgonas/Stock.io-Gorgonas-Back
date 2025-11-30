import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoLojaDto {
  @IsNotEmpty()
  @IsString()
  conteudo: string;

  // Aceitaremos número, mas o schema é Int; o service arredonda 0.5
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  nota: number;
}

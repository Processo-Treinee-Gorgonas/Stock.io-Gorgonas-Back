import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateAvaliacaoLojaDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  conteudo?: string;
}

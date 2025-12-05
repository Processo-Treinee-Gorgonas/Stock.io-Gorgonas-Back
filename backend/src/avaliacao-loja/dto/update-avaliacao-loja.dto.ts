import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAvaliacaoLojaDto {
  @IsOptional()
  @Type(() => Number)
  @Min(0.5)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  conteudo?: string;
}
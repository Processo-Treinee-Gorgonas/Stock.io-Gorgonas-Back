import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAvaliacaoProdutoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  nota!: number;

  @Type(() => Number)
  @IsInt()
  produtoId!: number;
}

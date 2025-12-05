import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioAvaliacaoLojaDto {
  @IsNotEmpty()
  @IsString()
  conteudo: string;
}
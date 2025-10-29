import { PartialType } from '@nestjs/mapped-types';
import { CreateLojaDto } from './create-loja.dto';

// DTO para validação dos dados ao atualizar uma loja.
// Usa PartialType para tornar todos os campos herdados de CreateLojaDto opcionais.
export class UpdateLojaDto extends PartialType(CreateLojaDto) {}
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: Date | null;
  senhaHash?: string;
}

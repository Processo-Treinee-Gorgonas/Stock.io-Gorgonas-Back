// src/auth/guards/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// O 'export' é crucial para que o 'UsuarioController' possa importá-lo
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Esta classe não precisa de lógica extra.
  // Ela automaticamente usa a 'JwtStrategy' que já criamos
  // para verificar o token 'Bearer' no cabeçalho.
}
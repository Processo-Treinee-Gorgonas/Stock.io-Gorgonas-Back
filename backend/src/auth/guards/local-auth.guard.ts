// src/auth/guards/local-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  
  /**
   * Esta função sobrescreve a função 'logIn' padrão do AuthGuard.
   * A função padrão é a que (incorretamente) cria a sessão "zumbi"
   * na memória do backend.
   *
   * Ao deixar esta função VAZIA, nós impedimos que a sessão
   * seja criada. O NestJS/Passport vai apenas prosseguir
   * para o controller (para o 'authService.login') e gerar o JWT,
   * que é o comportamento 100% stateless que queremos.
   */
  async logIn(request: any): Promise<void> {
    // Intencionalmente vazio.
  }
}
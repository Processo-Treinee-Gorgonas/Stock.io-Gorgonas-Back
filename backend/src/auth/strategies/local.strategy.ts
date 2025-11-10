// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    // Injeta o AuthService (o "cérebro" que tem a lógica do bcrypt)
    private authService: AuthService,
  ) {
    // Configura o "passport-local"
    super({
      // 1. Informa ao Passport que o "username" é o campo 'email'
      usernameField: 'email',
      // 2. Informa que a "password" é o campo 'senha'
      passwordField: 'senha',
    });
  }

  /**
   * Esta função é chamada automaticamente pelo AuthGuard('local')
   * (que vamos colocar na rota de login).
   */
  async validate(email: string, senha: string): Promise<any> {
    
    // 3. Delega a lógica de validação para o AuthService
    const usuario = await this.authService.validateUser(email, senha);

    // 4. Se o AuthService retornar nulo (senha errada ou email não existe)
    if (!usuario) {
      // Lança o erro 401 que o seu frontend vai receber
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    
    // 5. Se deu certo, retorna o usuário (sem a senha)
    return usuario;
  }
}
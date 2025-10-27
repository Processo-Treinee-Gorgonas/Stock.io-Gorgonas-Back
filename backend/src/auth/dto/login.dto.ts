// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginDto extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Por padrão, o passport-local usa 'username'.
    // Dizemos a ele para usar 'email' no lugar.
    super({ usernameField: 'email' });
  }

  /**
   * O NestJS chama esta função automaticamente quando você usa o
   * @UseGuards(AuthGuard('local')) na rota de login.
   */
  async validate(email: string, senha: string): Promise<any> {
    
    // 1. Ele chama o AuthService para validar o usuário
    const usuario = await this.authService.validateUser(email, senha);
    
    // 2. Se o serviço retornar nulo, a senha/email estava errada
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 3. Se deu certo, ele retorna o usuário
    // O NestJS vai anexar isso ao objeto 'req.user'
    return usuario;
  }
}
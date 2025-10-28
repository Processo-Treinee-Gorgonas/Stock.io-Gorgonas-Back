// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginDto extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, senha: string): Promise<any> {
    
    //chama o AuthService para validar o usuário
    const usuario = await this.authService.validateUser(email, senha);
    
    //Se o serviço retornar nulo, a senha/email estava errada
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    return usuario;
  }
}
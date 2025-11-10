// src/auth/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  
  // --- ESTE É O CONSTRUTOR CORRIGIDO ---
  constructor(private configService: ConfigService) {
    
    // 1. Buscamos a chave primeiro
    const secret = configService.get<string>('JWT_SECRET');

    // 2. ADICIONAMOS A "GUARDA"
    // Se o .env não tiver o segredo, lance um erro claro
    if (!secret) {
      throw new Error('Segredo JWT (JWT_SECRET) não está definido no .env!');
    }

    // 3. Agora que o TypeScript SABE que 'secret' é uma 'string' (e não 'undefined'),
    //    nós podemos (com segurança) chamar o super()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // <-- Agora é 100% 'string'
    });
  }
  // ------------------------------------

  /**
   * Esta função é chamada pelo Passport DEPOIS que ele
   * verifica (com sucesso) a assinatura do JWT.
   */
  async validate(payload: any) {
    // O que esta função retorna é o que será anexado ao 'req.user'
    return { userId: payload.sub, email: payload.email, nome: payload.nome };
  }
}
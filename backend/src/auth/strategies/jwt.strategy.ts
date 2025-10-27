// src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Importar

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, // Injetar o ConfigService
  ) {
    // --- INÍCIO DA CORREÇÃO ---

    // 1. Pegue o segredo ANTES de chamar o super()
    const secret = configService.get<string>('JWT_SECRET');

    // 2. Crie uma "cláusula de guarda" (guard clause)
    // Se o segredo não foi encontrado no .env, quebre a aplicação.
    if (!secret) {
      throw new Error('Segredo JWT (JWT_SECRET) não está definido no arquivo .env');
    }

    // 3. Agora o TypeScript sabe que 'secret' é uma string
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // <-- Passe a variável 'secret' aqui
    });

    // --- FIM DA CORREÇÃO ---
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, nome: payload.nome };
  }
}
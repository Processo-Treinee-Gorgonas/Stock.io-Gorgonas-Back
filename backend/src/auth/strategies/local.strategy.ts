import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto'; // Importa o DTO de login

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    // 1. Injeta o AuthService (o "cérebro")
    private authService: AuthService,
  ) {
    // 2. Configura o "passport-local"
    super({
      // Informa ao Passport qual campo do DTO (body)
      // corresponde ao "username". No seu caso, é 'email'.
      usernameField: 'email',

      // Informa ao Passport qual campo do DTO (body)
      // corresponde à "password". No seu caso, é 'senha'.
      passwordField: 'senha',
    });
  }

  /**
   * 3. O NestJS chama este método AUTOMATICAMENTE
   * quando a rota @UseGuards(AuthGuard('local')) é atingida.
   *
   * @param email - O valor do campo 'email' do body (definido em 'usernameField')
   * @param senha - O valor do campo 'senha' do body (definido em 'passwordField')
   */
  async validate(email: string, senha: string): Promise<any> {
    
    // 4. Delega a lógica de validação para o AuthService
    // (que vai buscar no banco e comparar o hash do bcrypt)
    const usuario = await this.authService.validateUser(email, senha);

    // 5. Se o AuthService retornar nulo, significa que a senha
    //    ou o e-mail estavam errados.
    if (!usuario) {
      // Lança uma exceção HTTP 401
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 6. SUCESSO!
    // O que for retornado aqui será anexado ao
    // objeto 'req.user' na sua rota de login.
    return usuario;
  }
}
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto'; // Importa o DTO de login

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    //Injeta o AuthService (o "cérebro")
    private authService: AuthService,
  ) {
    //Configura o "passport-local"
    super({
      // Informa ao Passport qual campo do DTO (body)
      usernameField: 'email',

      // Informa ao Passport qual campo do DTO (body)
      passwordField: 'senha',
    });
  }
  /**
   * quando a rota @UseGuards(AuthGuard('local')) é atingida.
   *
   * @param email - O valor do campo 'email' do body
   * @param senha - O valor do campo 'senha' do body
   */
  async validate(email: string, senha: string): Promise<any> {
    
    // Delega a lógica de validação para o AuthService
    // (que vai buscar no banco e comparar o hash do bcrypt)
    const usuario = await this.authService.validateUser(email, senha);

    //Se o AuthService retornar nulo, significa que a senha
    //    ou o e-mail estavam errados.
    if (!usuario) {
      // Lança uma exceção HTTP 401
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    return usuario;
  }
}
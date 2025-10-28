// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service'; // <-- IMPORTA O SERVIÇO DO SEU GRUPO
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService, 
    // Injeta o serviço de JWT
    private jwtService: JwtService,
  ) {}

  /**
  valida se a senha do usuário está correta.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    let usuario;
    try {
      // Tenta buscar o usuário pelo e-mail
      usuario = await this.usuarioService.findOneByEmail(email); 
    } catch (error) {
      // Se 'findOneByEmail' lançar NotFoundException, as credenciais são inválidas
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    //Compara a senha enviada com o hash salvo no banco
    if (usuario && (await bcrypt.compare(pass, usuario.senhaHash))) {
      const { senhaHash, ...result } = usuario; // Remove o hash da resposta
      return result; // Retorna o objeto do usuário (sem o hash)
    }

    // 3. Se a senha não bater, retorna nulo (a LocalStrategy vai tratar)
    return null;
  }

  /**
   * Este método é chamado pelo AuthController DEPOIS que o
   * usuário foi validado pela LocalStrategy.
   */
  async login(usuario: any) {
    // O 'usuario' aqui já está validado
    const payload = { 
      email: usuario.email, 
      sub: usuario.id, 
      nome: usuario.nome,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
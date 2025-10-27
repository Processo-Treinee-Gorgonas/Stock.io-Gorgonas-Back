// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service'; // <-- IMPORTA O SERVIÇO DO SEU GRUPO
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // Injeta o serviço do seu grupo
    private usuarioService: UsuarioService, 
    
    // Injeta o serviço de JWT
    private jwtService: JwtService,
  ) {}

  /**
   * Este método é chamado pela LocalStrategy (que acabamos de criar).
   * Ele valida se a senha do usuário está correta.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    let usuario;
    try {
      // 1. Tenta buscar o usuário pelo e-mail
      // (Precisa que 'findOneByEmail' exista no seu UsuarioService)
      usuario = await this.usuarioService.findOneByEmail(email); 
    } catch (error) {
      // Se 'findOneByEmail' lançar NotFoundException, as credenciais são inválidas
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 2. Compara a senha enviada com o hash salvo no banco
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
    // O 'usuario' que recebemos aqui já está validado
    const payload = { 
      email: usuario.email, 
      sub: usuario.id, // 'sub' (subject) é o padrão do JWT para o ID
      nome: usuario.nome,
    };
    
    // 4. Cria o token JWT e o retorna
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
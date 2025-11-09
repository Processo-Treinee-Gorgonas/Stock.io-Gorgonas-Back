// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // Injeta o serviço que fala com a tabela 'Usuario'
    private usuarioService: UsuarioService, 
    // Injeta o serviço que "assina" e cria o JWT
    private jwtService: JwtService,
  ) {}

  /**
   * Esta é a função que o 'LocalStrategy' chama.
   * Ela é o "cérebro" da validação.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    let usuario;
    try {
      // 1. Busca o usuário no banco (com a senhaHash!)
      //    (O 'findOneByEmail' é uma função que você já tem no seu UsuarioService)
      usuario = await this.usuarioService.findOneByEmail(email); 
    } catch (error) {
      // Se 'findOneByEmail' falhar (ex: NotFound), as credenciais são inválidas
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 2. Compara a senha enviada (pass) com o hash salvo no banco (usuario.senhaHash)
    if (usuario && (await bcrypt.compare(pass, usuario.senhaHash))) {
      const { senhaHash, ...result } = usuario; // 3. Remove o hash da resposta
      return result; // 4. Retorna o objeto do usuário (sem o hash)
    }

    // 5. Se a senha não bater, retorna nulo (a LocalStrategy vai tratar)
    return null;
  }

  /**
   * Esta função é chamada pelo 'AuthController' DEPOIS que o
   * usuário foi validado com sucesso.
   * Ela cria o Token JWT.
   */
  async login(usuario: any) {
    // O 'usuario' que recebemos aqui é o 'result' da função 'validateUser'
    const payload = { 
      email: usuario.email, 
      sub: usuario.id, // 'sub' (subject) é o nome padrão para o ID do usuário no JWT
      nome: usuario.nome,
    };
    
    // "Assina" o payload com o seu JWT_SECRET e retorna o token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
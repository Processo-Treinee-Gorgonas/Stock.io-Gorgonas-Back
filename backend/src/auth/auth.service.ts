// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validação usada pela LocalStrategy
   */
  async validateUser(email: string, pass: string): Promise<any> {
    let usuario;
    try {
      usuario = await this.usuarioService.findOneByEmail(email);
    } catch (error) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    if (usuario && (await bcrypt.compare(pass, usuario.senhaHash))) {
      const { senhaHash, ...result } = usuario;
      return result;
    }

    return null;
  }

  /**
   * Gera token JWT para login
   */
  async login(usuario: any) {
    const payload = {
      email: usuario.email,
      sub: usuario.id,
      nome: usuario.nome,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ---------------------------------------------------------
  // 🔵 FUNÇÃO 1 — Início da recuperação de senha
  // Front chama POST /auth/forgot-password
  // ---------------------------------------------------------
  async forgotPassword(email: string) {
    const usuario = await this.usuarioService.findOneByEmail(email).catch(() => null);

    // Mesmo que o email não exista, respondemos igual
    if (!usuario) {
      return { message: 'Se este email existir, enviaremos instruções.' };
    }

    // Token JWT válido por 15 minutos
    const token = this.jwtService.sign(
      { sub: usuario.id, email: usuario.email },
      { expiresIn: '15m' },
    );

    console.log('🔐 Token de redefinição gerado:', token);

    // Não estamos enviando e-mail ainda, apenas devolvendo token para teste
    return {
      message: 'Token gerado com sucesso.',
      token,
    };
  }

  // ---------------------------------------------------------
  // 🔵 FUNÇÃO 2 — Finalização da redefinição
  // Front chama POST /auth/reset-password
  // ---------------------------------------------------------
  async resetPassword(token: string, novaSenha: string) {
    let payload;

    // Valida token
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    // Busca usuário
    const usuario = await this.usuarioService.findOne(payload.sub);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Gera novo hash
    const salt = await bcrypt.genSalt();
    const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

    // Atualiza senha usando função criada
    await this.usuarioService.updateSenhaDireta(usuario.id, novaSenhaHash);

    return { message: 'Senha redefinida com sucesso!' };
  }
}

// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // LOGIN

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


  // 1. ENVIAR E-MAIL DE RECUPERAÇÃO

  async forgotPassword(email: string): Promise<void> {
    const usuario = await this.usuarioService.findOneByEmail(email);

    if (!usuario) {
      throw new NotFoundException('E-mail não encontrado.');
    }

    // Gera token seguro
    const token = randomBytes(32).toString('hex');

    // Expira em 1 hora
    const expires = addHours(new Date(), 1);

    // Salva no banco (nomes EXATAMENTE iguais ao Prisma)
    await this.usuarioService.update(usuario.id, {
      resetPasswordToken: token,
      resetPasswordExpiration: expires,
    });

    const resetLink = `http://localhost:3000/redefinir-senha?token=${token}`;

    // ENVIA O EMAIL REAL
    await this.emailService.sendMail({
      to: usuario.email,
      subject: 'Recuperação de senha - Stock.io',
      html: `
        <p>Olá, ${usuario.nome}!</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${resetLink}">Redefinir Senha</a></p>
        <p>O link expira em 1 hora.</p>
      `,
    });
  }

  // 2. REDEFINIR SENHA VIA TOKEN

  async resetPassword(token: string, novaSenha: string): Promise<void> {
    const usuario = await this.usuarioService.findByResetToken(token);

    if (!usuario) {
      throw new BadRequestException('Token inválido.');
    }

    if (!usuario.resetPasswordExpiration || usuario.resetPasswordExpiration < new Date()) {
      throw new BadRequestException('Token expirado.');
    }

    const newHash = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha e apaga o token
    await this.usuarioService.update(usuario.id, {
      senhaHash: newHash,
      resetPasswordToken: null,
      resetPasswordExpiration: null,
    });
  }
}

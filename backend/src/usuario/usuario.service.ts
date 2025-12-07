import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../database/prisma.service';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateSenhaDto } from './dto/update-senha.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUsuarioDto) {
    if (data.senha !== data.confirmarSenha) {
      throw new BadRequestException('A senha e a confirmação de senha não coincidem.');
    }

    const usuarioExiste = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ email: data.email }, { userName: data.userName }],
      },
    });

    if (usuarioExiste) {
      throw new ConflictException('Usuário com este email ou nome de usuário já existe.');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const novoUsuario = await this.prisma.usuario.create({
      data: {
        userName: data.userName,
        nome: data.nome,
        email: data.email,
        senhaHash,
        fotoPerfil: data.fotoPerfil,
      },
    });

    delete (novoUsuario as any).senhaHash;
    return novoUsuario;
  }

  async update(id: number, data: UpdateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const safeData: any = { ...data };

    if (safeData.senhaHash === null) {
      delete safeData.senhaHash;
    }

    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id },
      data: safeData,
    });

    delete (usuarioAtualizado as any).senhaHash;
    return usuarioAtualizado;
  }

  async updateSenha(id: number, data: UpdateSenhaDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const senhaValida = await bcrypt.compare(data.senhaAntiga, usuarioExistente.senhaHash);
    if (!senhaValida) {
      throw new BadRequestException('Senha antiga incorreta.');
    }

    const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id },
      data: { senhaHash: novaSenhaHash },
    });

    delete (usuarioAtualizado as any).senhaHash;
    return usuarioAtualizado;
  }

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany();
    usuarios.forEach((u) => delete (u as any).senhaHash);
    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    delete (usuario as any).senhaHash;
    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async delete(id: number) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.prisma.usuario.delete({ where: { id } });
  }

  // -----------------------------
  // TOKEN DE RECUPERAÇÃO
  // -----------------------------

  async gerarTokenRecuperacao(email: string) {
    const usuario = await this.findOneByEmail(email);
    if (!usuario) return null;

    const token = crypto.randomBytes(32).toString('hex');

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiration: expires,
      },
    });

    return token;
  }

  async findByResetToken(token: string) {
    return this.prisma.usuario.findFirst({
      where: { resetPasswordToken: token },
    });
  }

  async resetPassword(token: string, novaSenha: string) {
    const usuario = await this.findByResetToken(token);

    if (!usuario) {
      throw new NotFoundException('Token inválido.');
    }

    if (!usuario.resetPasswordExpiration || usuario.resetPasswordExpiration < new Date()) {
      throw new BadRequestException('Token expirado.');
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senhaHash: novaSenhaHash,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
    });

    return { message: 'Senha redefinida com sucesso!' };
  }

  // -----------------------------
  // LISTAR AVALIAÇÕES
  // -----------------------------
  async listarAvaliacoes(id: number) {
    if (!(await this.prisma.usuario.findUnique({ where: { id } }))) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        nome: true,
        fotoPerfil: true,
        avaliacoesLoja: {
          select: {
            id: true,
            nota: true,
            conteudo: true,
          },
        },
      },
    });
  }
}

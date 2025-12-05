import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificacaoService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, mensagem: string, link?: string) {
    return this.prisma.notificacao.create({
      data: {
        usuarioId,
        mensagem,
        link,
      },
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number, usuarioId: number) {
    await this.prisma.notificacao.findFirstOrThrow({
        where: { id, usuarioId }
    });

    return this.prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });
  }
  
  async markAllAsRead(usuarioId: number) {
    return this.prisma.notificacao.updateMany({
        where: { usuarioId, lida: false },
        data: { lida: true }
    });
  }
}
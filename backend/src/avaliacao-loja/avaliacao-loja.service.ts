import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { CreateComentarioAvaliacaoLojaDto } from './dto/create-comentario-avaliacao-loja.dto';

@Injectable()
export class AvaliacaoLojaService {
  constructor(private prisma: PrismaService) {}

  async listByLoja(lojaId: number, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const [items, total, agg] = await Promise.all([
      this.prisma.avaliacaoLoja.findMany({
        where: { lojaId },
        include: { usuario: { select: { id: true, nome: true, userName: true, fotoPerfil: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.avaliacaoLoja.count({ where: { lojaId } }),
      this.prisma.avaliacaoLoja.aggregate({ where: { lojaId }, _avg: { nota: true } }),
    ]);

    return {
      data: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      summary: {
        average: Number((agg._avg.nota ?? 0).toFixed(2)),
        count: total,
      },
    };
  }

  async create(lojaId: number, userId: number, dto: CreateAvaliacaoLojaDto) {
    const loja = await this.prisma.loja.findUnique({ where: { id: lojaId } });
    if (!loja) throw new NotFoundException(`Loja com ID ${lojaId} não encontrada.`);
    if (loja.usuarioId === userId) throw new ForbiddenException('Donos não podem avaliar a própria loja.');

    // Garante 1 avaliação por usuário/loja (mensagem amigável)
    const jaExiste = await this.prisma.avaliacaoLoja.findUnique({
      where: { usuarioId_lojaId: { usuarioId: userId, lojaId } },
    }).catch(() => null);
    if (jaExiste) throw new ConflictException('Você já avaliou esta loja.');

    const notaDec = Number(dto.nota);
    const created = await this.prisma.avaliacaoLoja.create({
      data: { lojaId, usuarioId: userId, conteudo: dto.conteudo, nota: notaDec },
    });
    return created;
  }

  async getOne(lojaId: number, avaliacaoId: number) {
    const avaliacao = await this.prisma.avaliacaoLoja.findFirst({
      where: { id: avaliacaoId, lojaId },
      include: {
        usuario: { select: { id: true, nome: true, userName: true, fotoPerfil: true } },
        comentario: {
          include: { usuario: { select: { id: true, nome: true, userName: true, fotoPerfil: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    return avaliacao;
  }

  async update(lojaId: number, avaliacaoId: number, userId: number, dto: UpdateAvaliacaoLojaDto) {
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({ where: { id: avaliacaoId } });
    if (!avaliacao || avaliacao.lojaId !== lojaId) throw new NotFoundException('Avaliação não encontrada.');
    if (avaliacao.usuarioId !== userId) throw new ForbiddenException('Você não pode editar esta avaliação.');
    const notaDec = dto.nota !== undefined ? Number(dto.nota) : undefined;
    const updated = await this.prisma.avaliacaoLoja.update({
      where: { id: avaliacaoId },
      data: {
        nota: notaDec !== undefined ? notaDec : avaliacao.nota,
        conteudo: dto.conteudo !== undefined ? dto.conteudo : avaliacao.conteudo,
      },
    });
    return updated;
  }

  async delete(lojaId: number, avaliacaoId: number, userId: number) {
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({ where: { id: avaliacaoId } });
    if (!avaliacao || avaliacao.lojaId !== lojaId) throw new NotFoundException('Avaliação não encontrada.');
    if (avaliacao.usuarioId !== userId) throw new ForbiddenException('Você não pode deletar esta avaliação.');
    await this.prisma.avaliacaoLoja.delete({ where: { id: avaliacaoId } });
    return { success: true };
  }

  async listComments(lojaId: number, avaliacaoId: number, page = 1, pageSize = 20) {
    // Confirma que avaliação existe dentro da loja
    const existe = await this.prisma.avaliacaoLoja.findFirst({ where: { id: avaliacaoId, lojaId } });
    if (!existe) throw new NotFoundException('Avaliação não encontrada.');
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.comentarioAvaliacaoLoja.findMany({
        where: { avaliacaoLojaId: avaliacaoId },
        include: { usuario: { select: { id: true, nome: true, userName: true, fotoPerfil: true } } },
        orderBy: { createdAt: 'asc' },
        skip,
        take: pageSize,
      }),
      this.prisma.comentarioAvaliacaoLoja.count({ where: { avaliacaoLojaId: avaliacaoId } }),
    ]);
    return {
      data: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async createComment(lojaId: number, avaliacaoId: number, userId: number, dto: CreateComentarioAvaliacaoLojaDto) {
    const avaliacao = await this.prisma.avaliacaoLoja.findFirst({ where: { id: avaliacaoId, lojaId } });
    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    const created = await this.prisma.comentarioAvaliacaoLoja.create({
      data: { avaliacaoLojaId: avaliacaoId, usuarioId: userId, conteudo: dto.conteudo },
      include: { usuario: { select: { id: true, nome: true, userName: true, fotoPerfil: true } } },
    });
    return created;
  }

  async updateComment(lojaId: number, avaliacaoId: number, comentarioId: number, userId: number, conteudo: string) {
    if (!conteudo || !conteudo.trim()) throw new ConflictException('Conteúdo não pode ser vazio.');
    const avaliacao = await this.prisma.avaliacaoLoja.findFirst({ where: { id: avaliacaoId, lojaId } });
    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    const comentario = await this.prisma.comentarioAvaliacaoLoja.findUnique({ where: { id: comentarioId } });
    if (!comentario || comentario.avaliacaoLojaId !== avaliacaoId) throw new NotFoundException('Comentário não encontrado.');
    if (comentario.usuarioId !== userId) throw new ForbiddenException('Você não pode editar este comentário.');
    const updated = await this.prisma.comentarioAvaliacaoLoja.update({
      where: { id: comentarioId },
      data: { conteudo: conteudo.trim() },
      include: { usuario: { select: { id: true, nome: true, userName: true, fotoPerfil: true } } },
    });
    return updated;
  }

  async deleteComment(lojaId: number, avaliacaoId: number, comentarioId: number, userId: number) {
    const avaliacao = await this.prisma.avaliacaoLoja.findFirst({ where: { id: avaliacaoId, lojaId } });
    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    const comentario = await this.prisma.comentarioAvaliacaoLoja.findUnique({ where: { id: comentarioId } });
    if (!comentario || comentario.avaliacaoLojaId !== avaliacaoId) throw new NotFoundException('Comentário não encontrado.');
    if (comentario.usuarioId !== userId) throw new ForbiddenException('Você não pode deletar este comentário.');
    await this.prisma.comentarioAvaliacaoLoja.delete({ where: { id: comentarioId } });
    return { success: true };
  }
}

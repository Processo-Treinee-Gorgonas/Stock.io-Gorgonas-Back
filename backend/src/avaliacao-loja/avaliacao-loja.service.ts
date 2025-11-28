import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';

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

    // Garante 1 avaliação por usuário/loja (a constraint já existe, mas validamos de forma amigável)
    const jaExiste = await this.prisma.avaliacaoLoja.findUnique({
      where: { usuarioId_lojaId: { usuarioId: userId, lojaId } },
    }).catch(() => null);
    if (jaExiste) throw new ConflictException('Você já avaliou esta loja.');

    // Arredonda meios para inteiro do schema
    const notaInt = Math.round(dto.nota);
    const created = await this.prisma.avaliacaoLoja.create({
      data: { lojaId, usuarioId: userId, conteudo: dto.conteudo, nota: notaInt },
    });
    return created;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private prisma: PrismaService) {}

  async upsert(userId: number, data: CreateAvaliacaoProdutoDto) {
    const produto = await this.prisma.produto.findUnique({ where: { id: data.produtoId }, select: { id: true } });
    if (!produto) throw new NotFoundException(`Produto ${data.produtoId} não encontrado.`);

    const notaInt = Math.max(1, Math.min(5, Math.round(Number(data.nota))));

    return this.prisma.avaliacaoProduto.upsert({
      where: { usuarioId_produtoId: { usuarioId: userId, produtoId: data.produtoId } },
      update: { nota: notaInt },
      create: { usuarioId: userId, produtoId: data.produtoId, nota: notaInt, conteudo: '' },
    });
  }
}

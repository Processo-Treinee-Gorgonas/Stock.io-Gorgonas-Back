import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { PrismaModule } from '../database/prisma.module';
import { AvaliacaoProdutoController } from '../avaliacao-produto/avaliacao-produto.controller';
import { AvaliacaoProdutoService } from '../avaliacao-produto/avaliacao-produto.service';

@Module({
  imports: [PrismaModule], // Disponibiliza PrismaService
  controllers: [ProdutoController, AvaliacaoProdutoController], // Controllers deste módulo
  providers: [ProdutoService, AvaliacaoProdutoService], // Services deste módulo
  exports: [ProdutoService], // Exporta se outro módulo precisar
})
export class ProdutoModule {}

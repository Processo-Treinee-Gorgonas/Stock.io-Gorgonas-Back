import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule], // Disponibiliza PrismaService
  controllers: [ProdutoController], // Controller deste módulo
  providers: [ProdutoService], // Service deste módulo
  exports: [ProdutoService], // Exporta se outro módulo precisar
})
export class ProdutoModule {}

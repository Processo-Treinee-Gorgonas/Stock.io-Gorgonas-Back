import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaModule } from '../database/prisma.module'; // Garante acesso ao PrismaService

// Módulo que agrupa Controller e Service relacionados à Loja.
@Module({
  imports: [PrismaModule], // Importa o PrismaModule para disponibilizar o PrismaService
  controllers: [CategoriaController], // Declara o controller deste módulo
  providers: [CategoriaService],      // Declara o service deste módulo
  exports: [CategoriaService],        // Exporta o service para ser usado por outros módulos, se necessário
})
export class CategoriaModule {}
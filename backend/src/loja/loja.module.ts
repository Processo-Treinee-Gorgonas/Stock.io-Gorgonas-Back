import { Module } from '@nestjs/common';
import { LojaService } from './loja.service';
import { LojaController } from './loja.controller';
import { PrismaModule } from '../database/prisma.module'; // Garante acesso ao PrismaService

// Módulo que agrupa Controller e Service relacionados à Loja.
@Module({
  imports: [PrismaModule], // Importa o PrismaModule para disponibilizar o PrismaService
  controllers: [LojaController], // Declara o controller deste módulo
  providers: [LojaService],      // Declara o service deste módulo
  exports: [LojaService],        // Exporta o service para ser usado por outros módulos, se necessário
})
export class LojaModule {}
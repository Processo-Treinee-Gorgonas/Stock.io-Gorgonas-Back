import { Module } from '@nestjs/common';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService],
})
export class AvaliacaoLojaModule {}

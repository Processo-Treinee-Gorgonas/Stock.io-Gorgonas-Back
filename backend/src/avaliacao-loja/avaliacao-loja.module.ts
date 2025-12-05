import { Module } from '@nestjs/common';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { PrismaModule } from '../database/prisma.module';
import { NotificacaoModule } from '../notificacao/notificacao.module';

@Module({
  imports: [PrismaModule, NotificacaoModule],
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService],
})
export class AvaliacaoLojaModule {}

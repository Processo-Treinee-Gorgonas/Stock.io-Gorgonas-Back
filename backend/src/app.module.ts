import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [UsuarioModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

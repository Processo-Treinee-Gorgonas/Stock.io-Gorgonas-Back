import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from './database/prisma.module';
import { LojaModule } from './loja/loja.module';

@Module({
  imports: [UsuarioModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, LojaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
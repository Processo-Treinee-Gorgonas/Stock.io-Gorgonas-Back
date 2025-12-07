import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from './database/prisma.module';
import { LojaModule } from './loja/loja.module';
import { ProdutoModule } from './produto/produto.module';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AvaliacaoLojaModule } from './avaliacao-loja/avaliacao-loja.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EmailModule,
    UsuarioModule,
    AuthModule,
    LojaModule,
    ProdutoModule,
    CategoriaModule,
    AvaliacaoLojaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

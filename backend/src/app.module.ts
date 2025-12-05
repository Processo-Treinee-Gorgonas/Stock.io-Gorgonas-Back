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
import { UploadController } from './upload/upload.cotroller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'uploads'), // Usa a raiz do projeto para achar a pasta
    serveRoot: '/uploads', // Define a rota na URL
  }), UsuarioModule, ConfigModule.forRoot({ isGlobal: true }), PrismaModule, LojaModule, ProdutoModule, AuthModule, CategoriaModule, AvaliacaoLojaModule],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule { }
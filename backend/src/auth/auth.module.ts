// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importa todas as nossas ferramentas customizadas
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  imports: [
    UsuarioModule, // Para o AuthService poder usar o UsuarioService

    // 1. A PRIMEIRA DEFESA: Diz ao Passport para NÃO usar sessões
    PassportModule.register({ session: false }), 
    
    // Configura a criação de Tokens (JWT)
    JwtModule.registerAsync({
      imports: [ConfigModule], // Lê as variáveis de ambiente
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // Tokens expiram em 1 hora
      }),
    }),
  ],
  controllers: [AuthController], // O "porteiro"
  
  // 2. O REGISTRO: Lista todas as "ferramentas" do módulo
  providers: [
    AuthService,     // O "cérebro"
    LocalStrategy,   // O "validador de login"
    JwtStrategy,     // O "leitor de crachá"
    LocalAuthGuard,  // A "cura" (guarda de login customizada)
    JwtAuthGuard,    // A guarda de rotas protegidas
  ],
})
export class AuthModule {}
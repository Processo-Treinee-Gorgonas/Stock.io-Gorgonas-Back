// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- 1. IMPORTAR

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    
    // --- 2. ISSO VAI MUDAR ---
    // Em vez de 'register', usamos 'registerAsync'
    // para que ele possa esperar o .env ser carregado
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa o módulo de config
      inject: [ConfigService],  // Injeta o serviço de config
      useFactory: (configService: ConfigService) => ({
        
        // 3. Lê o segredo do .env
        secret: configService.get<string>('JWT_SECRET'), 
        
        signOptions: { expiresIn: '1h' },
      }),
    }),
    // --- FIM DA MUDANÇA ---
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
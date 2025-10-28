import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa o módulo de config
      inject: [ConfigService],  // Injeta o serviço de config
      useFactory: (configService: ConfigService) => ({
        
        //Lê o segredo do .env
        secret: configService.get<string>('JWT_SECRET'), 
        
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard,],
})
export class AuthModule {}
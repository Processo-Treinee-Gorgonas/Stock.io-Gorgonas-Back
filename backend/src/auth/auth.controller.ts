// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// 1. Importa a NOSSA guarda customizada (a "cura")
import { LocalAuthGuard } from './guards/local-auth.guard'; 

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // Injetamos o UsuarioService aqui APENAS para a rota de signup
    private usuarioService: UsuarioService,
  ) {}

  /**
   * Rota de Login: POST /auth/login
   */
  // 2. Usa a NOSSA guarda (que não cria sessões)
  @UseGuards(LocalAuthGuard) 
  @Post('login')
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    // A 'LocalAuthGuard' (via LocalStrategy) já validou
    // e anexou o usuário ao 'req.user'.
    // Agora, apenas passamos o usuário para o 'authService'
    // para que ele possa criar o Token (a "chave").
    return this.authService.login(req.user);
  }

  /**
   * Rota de Registro: POST /auth/signup
   */
  @Post('signup')
  async signup(@Body() createUserDto: CreateUsuarioDto) {
    // Esta rota é pública e apenas repassa os dados
    // para o UsuarioService (que faz o hashing, etc.)
    return this.usuarioService.create(createUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    await this.authService.forgotPassword(email);
    return { message: 'Solicitação enviada com sucesso.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { token, novaSenha } = resetPasswordDto;
    await this.authService.resetPassword(token, novaSenha);
    return { message: 'Senha alterada com sucesso.' };
  }
}

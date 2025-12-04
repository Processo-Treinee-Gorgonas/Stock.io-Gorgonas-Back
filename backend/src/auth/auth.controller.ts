// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';

import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {}

  /**
   * Rota de Login: POST /auth/login
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  /**
   * Rota de Registro: POST /auth/signup
   */
  @Post('signup')
  async signup(@Body() createUserDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUserDto);
  }

  /**
   * Inicia recuperação de senha
   * Front chama POST /auth/forgot-password
   */
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  /**
   * Finaliza redefinição de senha
   * Front chama POST /auth/reset-password
   */
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.novaSenha);
  }
}

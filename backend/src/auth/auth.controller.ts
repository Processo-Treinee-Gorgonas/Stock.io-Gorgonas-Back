// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {}

  /**
   * Rota de Login: POST /auth/login
   */
  @UseGuards(AuthGuard('local')) 
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
}
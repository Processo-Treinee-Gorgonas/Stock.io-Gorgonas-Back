// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from '../usuario/usuario.service'; // <-- 1. IMPORTA O SERVIÇO DO SEU GRUPO
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto'; // <-- 2. USA O DTO DO SEU GRUPO
import { LoginDto } from './dto/login.dto'; // <-- 3. USA O DTO DE LOGIN

@Controller('auth') // Todas as rotas aqui começarão com /auth
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService, // <-- 4. INJETA O SERVIÇO DO SEU GRUPO
  ) {}

  /**
   * Rota de Login: POST /auth/login
   */
  @UseGuards(AuthGuard('local')) // <-- 5. ISSO AGORA FUNCIONA
  @Post('login')
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    // O @UseGuards('local') chamou a LocalStrategy e validou o usuário.
    // O usuário validado está em 'req.user'.
    // Agora, apenas criamos o token para ele.
    return this.authService.login(req.user); // <-- 6. ISSO AGORA FUNCIONA
  }

  /**
   * Rota de Registro: POST /auth/signup
   */
  @Post('signup')
  async signup(@Body() createUserDto: CreateUsuarioDto) {
    // 7. Chama o método 'create' do seu UsuarioService.
    // Toda a lógica de bcrypt e 'confirmarSenha' que seu grupo fez
    // será executada perfeitamente.
    return this.usuarioService.create(createUserDto);
  }
}
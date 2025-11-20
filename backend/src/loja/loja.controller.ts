import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, // Valida e converte o parâmetro :id para número
  UseGuards, // Aplica o guardião de autenticação
  Request, // Acessa o objeto da requisição (contém req.user após autenticação)
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Guardião que verifica o token JWT

// Define a rota base para todas as operações deste controller como '/lojas'
@Controller('lojas')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  // Rota para CRIAR uma nova loja (POST /lojas)
  @UseGuards(JwtAuthGuard) // Só permite acesso se o usuário estiver logado (token JWT válido)
  @Post()
  @HttpCode(HttpStatus.CREATED) // Define o status HTTP de sucesso como 201
  async create(@Body() data: CreateLojaDto, @Request() req): Promise<any> {
    // O JwtAuthGuard anexa o payload decodificado do token a req.user
    // O JwtStrategy foi configurado para retornar { userId: payload.sub, ... }
    const userId = req.user?.userId;
    // Verificação de segurança adicional
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    // Chama o serviço para criar a loja, passando os dados e o ID do dono
    return this.lojaService.create(data, userId);
  }

  // Rota para ATUALIZAR uma loja existente (PATCH /lojas/:id)
  @UseGuards(JwtAuthGuard) // Só usuários logados
  @Patch(':id') // O :id na URL será capturado pelo @Param('id')
  async update(
    @Param('id', ParseIntPipe) id: number, // Pega o 'id' da URL e converte para número
    @Body() data: UpdateLojaDto, // Pega os dados a atualizar do corpo da requisição
    @Request() req,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    // Chama o serviço para atualizar, passando id da loja, dados e id do usuário (para verificar permissão)
    return this.lojaService.update(id, data, userId);
  }

  // Rota para LISTAR TODAS as lojas (GET /lojas) - Rota Pública
  @Get()
  async findAll(): Promise<any[]> {
    return this.lojaService.findAll();
  }

  // Rota para LISTAR APENAS AS LOJAS DO USUÁRIO LOGADO (GET /lojas/minhas)
  @UseGuards(JwtAuthGuard) // Só usuários logados
  @Get('minhas') // Rota específica antes da rota dinâmica :id
  async findMyLojas(@Request() req): Promise<any[]> {
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
       throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    // Chama o serviço para buscar apenas as lojas deste usuário
    return this.lojaService.findMyLojas(userId);
  }

  // Rota para BUSCAR UMA loja pelo ID (GET /lojas/:id) - Rota Pública
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.lojaService.findOne(id);
  }

  // Rota para DELETAR uma loja (DELETE /lojas/:id)
  @UseGuards(JwtAuthGuard) // Só usuários logados
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o status de sucesso como 204 (sem conteúdo)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      throw new ForbiddenException(
        'ID do usuário inválido ou não encontrado no token.',
      );
    }
    // Chama o serviço para deletar, passando id da loja e id do usuário (para verificar permissão)
    await this.lojaService.delete(id, userId);
    // Não retorna nada no corpo da resposta
  }
}

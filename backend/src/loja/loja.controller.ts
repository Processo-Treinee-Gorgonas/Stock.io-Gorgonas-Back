import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, // Valida e converte o parâmetro :id para número
  UseGuards,    // Aplica o guardião de autenticação
  Request,      // Acessa o objeto da requisição (contém req.user após autenticação)
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { Loja } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
};
@Controller('lojas')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @UseGuards(JwtAuthGuard) 
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  @UseInterceptors(FileInterceptor('logo', multerConfig ))

  async create(@Body() data: CreateLojaDto, @Request() req, @UploadedFile() file: Express.Multer.File): Promise<Loja> {
    const userId = req.user?.userId;
    // Verificação de segurança adicional
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    if (file) {
      data.logo = file.path;
    }
    return this.lojaService.create(data, userId);
  }

  @UseGuards(JwtAuthGuard) // Só usuários logados
  @Patch(':id') // O :id na URL será capturado pelo @Param('id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
        { name: 'perfil', maxCount: 1 }, 
      ],
      multerConfig,
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: number, // Pega o 'id' da URL e converte para número
    @Body() body: any,  
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
      perfil?: Express.Multer.File[];
    },       
    @Request() req,
  ): Promise<Loja> {
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    const data: UpdateLojaDto = {};

    if (body.nome) data.nome = body.nome;
    if (body.descricao) data.descricao = body.descricao;
    
    if (body.categoriaId) {
      data.categoriaId = Number(body.categoriaId);
    }

    if (body.removerLogo === 'true') data.logo = '/';
    if (body.removerBanner === 'true') data.banner = '/';
    if (body.removerPerfil === 'true') data.sticker = '/';

    if (files?.logo?.[0]) {
      data.logo = files.logo[0].path;
    }

    if (files?.banner?.[0]) {
      data.banner = files.banner[0].path;
    }
    if (files?.perfil?.[0]) {
      data.sticker = files.perfil[0].path; 
    }
    return this.lojaService.update(id, data, userId);
  }

  // Rota para LISTAR TODAS as lojas (GET /lojas) - Rota Pública
  @Get()
  async findAll(@Query('categoria') categoria?: string): Promise<Loja[]> {
    return this.lojaService.findAll(categoria);
  }

   // Rota para LISTAR APENAS AS LOJAS DO USUÁRIO LOGADO (GET /lojas/minhas)
   @UseGuards(JwtAuthGuard) // Só usuários logados
   @Get('minhas') // Rota específica antes da rota dinâmica :id
   async findMyLojas(@Request() req): Promise<Loja[]> {
     const userId = req.user?.userId;
     if (typeof userId !== 'number') {
       throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
     }
     // Chama o serviço para buscar apenas as lojas deste usuário
     return this.lojaService.findMyLojas(userId);
   }

  // Rota para BUSCAR UMA loja pelo ID (GET /lojas/:id) - Rota Pública
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Loja> {
    return this.lojaService.findOne(id);
  }

  // Rota para DELETAR uma loja (DELETE /lojas/:id)
  @UseGuards(JwtAuthGuard) // Só usuários logados
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o status de sucesso como 204 (sem conteúdo)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    // Chama o serviço para deletar, passando id da loja e id do usuário (para verificar permissão)
    await this.lojaService.delete(id, userId);
    // Não retorna nada no corpo da resposta
  }

  @Get('usuario/:id')
  async encontrarPorUsuario(
    @Param('id', ParseIntPipe) id: number){
      return this.lojaService.encontrarPorUsuario(id);
  }

}
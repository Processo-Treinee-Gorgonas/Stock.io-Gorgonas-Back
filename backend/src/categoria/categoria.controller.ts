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
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../../generated/prisma';

// Define a rota base para todas as operações deste controller como '/lojas'
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly lojaService: CategoriaService) {}

    @Get(':categoria')
    async findOneByName(@Param('categoria') categoria: string): Promise<Categoria> {
      return this.lojaService.findOneByName(categoria);
    }

}
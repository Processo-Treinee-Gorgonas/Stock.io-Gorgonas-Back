import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Produto } from '../../generated/prisma';
import { use } from 'passport';

// Helper: pega o ID do usuário do token (ajuste aqui se no seu token for "user.id")
function getUserId(req: any): number {
  return req?.user?.userId as number;
}


// Define a rota base para este controller como /produtos
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get('recentes')
  async listarProdutos(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
  ) {
    return this.produtoService.listarProdutos(page, limit);
  }

  // CRIAR produto (POST /produtos) – somente usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateProdutoDto, @Request() req): Promise<Produto> {
    const userId = getUserId(req);
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    return this.produtoService.create(data, userId);
  }

  // ATUALIZAR produto (PATCH /produtos/:id) – somente usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProdutoDto,
    @Request() req,
  ): Promise<Produto> {
    const userId = getUserId(req);
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    return this.produtoService.update(id, data, userId);
  }

  // LISTAR todos os produtos (GET /produtos) – rota pública
  @Get()
  async findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('loja/:lojaId')
  findAllFromStore(@Param('lojaId', ParseIntPipe) lojaId: number) {
    return this.produtoService.findAllFromStore(lojaId);
  }
  // LISTAR apenas os produtos das lojas do usuário logado (GET /produtos/minhas)
  @UseGuards(JwtAuthGuard)
  @Get('minhas')
  async findMy(@Request() req): Promise<Produto[]> {
    const userId = getUserId(req);
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    return this.produtoService.findMyProdutos(userId);
  }

  // ROTA DA SEARCHBAR
  @Get('buscar')
  async search(@Query('q') query: string) {
    if (!query) {
      return []; // Retorna vazio se a busca for vazia
    }
    return this.produtoService.search(query);
  }
  // BUSCAR produto pelo ID (GET /produtos/:id) – rota pública
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findOne(id);
  }

  // DELETAR produto (DELETE /produtos/:id) – somente usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const userId = getUserId(req);
    if (typeof userId !== 'number') {
      throw new ForbiddenException('ID do usuário inválido ou não encontrado no token.');
    }
    await this.produtoService.delete(id, userId);
    // Sem corpo de resposta (204), igual ao padrão do controller de loja
  }

  @Get('ver-mais/:slug')
  async ProcurarPorCategoria(
    @Param('slug') slug: string,
  ) {
    return this.produtoService.ProcurarPorCategoria(slug  );
  }

}

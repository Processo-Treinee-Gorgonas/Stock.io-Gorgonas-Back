import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { CreateComentarioAvaliacaoLojaDto } from './dto/create-comentario-avaliacao-loja.dto';

class UpdateComentarioDto { conteudo!: string; }

@Controller('lojas/:lojaId/avaliacoes')
export class AvaliacaoLojaController {
  constructor(private service: AvaliacaoLojaService) {}

  @Get()
  async list(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.min(50, Math.max(1, parseInt(pageSize as string, 10) || 10));
    return this.service.listByLoja(lojaId, p, ps);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Body() dto: CreateAvaliacaoLojaDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId;
    return this.service.create(lojaId, userId, dto);
  }

  @Get(':avaliacaoId')
  async getOne(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
  ) {
    return this.service.getOne(lojaId, avaliacaoId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':avaliacaoId')
  async update(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
    @Body() dto: UpdateAvaliacaoLojaDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId;
    return this.service.update(lojaId, avaliacaoId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':avaliacaoId')
  async delete(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId;
    return this.service.delete(lojaId, avaliacaoId, userId);
  }

  @Get(':avaliacaoId/comentarios')
  async listComments(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 20));
    return this.service.listComments(lojaId, avaliacaoId, p, ps);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':avaliacaoId/comentarios')
  async createComment(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
    @Body() dto: CreateComentarioAvaliacaoLojaDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId;
    return this.service.createComment(lojaId, avaliacaoId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':avaliacaoId/comentarios/:comentarioId')
  async updateComment(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
    @Body() dto: UpdateComentarioDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId;
    return this.service.updateComment(lojaId, avaliacaoId, comentarioId, userId, dto.conteudo);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':avaliacaoId/comentarios/:comentarioId')
  async deleteComment(
    @Param('lojaId', ParseIntPipe) lojaId: number,
    @Param('avaliacaoId', ParseIntPipe) avaliacaoId: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId;
    return this.service.deleteComment(lojaId, avaliacaoId, comentarioId, userId);
  }
}
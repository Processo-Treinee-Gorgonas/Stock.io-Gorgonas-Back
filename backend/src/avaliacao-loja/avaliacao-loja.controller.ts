import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';

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
}

import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';

function getUserId(req: any): number { return req?.user?.userId as number; }

@UseGuards(JwtAuthGuard)
@Controller('avaliacoes-produto')
export class AvaliacaoProdutoController {
  constructor(private readonly service: AvaliacaoProdutoService) {}

  @Post()
  async upsert(@Body() dto: CreateAvaliacaoProdutoDto, @Request() req) {
    const userId = getUserId(req);
    return this.service.upsert(userId, dto);
  }
}

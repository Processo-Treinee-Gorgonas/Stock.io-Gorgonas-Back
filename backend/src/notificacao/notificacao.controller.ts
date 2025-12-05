import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notificacoes')
@UseGuards(JwtAuthGuard)
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Get()
  findAll(@Request() req) {
    return this.notificacaoService.findAll(req.user.userId);
  }

  @Patch(':id/lida')
  markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notificacaoService.markAsRead(id, req.user.userId);
  }
  
  @Patch('ler-todas')
  markAllAsRead(@Request() req) {
      return this.notificacaoService.markAllAsRead(req.user.userId);
  }
}
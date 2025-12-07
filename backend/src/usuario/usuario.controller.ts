import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Patch(':id/senha')
  updateSenha(@Param('id') id: string, @Body() updateSenhaDto: UpdateSenhaDto) {
    return this.usuarioService.updateSenha(+id, updateSenhaDto);
  }

  @Get(':id/avaliacoes')
  listarAvaliacoes(@Param('id') id: string) {
    return this.usuarioService.listarAvaliacoes(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.delete(+id);
  }
}

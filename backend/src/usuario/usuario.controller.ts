import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSenhaDto } from './dto/update-senha.dto';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    create(@Body() data: CreateUsuarioDto) {
        return this.usuarioService.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateUsuarioDto
    ) {
        return this.usuarioService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('senha/:id')
    updateSenha(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateSenhaDto
    ) {
        return this.usuarioService.updateSenha(id, data);
    }

    @Get()
    findAll() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usuarioService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usuarioService.delete(id);
    }

}
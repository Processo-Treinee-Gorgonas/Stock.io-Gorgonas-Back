import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    create(@Body() data: CreateUsuarioDto) {
        return this.usuarioService.create(data);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateUsuarioDto
    ) {
        return this.usuarioService.update(id, data);
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

    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usuarioService.delete(id);
    }

}

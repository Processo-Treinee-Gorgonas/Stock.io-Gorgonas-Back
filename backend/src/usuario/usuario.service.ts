import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {

    constructor(private prisma: PrismaService) {}

    async create(data: CreateUsuarioDto) {

        if (data.senha !== data.confirmarSenha) {
            throw new BadRequestException('A senha e a confirmação de senha não coincidem.');
        }

        const usuarioExistente = await this.prisma.usuario.findFirst({
            where: { 
                OR: [
                    { email: data.email },
                    { userName: data.userName }
                ]
            },
        });

        if (usuarioExistente) {
            throw new ConflictException('Usuário com este email ou nome de usuário já existe.');
        }

        const senhaHash = await bcrypt.hash(data.senha, 10);

        const novoUsuario = await this.prisma.usuario.create({
            data: {
                userName: data.userName,
                nome: data.nome,
                email: data.email,
                senhaHash: senhaHash,
                fotoPerfil: data.fotoPerfil,
            },
        });

        delete (novoUsuario as any).senhaHash;
        return novoUsuario;
    
}
}
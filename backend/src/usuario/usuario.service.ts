import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
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

        const usuarioExiste = await this.prisma.usuario.findFirst({
            where: { 
                OR: [
                    { email: data.email },
                    { userName: data.userName }
                ]
            },
        });

        if (usuarioExiste) {
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

    async update(id:number, data: UpdateUsuarioDto) {
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { id: id },
        });

        if (!usuarioExistente) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        let senhaHash: string | undefined = undefined

        if (data.senha) {

            if (data.senha !== data.confirmarSenha) {
                throw new BadRequestException('A senha e a confirmação de senha não coincidem.');
            }

            senhaHash = await bcrypt.hash(data.senha, 10);
        }

        delete data.senha;
        delete data.confirmarSenha;

        const usuarioAtualizado = await this.prisma.usuario.update({
            where: { id: id },
            data: {
                userName: data.userName,
                nome: data.nome,
                email: data.email,
                fotoPerfil: data.fotoPerfil,
                senhaHash: senhaHash,
            },
        });

        delete (usuarioAtualizado as any).senhaHash;
        return usuarioAtualizado;
    }

    async findAll() {
        const usuarios = await this.prisma.usuario.findMany();
        
        usuarios.forEach(usuario => {
            delete (usuario as any).senhaHash;
        });
        
        return usuarios;
    }

    async findOne(id: number) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id: id },
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        delete (usuario as any).senhaHash;
        return usuario;
    }

    async delete(id: number) {
        
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { id: id },
        });
        
        if (!usuarioExistente) {
            throw new NotFoundException('Usuário não encontrado.');
        }
        
        await this.prisma.usuario.delete({
            where: { id: id },
        });
    }
}
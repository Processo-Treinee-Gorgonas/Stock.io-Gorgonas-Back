import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../database/prisma.service';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateSenhaDto } from './dto/update-senha.dto';

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

        const usuarioAtualizado = await this.prisma.usuario.update({
            where: { id: id },
            data: {
                userName: data.userName,
                nome: data.nome,
                email: data.email,
                fotoPerfil: data.fotoPerfil,
            },
        });

        delete (usuarioAtualizado as any).senhaHash;
        return usuarioAtualizado;
    }

    async updateSenha(id:number, data:  UpdateSenhaDto) {
        
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { id: id },
        });

        if (!usuarioExistente) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        let senhaHash: string | undefined = undefined

        let senhaValida = await bcrypt.compare(data.senhaAntiga, usuarioExistente.senhaHash);
        if (!senhaValida) {
            throw new BadRequestException('Senha antiga incorreta.');
        }

        if (data.novaSenha) {
            senhaHash = await bcrypt.hash(data.novaSenha, 10);
        }

        const usuarioAtualizado = await this.prisma.usuario.update({
            where: { id: id },
            data: {
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

    async findOneByEmail(email: string): Promise<Usuario | null> {
        return this.prisma.usuario.findUnique({
            where: {
                email: email,
            },
        });
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

    async listarAvaliacoes(id: number) {
        if (!await this.prisma.usuario.findUnique({ where: { id: id } })) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const usuarioAvaliacoes = await this.prisma.usuario.findUnique({
            where: { id: id },
            select: {
                nome: true,
                fotoPerfil: true,
                avaliacoesLoja: {
                    select: {
                        id: true,
                        nota: true,
                        conteudo: true,
                    },
                },
            },
        });

        return usuarioAvaliacoes;
    }

 // função nova para recuperar senha 
    async updateSenhaDireta(id: number, novaSenhaHash: string) {
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { id },
        });

        if (!usuarioExistente) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const usuarioAtualizado = await this.prisma.usuario.update({
            where: { id },
            data: { senhaHash: novaSenhaHash },
        });

        delete (usuarioAtualizado as any).senhaHash;
        return usuarioAtualizado;
    }
}

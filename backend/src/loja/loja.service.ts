import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { PrismaService } from '../database/prisma.service'; // Importa o serviço Prisma configurado
import { Loja } from '@prisma/client'; // Importa o tipo Loja gerado pelo Prisma
import { CategoriasNome } from '@prisma/client';

@Injectable()
export class LojaService {

    constructor(private prisma: PrismaService) {}

    // Cria uma nova loja associada a um usuário
    async create(data: CreateLojaDto, userId: number): Promise<Loja> {
        // Verifica se já existe uma loja com o mesmo nome (campo @unique no schema)
        const lojaExiste = await this.prisma.loja.findUnique({
            where: { nome: data.nome },
        });
        if (lojaExiste) {
            throw new ConflictException('Já existe uma loja com este nome.');
        }

        // Verifica se a categoria informada existe no banco de dados
        const categoriaExiste = await this.prisma.categoria.findUnique({
            where: { id: data.categoriaId },
        });
        if (!categoriaExiste) {
            throw new NotFoundException('Categoria com ID ${data.categoriaId} não encontrada.');
        }

        // Cria a loja no banco de dados, associando ao usuário (userId)
        const novaLoja = await this.prisma.loja.create({
            data: {
                ...data, // Inclui todos os campos do DTO (nome, descricao, logo, etc.)
                usuarioId: userId, // Define o dono da loja
            },
        });
        return novaLoja;
    }

    // Atualiza os dados de uma loja existente
    async update(id: number, data: UpdateLojaDto, userId: number): Promise<Loja> {
        // Busca a loja pelo ID para verificar se existe e quem é o dono
        const lojaExistente = await this.prisma.loja.findUnique({
            where: { id: id },
        });
        if (!lojaExistente) {
            throw new NotFoundException('Loja com ID ${id} não encontrada.');
        }
        // Garante que apenas o dono possa editar a loja
        if (lojaExistente.usuarioId !== userId) {
            throw new ForbiddenException('Você não tem permissão para editar esta loja.');
        }

        // Se um novo nome foi fornecido e é diferente do atual, verifica se já está em uso
        if (data.nome && data.nome !== lojaExistente.nome) {
            const conflitoNome = await this.prisma.loja.findUnique({
                 where: { nome: data.nome },
             });
             if (conflitoNome) {
                 throw new ConflictException('Já existe outra loja com este nome.');
             }
        }
        // Se uma nova categoria foi fornecida, verifica se ela existe
         if (data.categoriaId) {
             const categoriaExiste = await this.prisma.categoria.findUnique({
                 where: { id: data.categoriaId },
             });
             if (!categoriaExiste) {
                 throw new NotFoundException('Categoria com ID ${data.categoriaId} não encontrada.');
             }
         }

        // Atualiza a loja no banco de dados com os novos dados
        const lojaAtualizada = await this.prisma.loja.update({
            where: { id: id },
            data: data, // O Prisma atualiza apenas os campos presentes no objeto 'data'
        });
        return lojaAtualizada;
    }

    // Retorna uma lista de todas as lojas cadastradas (rota pública)
    async findAll(): Promise<Loja[]> {
        return this.prisma.loja.findMany({
            include: { // Inclui dados relacionados para enriquecer a resposta
                categoria: true, // Dados da categoria associada
                usuario: { select: { id: true, nome: true, userName: true } } // Dados selecionados do usuário dono
            }
        });
    }

    // Retorna os detalhes de uma loja específica pelo ID (rota pública)
    async findOne(id: number): Promise<Loja> {
        const loja = await this.prisma.loja.findUnique({
            where: { id: id },
            include: { // Inclui dados relacionados para uma visão completa da loja
                categoria: true,
                usuario: { select: { id: true, nome: true, userName: true } },
                produtos: true, // Lista de produtos associados a esta loja
                avaliacoes: true // Lista de avaliações associadas a esta loja
            }
        });
        // Se a loja não for encontrada, lança um erro 404
        if (!loja) {
            throw new NotFoundException('Loja com ID ${id} não encontrada.');
        }
        return loja;
    }

    // Deleta uma loja, verificando a permissão do usuário
    async delete(id: number, userId: number): Promise<void> {
        // Busca a loja pelo ID para verificar se existe e quem é o dono
        const lojaExistente = await this.prisma.loja.findUnique({
            where: { id: id },
        });
        if (!lojaExistente) {
            throw new NotFoundException('Loja com ID ${id} não encontrada.');
        }
        // Garante que apenas o dono possa deletar a loja
        if (lojaExistente.usuarioId !== userId) {
            throw new ForbiddenException('Você não tem permissão para deletar esta loja.');
        }

        // Deleta a loja do banco de dados
        // Nota: Relações com onDelete: Cascade no schema Prisma cuidarão da exclusão de dados dependentes (ex: Produtos).
        await this.prisma.loja.delete({
            where: { id: id },
        });
        // Não retorna nada após a exclusão, conforme padrão do UsuarioService
    }

     // Retorna uma lista apenas das lojas pertencentes ao usuário logado
     async findMyLojas(userId: number): Promise<Loja[]> {
        return this.prisma.loja.findMany({
            where: { usuarioId: userId }, // Filtra pelo ID do usuário
            include: { categoria: true } // Inclui dados da categoria
        });
    }

      async ProcurarPorCategoria(slug: string) {
        const nomeDaCategoria = slug.toUpperCase() as CategoriasNome;
        return this.prisma.loja.findMany({

          //Filtra por caegoria
          where: {
              categoria: { 
                nome: nomeDaCategoria
              }
            },
    
    
          select: {
            id: true,
            nome: true,
            logo: true,
            banner: true,
            sticker: true
          }
        });
      }
}
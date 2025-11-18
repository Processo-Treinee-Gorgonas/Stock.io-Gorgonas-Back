import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from '../database/prisma.service';
import { CategoriasNome, Produto, Prisma } from '../../generated/prisma';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  // Cria um novo produto associado a uma loja do usuário
  async create(data: CreateProdutoDto, userId: number): Promise<Produto> {
    // Verifica se já existe um produto com o mesmo nome nesta loja
    const produtoExiste = await this.prisma.produto.findFirst({
      where: { nome: data.nome, lojaId: data.lojaId },
    });
    if (produtoExiste) {
      throw new ConflictException(
        'Já existe um produto com este nome nesta loja.',
      );
    }

    // Verifica se a loja existe e pertence ao usuário
    const loja = await this.prisma.loja.findUnique({
      where: { id: data.lojaId },
      select: { id: true, usuarioId: true },
    });
    if (!loja) {
      throw new NotFoundException(`Loja com ID ${data.lojaId} não encontrada.`);
    }
    if (loja.usuarioId !== userId) {
      throw new ForbiddenException('Você não tem permissão nesta loja.');
    }

    // Verifica se a subcategoria informada existe
    const subcategoria = await this.prisma.subcategoria.findUnique({
      where: { id: data.subcategoriaId },
    });
    if (!subcategoria) {
      throw new NotFoundException(
        `Subcategoria com ID ${data.subcategoriaId} não encontrada.`,
      );
    }

    // Cria o produto no banco de dados
    const novoProduto = await this.prisma.produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        estoque: data.estoque,
        lojaId: data.lojaId,
        subcategoriaId: data.subcategoriaId,
      },
    });
    return novoProduto;
  }

  // Atualiza os dados de um produto existente
  async update(
    id: number,
    data: UpdateProdutoDto,
    userId: number,
  ): Promise<Produto> {
    // Busca o produto para verificar existência e dono da loja
    const produtoExistente = await this.prisma.produto.findUnique({
      where: { id },
      include: { loja: { select: { usuarioId: true } } },
    });
    if (!produtoExistente) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    if (produtoExistente.loja.usuarioId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este produto.',
      );
    }

    // Se alterou o nome, verifica se já existe outro com o mesmo nome na mesma loja
    if (data.nome && data.nome !== produtoExistente.nome) {
      const conflitoNome = await this.prisma.produto.findFirst({
        where: {
          nome: data.nome,
          lojaId: produtoExistente.lojaId,
          NOT: { id },
        },
      });
      if (conflitoNome) {
        throw new ConflictException(
          'Já existe outro produto com este nome nesta loja.',
        );
      }
    }

    // Se enviar nova subcategoria, verifica se ela existe
    if (data.subcategoriaId) {
      const subcategoria = await this.prisma.subcategoria.findUnique({
        where: { id: data.subcategoriaId },
      });
      if (!subcategoria) {
        throw new NotFoundException(
          `Subcategoria com ID ${data.subcategoriaId} não encontrada.`,
        );
      }
    }

    // Atualiza o produto (Prisma atualiza só os campos presentes)
    const produtoAtualizado = await this.prisma.produto.update({
      where: { id },

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: {
        ...data,
        ...(data.preco !== undefined ? { preco: Number(data.preco) } : {}),
      } as any,
    });
    return produtoAtualizado;
  }

  // Retorna uma lista de todos os produtos (rota pública)
  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      include: {
        subcategoria: true,
        loja: { select: { id: true, nome: true } },
      },
    });
  }

  // Retorna os detalhes de um produto específico (rota pública)
  async findOne(id: number): Promise<Produto> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        subcategoria: true,
        loja: {
          select: {
            id: true,
            nome: true,
            logo: true,
            usuarioId: true 
          }
        },
        imagens: true,
        avaliacoes: true,
      },
    });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  // Deleta um produto, verificando a permissão do usuário
  async delete(id: number, userId: number): Promise<void> {
    const produtoExistente = await this.prisma.produto.findUnique({
      where: { id },
      include: { loja: { select: { usuarioId: true } } },
    });
    if (!produtoExistente) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    if (produtoExistente.loja.usuarioId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este produto.',
      );
    }

    await this.prisma.produto.delete({ where: { id } });
  }

  // Produtos do usuário logado — equivalente ao findMyLojas
  async findMyProdutos(userId: number): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: { loja: { usuarioId: userId } },
      include: {
        subcategoria: true,
        loja: { select: { id: true, nome: true } },
      },
    });
  }
  async findAllFromStore(lojaId:number){
    return this.prisma.produto.findMany({
      // 1. Filtra pela lojaId
      where: {
        lojaId: lojaId,
      },
      
      // 2. Seleciona SÓ o que o ProductCard precisa (leve e rápido)
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
        loja: { 
          select: { 
            logo: true,
          } 
        },
        imagens: {
          take: 1, 
          orderBy: { ordem: 'asc' },
          select: { urlImagem: true }
        }
      },
    });
  }

  async ProcurarPorCategoria(slug: string) {
    const nomeDaCategoria = slug.toUpperCase() as CategoriasNome;
    return this.prisma.produto.findMany({
    
      //Filtra por caegoria
      where: {
        subcategoria: {
          categoria: { 
            nome: nomeDaCategoria
          }
        }
      },


      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
        
        loja: { 
          select: { 
            logo: true,
          } 
        },

        imagens: {
          take: 1, 
          orderBy: { ordem: 'asc' },
          select: { urlImagem: true }
        }

      }
    });
  }

  async listarProdutos(page: number, limit: number) {
    
    const skip = (page - 1) * limit;

    const produtosPromise = this.prisma.produto.findMany({
      orderBy: { id: 'desc' },
      take: limit,
      skip: skip,
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
        loja: { select: { logo: true } },
        imagens: {
          take: 1, 
          orderBy: { ordem: 'asc' },
          select: { urlImagem: true }
        }
      }
    });

    const totalProdutosPromise = this.prisma.produto.count();

    const [produtos, totalCount] = await this.prisma.$transaction([
      produtosPromise,
      totalProdutosPromise
    ]);

    return { produtos, totalCount };
  }
  async search(query: string) {
    const orConditions: Prisma.ProdutoWhereInput[] = [
      {
        nome: {
          contains: query,
          mode: 'insensitive', 
        },
      },
      {
        loja: {
          nome: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    ];
    const queryAsCategoria = query.toUpperCase() as CategoriasNome;
    if (Object.values(CategoriasNome).includes(queryAsCategoria)) {
      orConditions.push({
        subcategoria: {
          categoria: {
            nome: queryAsCategoria,
          },
        },
      });
    }
    return this.prisma.produto.findMany({
      where: {
        OR: orConditions, // Usa a lista de condições
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
        loja: { 
          select: { 
            logo: true,
          } 
        },
        imagens: {
          take: 1, 
          orderBy: { ordem: 'asc' },
          select: { urlImagem: true }
        }
      },
      take: 20,
    });
  }
}

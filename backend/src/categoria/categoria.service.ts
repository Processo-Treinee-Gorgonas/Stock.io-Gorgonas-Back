import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CategoriasNome } from '@prisma/client';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  // Métodos adicionais podem ser adicionados conforme necessário

  /**
   * Busca uma categoria pelo nome e retorna suas subcategorias.
   * Ex: Entrada "MERCADO" -> Retorna { id: 1, nome: "MERCADO", subcategorias: [...] }
   */
  async findOneByName(nome: string) {
    // Normaliza acentos e caixa para compatibilidade com enum Prisma
    const normalize = (s: string) => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
    const nomeEnum = normalize(nome) as CategoriasNome;

    // 2. Busca no banco
    const categoria = await this.prisma.categoria.findUnique({
      where: { 
        nome: nomeEnum 
      },
      // 3. O PULO DO GATO: Inclui as subcategorias na resposta
      include: {
        subcategorias: {
          orderBy: { nome: 'asc' } // Opcional: Ordena alfabeticamente
        }
      }
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria '${nome}' não encontrada.`);
    }

    return categoria;
  }

  async findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        subcategorias: {
          orderBy: { nome: 'asc' }
        }
      }
    });
  }

}
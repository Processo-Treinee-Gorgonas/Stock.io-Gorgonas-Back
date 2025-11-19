import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CategoriasNome } from '../../generated/prisma';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  // ... (seus outros métodos create, findAll, etc.)

  /**
   * Busca uma categoria pelo nome e retorna suas subcategorias.
   * Ex: Entrada "MERCADO" -> Retorna { id: 1, nome: "MERCADO", subcategorias: [...] }
   */
  async findOneByName(nome: string) {
    
    // 1. Converte a string (ex: "mercado") para o formato do Enum (ex: "MERCADO")
    // Isso evita erros se o front mandar minúsculo
    const nomeEnum = nome.toUpperCase() as CategoriasNome;

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
}
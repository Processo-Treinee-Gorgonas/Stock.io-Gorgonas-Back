-- CreateEnum
CREATE TYPE "CategoriasNome" AS ENUM ('MERCADO', 'FARMACIA', 'BELEZA', 'MODA', 'ELETRONICOS', 'JOGOS', 'BRINQUEDOS', 'CASA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(50) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senhaHash" VARCHAR(255) NOT NULL,
    "fotoPerfil" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loja" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "logo" TEXT,
    "banner" TEXT,
    "sticker" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" "CategoriasNome" NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Subcategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "lojaId" INTEGER NOT NULL,
    "subcategoriaId" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "estoque" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagemProduto" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "urlImagem" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "ImagemProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliacaoLoja" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "lojaId" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvaliacaoLoja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComentarioAvaliacaoLoja" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "avaliacaoLojaId" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComentarioAvaliacaoLoja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliacaoProduto" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvaliacaoProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComentarioAvaliacaoProduto" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "avaliacaoProdutoId" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComentarioAvaliacaoProduto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_userName_key" ON "Usuario"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Loja_nome_key" ON "Loja"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategoria_nome_categoriaId_key" ON "Subcategoria"("nome", "categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "ImagemProduto_ordem_produtoId_key" ON "ImagemProduto"("ordem", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoLoja_usuarioId_lojaId_key" ON "AvaliacaoLoja"("usuarioId", "lojaId");

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoProduto_usuarioId_produtoId_key" ON "AvaliacaoProduto"("usuarioId", "produtoId");

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategoria" ADD CONSTRAINT "Subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "Subcategoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagemProduto" ADD CONSTRAINT "ImagemProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoLoja" ADD CONSTRAINT "AvaliacaoLoja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoLoja" ADD CONSTRAINT "AvaliacaoLoja_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioAvaliacaoLoja" ADD CONSTRAINT "ComentarioAvaliacaoLoja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioAvaliacaoLoja" ADD CONSTRAINT "ComentarioAvaliacaoLoja_avaliacaoLojaId_fkey" FOREIGN KEY ("avaliacaoLojaId") REFERENCES "AvaliacaoLoja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoProduto" ADD CONSTRAINT "AvaliacaoProduto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoProduto" ADD CONSTRAINT "AvaliacaoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioAvaliacaoProduto" ADD CONSTRAINT "ComentarioAvaliacaoProduto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioAvaliacaoProduto" ADD CONSTRAINT "ComentarioAvaliacaoProduto_avaliacaoProdutoId_fkey" FOREIGN KEY ("avaliacaoProdutoId") REFERENCES "AvaliacaoProduto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
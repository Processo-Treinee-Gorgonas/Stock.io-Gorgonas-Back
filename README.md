# Stock.io-Gorgonas-Back
# Stock.io - API Backend

API RESTful desenvolvida para o sistema de gerenciamento de estoque Stock.io, como parte do [Processo Treinee Gorgonas].

## 🚀 Tecnologias

Este projeto foi construído com as seguintes tecnologias:

* **[NestJS](https://nestjs.com/)**: Um framework Node.js progressivo para construir aplicações server-side eficientes e escaláveis.
* **[Prisma](https://www.prisma.io/)**: Um ORM de próxima geração para Node.js e TypeScript.
* **[PostgreSQL](https://www.postgresql.org/)**: Um poderoso sistema de banco de dados relacional de código aberto.
* **[TypeScript](https://www.typescriptlang.org/)**: Um superconjunto de JavaScript que adiciona tipagem estática.

---

## 🏁 Começando

Siga estas instruções para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (v18 ou superior recomendado)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando.
* [Git](https://git-scm.com/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/Processo-Treinee-Gorgonas/Stock.io-Gorgonas-Back.git](https://github.com/Processo-Treinee-Gorgonas/Stock.io-Gorgonas-Back.git)
    cd Stock.io-Gorgonas-Back
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    * Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`:
        ```bash
        cp .env.example .env
        ```
    * Abra o arquivo `.env` e adicione a sua string de conexão do PostgreSQL:
        ```env
        # .env
        DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO"
        ```

4.  Execute as migrations do banco de dados:
    * Isso irá criar as tabelas no seu banco de dados com base no schema do Prisma.
    ```bash
    npx prisma migrate dev
    ```

5.  Gere o cliente do Prisma:
    ```bash
    npx prisma generate
    ```

---

## ▶️ Rodando a Aplicação

Após a instalação, você pode rodar a aplicação em diferentes modos:

```bash
# Modo de desenvolvimento (com watch)
$ npm run start:dev

# Modo de produção
$ npm run start:prod

# Apenas buildar o projeto
$ npm run build

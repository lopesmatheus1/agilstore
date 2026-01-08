# Gerenciamento de Produtos - AgilStore

![NodeJS](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Uma aplicação de gerenciamento de inventário AgilStore, desenvolvida em Node.js com, utilizando padrões como repository, service e controller, e persistência em arquivo JSON.

## Tecnologias Utilizadas

* **Node.js (v18+)**: Ambiente de execução.
* **JavaScript (ES Modules)**: Linguagem principal.
* **Zod**: Para validação de dados de entrada.
* **File System (fs/promises)**: Persistência de dados em arquivo JSON.
* **Readline**: Módulo nativo para interação via terminal.

## Funcionalidades

* **Adicionar Produto**: Cadastro com ID automático
* **Listar Produtos**: Visualização em tabela dos produtos
* **Atualizar Produto**: Edição de campos específicos via ID.
* **Excluir Produto**: Remoção por ID mediante confirmação.
* **Buscar Produto**: Busca por ID ou por nome parcial.
* **Persistência de Dados**: Salvamento automático em arquivo JSON .

## Estrutura do Projeto
```text
agilstore/
├── src/
│   ├── models/           # Entidades de domínio
│   ├── repositories/     # Acesso a dados e persistência
│   ├── services/         # Lógica de negócios
│   ├── controllers/      # Interação com usuário e validação
│   └── index.js          # Ponto de entrada e injeção de dependências
├── data/
│   └── database.json     # Persistência de dados (gerado automaticamente)
├── README.md
└── package.json

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/lopesmatheus1/
cd 
```
2. Instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Rode o terminal de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```


## Desenvolvimento
Desenvolvido como desafio de programação utilizando Nodejs e Javascript

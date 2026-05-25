# Sapé Pharma – Sistema de Vendas e Controle para Farmácia

## 📌 Sobre o Projeto

O **Sapé Pharma** é um sistema web desenvolvido para o gerenciamento de vendas, produtos, clientes e funcionários de uma farmácia.


## 👨‍💻 Participantes

* Daniel Henrique
* Paulo George
* Gustavo Fernando

---

## 🎯 Objetivo do Sistema

Automatizar e organizar o controle de vendas e cadastros de uma farmácia, permitindo o gerenciamento eficiente de:

* Produtos
* Categorias
* Clientes
* Dependentes
* Funcionários
* Vendedores
* Representantes
* Compras realizadas

O sistema busca reduzir erros manuais, melhorar o controle administrativo e centralizar as operações da farmácia.

---

## 🏗 Escopo do Projeto

O sistema permitirá:

* Cadastro e gerenciamento de produtos e categorias
* Controle de clientes e seus dependentes
* Registro de funcionários (vendedores e representantes)
* Controle de compras realizadas pelos clientes
* Associação de vendas aos vendedores responsáveis
* Controle de comissão de vendedores
* Controle de representantes responsáveis por categorias
* Cadastro de cartões de progressão funcional

---

## ⚙ Principais Funcionalidades

### 1. Cadastro de Produtos

Permite cadastrar produtos com:

* Código
* Descrição
* Unidade
* Valor unitário
* Categoria

### 2. Controle de Clientes e Dependentes

Cadastro completo de clientes e seus dependentes vinculados.

### 3. Registro de Compras e Vendas

Controle de compras realizadas, com produtos, quantidade e vendedor responsável.

### 4. Gestão de Funcionários

Cadastro e gerenciamento de:

* Vendedores
* Representantes

### 5. Progressão Funcional

Cadastro do cartão de progressão funcional exclusivo de cada vendedor.

---

## 🔁 CRUD Principal

### CRUD de Produtos e Vendas

Principal funcionalidade do sistema:

* Criar produtos
* Listar produtos
* Editar produtos
* Remover produtos
* Associar produtos às compras
* Controlar quantidade vendida
* Consultar histórico de vendas

---

## 🛠 Tecnologias Utilizadas

### Front-end

*React Native utilizando Expo
*TypeScript 
*Expo Router


### Back-end

* Node.js
* Express.js

### Banco de Dados

* MySQL

### Conteinerização

* Docker

### Orquestração

* Docker Compose

### Versionamento

* GitHub
* GitFlow

### Integração Contínua

* Jenkins

### Qualidade de Código

* SonarQube

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

É necessário ter instalado:

* Node.js
* Docker
* Docker Compose
* Git
* MySQL (caso rode sem Docker)

---

### Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/pharmastock.git
cd pharmastock
```

---

### Executar com Docker Compose

Antes de rodar o Compose, crie um arquivo `.env` na raiz com as variáveis do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=service_role_key_aqui
JWT_SECRET=uma-chave-secreta
```

```bash
docker-compose up --build
```

A aplicação ficará disponível em:

* Backend: http://localhost:3000
* Frontend: http://localhost:19006

---

### Executar Manualmente

#### Backend

```bash
cd api-supabase
npm install
npm run dev
```

O backend será executado na porta **3000**.

#### Frontend

```bash
cd ProjetoP5
npm install
npm start
```

---

## 🌿 Fluxo de Branches

Estrutura principal:

* `main` → versão estável pronta para entrega
* `develop` → desenvolvimento integrado
* `feature/*` → novas funcionalidades ou correções incrementais
* `hotfix/*` → correções urgentes em produção

Para um fluxo DevOps claro:

1. Crie branch de feature: `git checkout -b feature/<nome>`
2. Faça mudanças, teste localmente e valide builds
3. Commit com mensagem descritiva
4. Push para remoto e abra Pull Request
5. Aguarde aprovação antes de mesclar em `develop` ou `main`

---

## 🔍 Integração Contínua e Qualidade de Código

O projeto usa GitHub Actions como pipeline principal para:

* instalar dependências
* executar lint e testes no frontend
* executar build do frontend
* validar o backend com `node --check`
* rodar análise de qualidade com SonarCloud

### SonarCloud

A análise SonarCloud depende destes segredos no GitHub:

* `SONAR_TOKEN`
* `SONAR_ORGANIZATION`

Os resultados ajudam a identificar bugs, vulnerabilidades e code smells antes de mesclar.

---

## 📚 Conclusão

O projeto **Sapé Pharma** está organizado para suportar integração entre frontend, backend e banco de dados via Supabase.

A entrega foca em:

* pipeline automatizada com GitHub Actions
* análise de qualidade com SonarCloud
* execução local via Docker Compose e comandos manuais
* fluxo de branch claro para trabalho em equipe

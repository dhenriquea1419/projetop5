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

```bash
docker-compose up --build
```

---

### Executar Manualmente

### Backend

```bash
cd backend
npm install
npm start
```

> O backend será executado na porta **5000**

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🌿 Fluxo de Branches (GitFlow)

Estrutura principal:

* `main` → versão estável
* `develop` → desenvolvimento principal
* `feature/*` → novas funcionalidades
* `hotfix/*` → correções urgentes

---

## 🔍 Qualidade de Código

O projeto utiliza:

### Jenkins

Para automação de:

* Build
* Testes
* Integração contínua (CI)

### SonarQube

Para análise de:

* Bugs
* Vulnerabilidades
* Code Smells
* Qualidade geral do código

---

## 📚 Conclusão

O projeto **Sapé Pharma** foi escolhido por ser simples, viável e totalmente alinhado aos requisitos da disciplina de DevOps.

Ele permite aplicar de forma prática os principais conceitos estudados durante o semestre, com foco em desenvolvimento moderno, automação e boas práticas de engenharia de software.

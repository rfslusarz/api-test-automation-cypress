# Automação de Testes de API REST - Cypress

[![CI Status](https://github.com/rfslusarz/teste-apirest-cypress-qa-playground/actions/workflows/cypress.yml/badge.svg?branch=main)](https://github.com/rfslusarz/teste-apirest-cypress-qa-playground/actions/workflows/cypress.yml)
![Cypress](https://img.shields.io/badge/Cypress-15.x%2B-green?style=flat-square&logo=cypress)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-blue?style=flat-square&logo=node.js)
![Mochawesome](https://img.shields.io/badge/Mochawesome-7.x-orange?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI-blue?style=flat-square&logo=githubactions)
![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square&logo=opensourceinitiative)

Projeto de automação de testes de API REST com Cypress cobrindo operações CRUD completas (GET, POST, PUT, DELETE), validação de schema e tratamento de erros HTTP. Desenvolvido como projeto de portfólio e estudos.

**API alvo:** [QA Playground](https://playground-for-qa.vercel.app/playground) - seção "Testes de API REST"
**Backend:** [JSONPlaceholder](https://jsonplaceholder.typicode.com) (mock REST API publica)

---

## Visão Geral do Projeto

- Suíte de testes de API REST com Cypress cobrindo GET, POST, PUT e DELETE
- Arquitetura em camadas com separaçãoo entre cliente HTTP, validações e testes
- Validacao de schema de response (contract testing) em todos os endpoints
- Cenários negativos: 404, IDs inválidos e payloads inesperados
- Geração de relatório HTML com Mochawesome
- Pipeline CI/CD com GitHub Actions e upload de artefatos
- Retry automático configurado para estabilidade em CI

---


---

## Tecnologias

| Ferramenta | Função |
|------------|--------|
| Cypress 15.x | Framework de teste |
| Node.js 20.x | Runtime |
| JavaScript | Linguagem |
| Mochawesome | Relatórios |
| GitHub Actions | CI/CD |

---

## Pré-requisitos

✔ Node.js 20+  
✔ npm  

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/rfslusarz/api-test-automation-cypress

# 2. Entre no diretório
cd api-test-automation-cypress

# 3. Instale dependências
npm install

## Estrutura do Projeto

```
cypress/
 ├── e2e/
 │   └── api/
 │       └── users.cy.js       # Suíte principal (CRUD + cenarios negativos)
 ├── fixtures/
 │   └── users.json            # Dados de teste externalizados
 └── support/
     ├── apiClient.js          # Camada centralizadora de chamadas HTTP
     ├── validations.js        # Funcoes de validacao de schema reutilizaveis
     ├── commands.js           # Custom commands Cypress
     └── e2e.js                # Entry point do support
.github/
 └── workflows/
     └── cypress.yml           # Pipeline GitHub Actions
cypress.config.js              # Configuracao (baseUrl, retries, reporter, env)
package.json
README.md
.gitignore
```

---

## Cobertura de Testes

### Cenarios positivos

| Metodo | Endpoint | Cenario |
|---|---|---|
| GET | `/users` | Status 200, array nao vazio |
| GET | `/users` | Paginacao com `_page` e `_limit` |
| GET | `/users` | Paginas distintas retornam IDs diferentes |
| GET | `/users` | Validacao de schema de cada usuario |
| GET | `/users` | Tempo de resposta abaixo de 5000ms |
| GET | `/users/:id` | Status 200 e schema valido |
| GET | `/users/:id` | Campos opcionais (phone, website, address, geo) |
| POST | `/users` | Status 201 e ID gerado |
| POST | `/users` | Campos enviados espelhados na resposta |
| POST | `/users` | Payload minimo aceito |
| PUT | `/users/:id` | Status 200 e dados atualizados |
| PUT | `/users/:id` | ID preservado apos atualizacao |
| DELETE | `/users/:id` | Status 200 e body vazio |
| DELETE | `/users/:id` | Multiplos deletes sequenciais |

### Cenarios negativos (error handling)

| Cenario | Status esperado |
|---|---|
| GET `/users/9999` | 404 |
| GET `/users/invalid-id` | 404 |
| GET `/users/abc` | 404 |
| POST com payload vazio | 201 (comportamento documentado do mock) |
| PUT em ID inexistente | 200 ou 500 |
| DELETE `/users/9999` | 404 |

---

## Comandos Customizados

Localizados em `cypress/support/commands.js`:

| Comando | Descricao |
|---|---|
| `cy.apiGetUsers(page, limit)` | GET /users com paginacao |
| `cy.apiGetUserById(id)` | GET /users/:id |
| `cy.apiCreateUser(payload)` | POST /users |
| `cy.apiCreateUserAndGetId(payload)` | POST /users e retorna o ID criado |
| `cy.apiUpdateUser(id, payload)` | PUT /users/:id |
| `cy.apiDeleteUser(id)` | DELETE /users/:id |
| `cy.validateUserSchema(user)` | Valida schema de objeto usuario |
| `cy.logApiCall(method, endpoint, status)` | Log estruturado no terminal |

---

## Pre-requisitos

- Node.js 20+
- npm

---

## Instalacao

```bash
# Clone o repositorio
git clone <url-do-repositorio>
cd teste-apirest-cypress-qa-playground

# Instale as dependencias
npm install
```

---

## Execução dos Testes

### Modo interativo (UI)

```bash
npm test
```

### Modo headless com relatório

```bash
npm run test:headless
```

### Apenas testes de API

```bash
npm run test:api
```

### Modo CI (headless, Chrome)

```bash
npm run test:ci
```

---

## Relatórios Mochawesome

# 1. Gerar JSON de resultados
npm run test:headless

# 2. Gerar relatório HTML
npm run report:full

# 3. Abrir relatório no navegador
npm run report:open.

---

## CI/CD (GitHub Actions)

O pipeline e ativado automaticamente em push e pull request para `main`.

### Etapas do Pipeline

1. Checkout do código
2. Setup Node.js 20 com cache de npm
3. Instalação de dependencias com `npm ci`
4. Verificação da versão do Cypress
5. Execução dos testes em modo headless (Chrome)
6. Upload de screenshots de falhas como artefato (retenção: 7 dias)
7. Upload de videos como artefato (retenção: 7 dias)
8. Upload do relatorio Mochawesome (retenção: 30 dias)

### Variaveis no CI

| Variável | Valor padrão |
|---|---|
| `CYPRESS_API_BASE_URL` | `https://jsonplaceholder.typicode.com` |
| `CYPRESS_API_TIMEOUT` | `15000` |

---

## Variáveis de Ambiente (local)

Crie `cypress.env.json` na raiz (não versionado):

```json
{
  "API_BASE_URL": "https://jsonplaceholder.typicode.com",
  "API_TIMEOUT": 20000
}
```

Ou via CLI:

```bash
# Linux / Mac
cypress run --env API_TIMEOUT=20000

# Windows PowerShell
$env:CYPRESS_API_TIMEOUT="20000"; npx cypress run

# Windows CMD
set CYPRESS_API_TIMEOUT=20000 && npx cypress run
```

---


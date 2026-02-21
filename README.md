# Automacao de Testes de API REST - Cypress

[![CI Status](https://github.com/rfslusarz/teste-apirest-cypress-qa-playground/actions/workflows/cypress.yml/badge.svg?branch=main)](https://github.com/rfslusarz/teste-apirest-cypress-qa-playground/actions/workflows/cypress.yml)
![Cypress](https://img.shields.io/badge/Cypress-15.x%2B-green?style=flat-square&logo=cypress)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-blue?style=flat-square&logo=node.js)
![Mochawesome](https://img.shields.io/badge/Mochawesome-7.x-orange?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI-blue?style=flat-square&logo=githubactions)
![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square&logo=opensourceinitiative)

Projeto de automacao de testes de API REST com Cypress cobrindo operacoes CRUD completas (GET, POST, PUT, DELETE), validacao de schema e tratamento de erros HTTP. Desenvolvido como projeto de portfolio de QA Engineer.

**API alvo:** [QA Playground](https://playground-for-qa.vercel.app/playground) - secao "Testes de API REST"
**Backend:** [JSONPlaceholder](https://jsonplaceholder.typicode.com) (mock REST API publica)

---

## Demonstracoes

- **[GitHub Actions](https://github.com/rfslusarz/teste-apirest-cypress-qa-playground/actions)** - Pipeline CI/CD com execucao headless e upload de artefatos

---

## Visao Geral do Projeto

- Suite de testes de API REST com Cypress cobrindo GET, POST, PUT e DELETE
- Arquitetura em camadas com separacao entre cliente HTTP, validacoes e testes
- Validacao de schema de response (contract testing) em todos os endpoints
- Cenarios negativos: 404, IDs invalidos e payloads inesperados
- Geracao de relatorio HTML com Mochawesome
- Pipeline CI/CD com GitHub Actions e upload de artefatos
- Retry automatico configurado para estabilidade em CI

---

## Tecnologias

| Ferramenta | Funcao |
|---|---|
| Cypress 15.x | Framework de testes de API |
| Node.js 20.x | Runtime |
| JavaScript | Linguagem |
| Mochawesome | Relatorios HTML profissionais |
| GitHub Actions | CI/CD |

---

## Estrutura do Projeto

```
cypress/
 ├── e2e/
 │   └── api/
 │       └── users.cy.js       # Suite principal (CRUD + cenarios negativos)
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

## Execucao dos Testes

### Modo interativo (UI)

```bash
npm test
```

### Modo headless com relatorio

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

## Relatorios Mochawesome

```bash
# 1. Executar testes gerando JSON de resultados
npm run test:headless

# 2. Gerar relatorio HTML
npm run report:full

# 3. Abrir relatorio no navegador (Windows)
npm run report:open
```

O relatorio e gerado em `cypress/reports/html/index.html`.

---

## CI/CD (GitHub Actions)

O pipeline e ativado automaticamente em push e pull request para `main`.

### Etapas do Pipeline

1. Checkout do codigo
2. Setup Node.js 20 com cache de npm
3. Instalacao de dependencias com `npm ci`
4. Verificacao da versao do Cypress
5. Execucao dos testes em modo headless (Chrome)
6. Upload de screenshots de falhas como artefato (retencao: 7 dias)
7. Upload de videos como artefato (retencao: 7 dias)
8. Upload do relatorio Mochawesome (retencao: 30 dias)

### Variaveis no CI

| Variavel | Valor padrao |
|---|---|
| `CYPRESS_API_BASE_URL` | `https://jsonplaceholder.typicode.com` |
| `CYPRESS_API_TIMEOUT` | `15000` |

---

## Variaveis de Ambiente (local)

Crie `cypress.env.json` na raiz (nao versionado):

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

## Decisoes Tecnicas

**Por que Cypress para testes de API?**
`cy.request()` integra chamadas HTTP ao mesmo ciclo de vida dos testes, compartilhando configuracoes, retries e relatorios. Ideal para portfolios que combinam testes de API e E2E.

**Limitacoes do JSONPlaceholder**
`POST`, `PUT` e `DELETE` sao simulados sem persistencia de dados. Todos os testes documentam e consideram esse comportamento com comentarios explicativos.

**Retries automaticos**
2 tentativas em `runMode` (CI) e 1 em `openMode`. Reduz falsos negativos por instabilidade de rede.

---

## Seguranca da Informacao

Este projeto foi desenvolvido exclusivamente para fins de estudo e portfolio.

- Utiliza apenas a API publica JSONPlaceholder para demonstracao
- Nao contem credenciais reais, dados pessoais ou informacoes sensiveis
- Nenhuma chave, token ou segredo e versionado no repositorio
- Variaveis sensiveis sao gerenciadas via `cypress.env.json` (ignorado pelo Git) e GitHub Secrets

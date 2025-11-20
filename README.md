# Alura Cypress - Automatizando Testes E2E

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)]()
[![License](https://img.shields.io/badge/License-ISC-blue)]()
[![Cypress](https://img.shields.io/badge/Cypress-13.6.4-green)]()

Projeto educacional da **Alura** para aprender sobre testes automatizados end-to-end (E2E) usando o **Cypress**. Este repositório contém exemplos práticos de testes para uma aplicação de adoção de animais (AdoPet).

## 📋 Sumário

- [Descrição do Projeto](#descrição-do-projeto)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar os Testes](#como-executar-os-testes)
- [Testes Disponíveis](#testes-disponíveis)
- [Documentação](#documentação)
- [Stack Tecnológico](#stack-tecnológico)
- [Autor](#autor)

---

## Descrição do Projeto

Este projeto faz parte do curso **"Cypress: Automatizando Testes E2E"** da Alura e demonstra como implementar testes automatizados de ponta a ponta usando Cypress em uma aplicação real.

### Objetivos de Aprendizado

✅ Entender os fundamentos de testes E2E  
✅ Aprender Cypress do básico ao avançado  
✅ Implementar testes de autenticação  
✅ Testar fluxos de cadastro e login  
✅ Trabalhar com fixtures e dados de teste  
✅ Usar comandos customizados  
✅ Realizar testes de API  
✅ Implementar padrões como Page Object  
✅ Gerar relatórios de testes  

---

## Estrutura do Repositório

```
Alura-Cypress-Automatizando-Testes-E2E/
├── cypress/
│   ├── e2e/                          # Testes end-to-end
│   │   ├── api-mensagens.cy.js       # Testes de API de mensagens
│   │   ├── cadastro-correto.cy.js    # Testes de cadastro válido
│   │   ├── cadastro-incorreto.cy.js  # Testes de validação de cadastro
│   │   ├── cadastro-massa.cy.js      # Testes com massa de dados
│   │   ├── login-correto.cy.js       # Testes de login
│   │   └── spec.cy.js                # Exemplo inicial de teste
│   │
│   ├── fixtures/                     # Dados para testes
│   │   ├── example.json              # Exemplo de fixture
│   │   └── usuarios.json             # Dados de usuários para testes
│   │
│   └── support/                      # Configurações e helpers
│       ├── commands.js               # Comandos customizados do Cypress
│       └── e2e.js                    # Configuração global de testes E2E
│
├── cypress.config.js                 # Configuração do Cypress
├── package.json                      # Dependências do projeto
├── package-lock.json                 # Lock file de dependências
│
├── DOCUMENTACAO_JAVASCRIPT.md         # Guia de fundamentos JavaScript
├── DOCUMENTACAO_JSON.md              # Guia de fundamentos JSON
├── DOCUMENTACAO_CYPRESS.md           # Guia de fundamentos Cypress
│
└── README.md                         # Este arquivo
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v14 ou superior)
  - [Download Node.js](https://nodejs.org/)
  - Verificar instalação: `node --version`

- **npm** (geralmente vem com Node.js)
  - Verificar instalação: `npm --version`

- **Git** (para clonar o repositório)
  - [Download Git](https://git-scm.com/)

---

## Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/gabrielsalesdavid/Alura-Cypress-Automatizando-Testes-E2E.git
cd Alura-Cypress-Automatizando-Testes-E2E
```

### 2. Instalar Dependências

```bash
npm install
```

Este comando instalará o Cypress e todas as dependências especificadas no `package.json`.

### 3. Verificar Instalação

```bash
npx cypress --version
```

---

## Como Executar os Testes

### Modo Interativo (Test Runner)

Abre a interface gráfica do Cypress para visualizar e executar testes em tempo real:

```bash
npx cypress open
```

Isso abrirá o Cypress Test Runner onde você pode:
- Selecionar navegador (Chrome, Firefox, Edge)
- Escolher qual arquivo de teste executar
- Ver a execução do teste em tempo real
- Inspecionar elementos e comandos
- Ver vídeos de falhas

### Modo Headless

Executa os testes em background sem interface gráfica:

```bash
# Executar todos os testes
npx cypress run

# Executar arquivo específico
npx cypress run cypress/e2e/login-correto.cy.js

# Executar com navegador específico
npx cypress run --browser chrome

# Executar em paralelo
npx cypress run --parallel --record
```

### Gerar Relatórios

Os relatórios são gerados automaticamente em `cypress/results/` com formato mochawesome.

---

## Testes Disponíveis

### 📝 Testes de Login

**Arquivo:** `cypress/e2e/login-correto.cy.js`

Valida o comportamento da página de login:
- ✅ Verificação de mensagens de erro obrigatórias
- ✅ Teste com credenciais válidas
- ✅ Teste com falha de autenticação
- ✅ Uso de stubs para simular respostas da API

```bash
npx cypress run cypress/e2e/login-correto.cy.js
```

### 📝 Testes de Cadastro - Caso Correto

**Arquivo:** `cypress/e2e/cadastro-correto.cy.js`

Valida o fluxo correto de cadastro:
- ✅ Preenchimento de formulário
- ✅ Envio de dados
- ✅ Validação de sucesso

```bash
npx cypress run cypress/e2e/cadastro-correto.cy.js
```

### 📝 Testes de Cadastro - Validações

**Arquivo:** `cypress/e2e/cadastro-incorreto.cy.js`

Valida comportamento com dados inválidos:
- ✅ Campos obrigatórios
- ✅ Formato de email inválido
- ✅ Senhas fraca
- ✅ Mensagens de erro

```bash
npx cypress run cypress/e2e/cadastro-incorreto.cy.js
```

### 📝 Testes de Cadastro - Massa de Dados

**Arquivo:** `cypress/e2e/cadastro-massa.cy.js`

Testa múltiplos cenários com dados do arquivo `fixtures/usuarios.json`:
- ✅ Teste parametrizado
- ✅ Múltiplos usuários
- ✅ Diferentes cenários

```bash
npx cypress run cypress/e2e/cadastro-massa.cy.js
```

### 📝 Testes de API

**Arquivo:** `cypress/e2e/api-mensagens.cy.js`

Testa endpoints da API:
- ✅ Requisições GET, POST, PUT, DELETE
- ✅ Validação de respostas
- ✅ Códigos de status HTTP
- ✅ Estrutura de dados retornados

```bash
npx cypress run cypress/e2e/api-mensagens.cy.js
```

---

## Dados de Teste

### Arquivo: `cypress/fixtures/usuarios.json`

Contém dados de usuários para testes parametrizados:

```json
{
  "usuarios": [
    {
      "email": "maria@gmail.com",
      "senha": "Senha123"
    },
    {
      "email": "joao@gmail.com",
      "senha": "OutraSenha456"
    }
  ]
}
```

Use em seus testes:

```javascript
cy.fixture('usuarios').then((dados) => {
  cy.login(dados.usuarios[0].email, dados.usuarios[0].senha)
})
```

---

## Comandos Customizados

### Arquivo: `cypress/support/commands.js`

Define comandos reutilizáveis:

```javascript
// Comando de login
cy.login(email, senha)
```

Exemplo de uso:

```javascript
cy.login('maria@gmail.com', 'Senha123')
```

---

## Documentação

Este repositório contém documentação detalhada sobre os fundamentos das tecnologias utilizadas:

### 📚 DOCUMENTACAO_JAVASCRIPT.md
Guia completo de JavaScript com tópicos como:
- Variáveis e tipos de dados
- Funções e closures
- Objetos e Arrays
- Promessas e Async/Await
- Boas práticas

### 📚 DOCUMENTACAO_JSON.md
Guia de JSON com:
- Estrutura e tipos de dados
- Sintaxe e validação
- Exemplos práticos
- Comparação com JavaScript

### 📚 DOCUMENTACAO_CYPRESS.md
Guia completo de Cypress com:
- Conceitos básicos e configuração
- Seletores (CSS, XPath, data-test)
- Comandos essenciais
- Asserções
- Boas práticas e padrões
- Page Object Pattern
- Debugging

---

## Stack Tecnológico

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Node.js** | 14+ | Runtime JavaScript |
| **npm** | 6+ | Gerenciador de pacotes |
| **Cypress** | 13.6.4 | Framework de testes E2E |
| **JavaScript** | ES6+ | Linguagem de programação |
| **Mochawesome** | Latest | Reporter de testes |

---

## URL da Aplicação Testada

A aplicação sendo testada é o **AdoPet**:
- 🔗 Frontend: https://adopet-frontend-cypress.vercel.app/
- 🔗 API: https://adopet-api-i8qu.onrender.com

---

## Exemplos de Uso

### Executar um teste específico

```bash
npx cypress run cypress/e2e/login-correto.cy.js
```

### Abrir interface interativa

```bash
npx cypress open
```

### Executar todos os testes em Chrome

```bash
npx cypress run --browser chrome
```

### Executar com mais detalhes (debug)

```bash
DEBUG=cypress:* npx cypress run
```

---

## Boas Práticas Implementadas

✅ **Data-test attributes**: Uso de `data-test` para seleção de elementos  
✅ **Fixtures**: Dados separados em arquivos JSON  
✅ **Comandos customizados**: Reutilização de código  
✅ **Interceptação de API**: Mock de requisições  
✅ **Estrutura clara**: Describe e It bem organizados  
✅ **BeforeEach**: Setup antes de cada teste  

---

## Troubleshooting

### Problema: "cypress not found"

```bash
# Solução: Reinstalar dependências
npm install
```

### Problema: "Timed out"

```bash
# Aumente o timeout na configuração cypress.config.js
defaultCommandTimeout: 6000  // 6 segundos
```

### Problema: Testes falhando por elementos não encontrados

- Use `data-test` attributes em vez de classes/IDs
- Verifique se a aplicação está acessível
- Aumente o `timeout` se necessário

---

## Contribuição

Este é um projeto educacional. Sinta-se livre para:
- 🔀 Fazer fork do projeto
- 📝 Melhorar a documentação
- ✨ Adicionar novos testes
- 🐛 Reportar problemas

---

## Autor

**Gabriel Sales David**

- 🔗 GitHub: [@gabrielsalesdavid](https://github.com/gabrielsalesdavid)
- 🔗 Repositório: [Alura-Cypress-Automatizando-Testes-E2E](https://github.com/gabrielsalesdavid/Alura-Cypress-Automatizando-Testes-E2E)

---

## Licença

ISC License © 2025

---

## Recursos Úteis

- [Documentação Cypress](https://docs.cypress.io/)
- [Curso Alura - Cypress](https://www.alura.com.br/)
- [MDN - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [JSON Official](https://www.json.org/json-pt.html)

---

## Últimas Atualizações

- ✨ Documentação completa de JavaScript, JSON e Cypress
- 📝 README com estrutura detalhada
- 🧪 Suite de testes E2E funcional
- 📊 Relatórios automáticos com Mochawesome

---

**Última atualização:** 20 de novembro de 2025


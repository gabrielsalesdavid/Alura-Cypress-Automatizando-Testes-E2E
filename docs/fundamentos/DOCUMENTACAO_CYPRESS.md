# Fundamentos de Cypress

## 📋 Índice
1. [Introdução](#introdução)
2. [Conceitos Básicos](#conceitos-básicos)
3. [Seletores](#seletores)
4. [Comandos Essenciais](#comandos-essenciais)
5. [Asserções](#asserções)
6. [Estrutura de Testes](#estrutura-de-testes)
7. [Boas Práticas](#boas-práticas)

---

## Introdução

Cypress é um framework de testes end-to-end (E2E) moderno e poderoso para aplicações web. Escrito em JavaScript, oferece uma experiência de desenvolvimento superior com uma interface amigável.

**Características principais:**
- Testes E2E rápidos e confiáveis
- Interface interativa (Test Runner)
- Debugging visual
- Suporte para testes de API
- Excelente documentação
- Execução paralela
- Compatível com CI/CD

**Quando usar:**
- Testes de interface de usuário
- Fluxos de usuário completos
- Validações de comportamento
- Testes de API
- Regressão visual

---

## Conceitos Básicos

### Instalação e Configuração

```bash
npm install cypress --save-dev
npx cypress open
```

### Estrutura de Projeto

```
cypress/
├── e2e/                    # Testes de ponta a ponta
│   ├── cadastro.cy.js
│   ├── login.cy.js
│   └── compra.cy.js
├── fixtures/               # Dados para testes
│   ├── usuarios.json
│   └── produtos.json
├── support/                # Helpers e configurações
│   ├── commands.js         # Comandos customizados
│   └── e2e.js             # Setup/teardown
└── screenshots/            # Capturas de tela (automático)
└── videos/                 # Gravações (automático)
```

### Arquivo de Configuração

```javascript
// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "d12gpp",
  e2e: {
    baseUrl: "https://exemplo.com",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 4000,
    requestTimeout: 5000,
    responseTimeout: 5000,
    pageLoadTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implementar listeners aqui
    }
  }
});
```

---

## Seletores

Cypress oferece várias formas de selecionar elementos:

### 1. CSS Selectors

```javascript
// Por ID
cy.get('#botao-login')

// Por classe
cy.get('.mensagem-erro')

// Por tag
cy.get('button')

// Por atributo
cy.get('[name="email"]')
cy.get('[data-test="submit-button"]')

// Combinados
cy.get('div.container input[type="text"]')
```

### 2. XPath (não recomendado)

```javascript
cy.get('//button[contains(text(), "Login")]')
```

### 3. Atributos Customizados (Recomendado)

```html
<!-- HTML -->
<button data-test="login-button">Entrar</button>
```

```javascript
// Cypress
cy.get('[data-test="login-button"]')
```

### 4. Buscando por Texto

```javascript
cy.contains('Entrar')           // Qualquer elemento com esse texto
cy.contains('button', 'Entrar') // Button com esse texto
```

### 5. Combinando Seletores

```javascript
cy.get('.form').within(() => {
  cy.get('input[name="email"]').type('joao@email.com')
})
```

### 6. Filtrando Elementos

```javascript
cy.get('button')
  .filter('.active')           // Filtra elementos com classe
  
cy.get('li')
  .first()                      // Primeiro elemento
  .last()                       // Último elemento
  .eq(2)                        // Elemento em índice específico
```

---

## Comandos Essenciais

### Navegação

```javascript
// Visitar URL
cy.visit('https://exemplo.com')
cy.visit('https://exemplo.com/cadastro')

// Voltar na história do navegador
cy.go('back')
cy.go('forward')
cy.go(-1)
```

### Interação

```javascript
// Digitar texto
cy.get('input[type="email"]').type('joao@email.com')

// Limpar campo
cy.get('input').clear()

// Clicar
cy.get('button').click()
cy.get('.link').click({ force: true })  // Forçar clique

// Duplo clique
cy.get('input').dblclick()

// Clique direito
cy.get('elemento').rightclick()

// Hover
cy.get('.menu-item').trigger('mouseover')

// Enviar formulário
cy.get('form').submit()
```

### Verificação de Elementos

```javascript
// Verificar visibilidade
cy.get('.elemento').should('be.visible')
cy.get('.elemento').should('not.be.visible')

// Verificar existência
cy.get('.elemento').should('exist')

// Verificar se está desabilitado
cy.get('button').should('be.disabled')

// Verificar se tem classe
cy.get('.item').should('have.class', 'ativo')

// Verificar atributo
cy.get('input').should('have.attr', 'placeholder', 'Email')

// Verificar texto
cy.get('h1').should('have.text', 'Bem-vindo')
cy.get('p').should('contain.text', 'olá')
```

### Esperas

```javascript
// Espera automática (4s padrão)
cy.get('.elemento-que-aparece')

// Espera explícita
cy.wait(2000)

// Esperar por requisição
cy.intercept('GET', '/api/usuarios').as('buscarUsuarios')
cy.get('button').click()
cy.wait('@buscarUsuarios')

// Esperar por elemento
cy.get('.loading', { timeout: 10000 })
```

### Manipulação de DOM

```javascript
// Obter texto
cy.get('h1').then(($el) => {
  const texto = $el.text()
  console.log(texto)
})

// Obter valor de input
cy.get('input').invoke('val').then((valor) => {
  console.log(valor)
})

// Invocar método
cy.get('textarea').invoke('val', 'novo conteúdo')

// Verificar propriedades CSS
cy.get('.box').should('have.css', 'background-color', 'rgb(0, 0, 0)')
```

---

## Asserções

Cypress usa a biblioteca Chai para asserções:

### Existência e Visibilidade

```javascript
cy.get('.elemento').should('exist')
cy.get('.elemento').should('be.visible')
cy.get('.elemento').should('be.hidden')
cy.get('.elemento').should('not.exist')
```

### Texto

```javascript
cy.get('h1').should('have.text', 'Título exato')
cy.get('p').should('contain.text', 'parte do texto')
cy.get('button').should('not.contain.text', 'Deletar')
```

### Classes e Atributos

```javascript
cy.get('.item').should('have.class', 'ativo')
cy.get('.item').should('not.have.class', 'desabilitado')

cy.get('input').should('have.attr', 'type', 'email')
cy.get('input').should('have.attr', 'required')
```

### Comprimento

```javascript
cy.get('li').should('have.length', 5)
cy.get('li').should('have.length.greaterThan', 3)
cy.get('li').should('have.length.lessThan', 10)
```

### Valores

```javascript
cy.get('input').should('have.value', 'joao@email.com')
cy.get('.contador').should('contain', '10')
```

### Estado

```javascript
cy.get('button').should('be.enabled')
cy.get('button').should('be.disabled')
cy.get('input[type="checkbox"]').should('be.checked')
```

### CSS e Posicionamento

```javascript
cy.get('.box').should('have.css', 'display', 'block')
cy.get('.box').should('be.inViewport')
```

---

## Estrutura de Testes

### Describe e It

```javascript
describe('Página de Cadastro', () => {
  // Bloco de setup executado antes de cada teste
  beforeEach(() => {
    cy.visit('https://exemplo.com/cadastro')
  })

  // Teste individual
  it('Deve exibir formulário de cadastro', () => {
    cy.get('form').should('be.visible')
    cy.get('input[name="nome"]').should('exist')
  })

  // Outro teste
  it('Deve cadastrar novo usuário com sucesso', () => {
    cy.get('input[name="nome"]').type('João Silva')
    cy.get('input[name="email"]').type('joao@email.com')
    cy.get('input[name="senha"]').type('Senha123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
  })

  // Setup executado após todos os testes
  afterEach(() => {
    // Limpeza
  })
})
```

### Hooks

```javascript
describe('Suite de Testes', () => {
  // Executado uma vez antes de todos os testes
  before(() => {
    cy.visit('https://exemplo.com')
  })

  // Executado antes de cada teste
  beforeEach(() => {
    cy.login('usuario@email.com', 'senha123')
  })

  // Executado depois de cada teste
  afterEach(() => {
    cy.logout()
  })

  // Executado uma vez depois de todos os testes
  after(() => {
    // Limpeza final
  })

  it('Teste 1', () => {
    // Corpo do teste
  })

  it('Teste 2', () => {
    // Corpo do teste
  })
})
```

---

## Boas Práticas

### 1. Comandos Customizados

```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (email, senha) => {
  cy.get('[data-test="input-loginEmail"]').type(email)
  cy.get('[data-test="input-loginPassword"]').type(senha)
  cy.get('[data-test="submit-button"]').click()
})

// Usar no teste
cy.login('joao@email.com', 'Senha123')
```

### 2. Fixtures (Dados de Teste)

```javascript
// cypress/fixtures/usuarios.json
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

```javascript
// Usar no teste
cy.fixture('usuarios').then((dados) => {
  cy.login(dados.usuarios[0].email, dados.usuarios[0].senha)
})
```

### 3. Page Object Pattern

```javascript
// cypress/support/pages/LoginPage.js
class LoginPage {
  visitarPagina() {
    cy.visit('https://exemplo.com/login')
  }

  preencherEmail(email) {
    cy.get('[data-test="email"]').type(email)
    return this
  }

  preencherSenha(senha) {
    cy.get('[data-test="senha"]').type(senha)
    return this
  }

  clicarBotaoEntrar() {
    cy.get('[data-test="btn-login"]').click()
    return this
  }

  verificarErro() {
    cy.contains('Credenciais inválidas').should('be.visible')
  }
}

export default LoginPage
```

```javascript
// Usar no teste
import LoginPage from '../support/pages/LoginPage'

describe('Login', () => {
  it('Login com credenciais válidas', () => {
    const loginPage = new LoginPage()
    loginPage.visitarPagina()
    loginPage.preencherEmail('joao@email.com')
    loginPage.preencherSenha('Senha123')
    loginPage.clicarBotaoEntrar()
  })
})
```

### 4. Usar data-test Attributes

```html
<!-- ✅ BOM -->
<button data-test="login-button">Entrar</button>

<!-- ❌ EVITAR -->
<button class="btn btn-primary mt-2">Entrar</button>
```

### 5. Estrutura Clara

```javascript
// ✅ BOM
describe('Cadastro de Usuário', () => {
  beforeEach(() => {
    cy.visit('/cadastro')
  })

  it('Deve cadastrar com sucesso preenchendo todos os campos', () => {
    // Arrange - Preparar dados
    const novoUsuario = {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'Senha123'
    }

    // Act - Realizar ação
    cy.get('[data-test="nome"]').type(novoUsuario.nome)
    cy.get('[data-test="email"]').type(novoUsuario.email)
    cy.get('[data-test="senha"]').type(novoUsuario.senha)
    cy.get('[data-test="btn-cadastro"]').click()

    // Assert - Verificar resultado
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
  })
})
```

### 6. Evitar Anti-padrões

```javascript
// ❌ RUIM - Esperas hardcoded
cy.wait(5000)

// ✅ BOM - Esperar por elemento específico
cy.get('.loading').should('not.exist')

// ❌ RUIM - Seletores frágeis
cy.get('.btn:eq(2)')

// ✅ BOM - Usar data-test
cy.get('[data-test="btn-submit"]')

// ❌ RUIM - Testes interdependentes
it('Teste 1', () => {
  cy.login() // Espera que login tenha funcionado
})

// ✅ BOM - Testes independentes
beforeEach(() => {
  cy.login()
})

it('Teste 1', () => {
  // Já está logado
})
```

### 7. Testes de API

```javascript
cy.request({
  method: 'POST',
  url: '/api/usuarios',
  body: {
    nome: 'João',
    email: 'joao@email.com'
  }
}).then((resposta) => {
  expect(resposta.status).to.equal(201)
  expect(resposta.body.id).to.exist
})
```

### 8. Mock de Requisições

```javascript
cy.intercept('GET', '/api/usuarios', {
  statusCode: 200,
  body: [
    { id: 1, nome: 'João' },
    { id: 2, nome: 'Maria' }
  ]
}).as('buscarUsuarios')

cy.visit('/usuarios')
cy.wait('@buscarUsuarios')
cy.get('li').should('have.length', 2)
```

---

## Dicas de Debugging

```javascript
// Imprimir informações no console
cy.get('.elemento').then(($el) => {
  console.log($el)
})

// Pausar a execução
cy.pause()

// Passo a passo
cy.step('Visitando página')
cy.visit('/')

// Debug mode
DEBUG=cypress:* npm test
```

---

## Executar Testes

```bash
# Abrir Test Runner (interface gráfica)
npx cypress open

# Executar em modo headless
npx cypress run

# Executar arquivo específico
npx cypress run cypress/e2e/login.cy.js

# Executar com navegador específico
npx cypress run --browser chrome

# Executar em paralelo
npx cypress run --parallel --record
```

---

## Referências

- [Documentação Oficial Cypress](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Cypress Real World Example](https://github.com/cypress-io/cypress-realworld-app)


# Conceitos Avançados de Cypress

## 📋 Índice
1. [Interceptação de Rede](#interceptação-de-rede)
2. [Testes de Componentes](#testes-de-componentes)
3. [Variáveis e Fixtures Dinâmicas](#variáveis-e-fixtures-dinâmicas)
4. [Testes de Performance](#testes-de-performance)
5. [Padrões de Teste Avançados](#padrões-de-teste-avançados)
6. [Retry e Flakiness](#retry-e-flakiness)
7. [Testes Visuais (Visual Regression)](#testes-visuais-visual-regression)
8. [CI/CD com Cypress](#cicd-com-cypress)
9. [Debugging Avançado](#debugging-avançado)
10. [Plugins e Extensões](#plugins-e-extensões)

---

## Interceptação de Rede

### Interceptar e Mockar Requisições

```javascript
describe('Interceptação de Rede', () => {
  it('Mockar resposta de API', () => {
    // Interceptar GET
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
  })

  it('Mockar com delay', () => {
    cy.intercept('GET', '/api/usuarios', (req) => {
      req.reply((res) => {
        res.delay(2000) // Simular latência
        res.send({
          statusCode: 200,
          body: [{ id: 1, nome: 'João' }]
        })
      })
    }).as('buscarComDelay')

    cy.visit('/usuarios')
    cy.wait('@buscarComDelay')
  })

  it('Mockar erro de rede', () => {
    cy.intercept('GET', '/api/usuarios', {
      statusCode: 500,
      body: { erro: 'Erro interno do servidor' }
    }).as('erro')

    cy.visit('/usuarios')
    cy.wait('@erro')
    cy.contains('Erro ao carregar usuários').should('be.visible')
  })

  it('Modificar requisição', () => {
    cy.intercept('POST', '/api/usuarios', (req) => {
      // Modificar corpo da requisição
      req.body.nome = req.body.nome.toUpperCase()
      
      req.reply({
        statusCode: 201,
        body: { id: 1, ...req.body }
      })
    }).as('criarUsuario')

    cy.visit('/cadastro')
    cy.get('input[name="nome"]').type('João')
    cy.get('button').click()
    cy.wait('@criarUsuario')
  })

  it('Interceptar múltiplas requisições', () => {
    cy.intercept('GET', '/api/usuarios', { body: [] }).as('usuarios')
    cy.intercept('GET', '/api/perfil', { body: { nome: 'Meu Perfil' } }).as('perfil')

    cy.visit('/dashboard')
    cy.wait(['@usuarios', '@perfil'])
  })
})
```

### Validar Requisições

```javascript
it('Validar dados enviados na requisição', () => {
  cy.intercept('POST', '/api/usuarios', (req) => {
    // Verificar que foi enviado nome
    expect(req.body).to.have.property('nome')
    expect(req.body.nome).to.equal('João Silva')
    
    req.reply({ statusCode: 201 })
  }).as('criar')

  cy.visit('/cadastro')
  cy.get('input[name="nome"]').type('João Silva')
  cy.get('button[type="submit"]').click()
  cy.wait('@criar')
})
```

---

## Testes de Componentes

Cypress pode testar componentes individuais (funcionalidade experimental):

```javascript
// cypress/e2e/componente.cy.js
import Button from '../components/Button'

describe('Componente Button', () => {
  it('Deve renderizar texto do botão', () => {
    cy.mount(<Button label="Clique aqui" />)
    cy.get('button').should('contain.text', 'Clique aqui')
  })

  it('Deve chamar callback ao clicar', () => {
    const handleClick = cy.spy()
    cy.mount(<Button label="Click" onClick={handleClick} />)
    cy.get('button').click()
    // Verificar que callback foi chamado
  })

  it('Deve desabilitar botão', () => {
    cy.mount(<Button label="Desabilitado" disabled={true} />)
    cy.get('button').should('be.disabled')
  })
})
```

---

## Variáveis e Fixtures Dinâmicas

### Fixtures com Dados Dinâmicos

```javascript
// cypress/fixtures/usuarios.json
{
  "usuarios": [
    {
      "email": "maria@gmail.com",
      "senha": "Senha123",
      "timestamp": "{{ timestamp }}"
    }
  ]
}
```

```javascript
// cypress/e2e/fixtures-dinamicas.cy.js
describe('Fixtures Dinâmicas', () => {
  it('Usar fixture com dados processados', () => {
    cy.fixture('usuarios').then((usuarios) => {
      // Processar dados
      const usuarioValido = usuarios.usuarios[0]
      
      cy.login(usuarioValido.email, usuarioValido.senha)
    })
  })

  it('Gerar fixtures dinamicamente', function() {
    const usuario = {
      email: `usuario${Date.now()}@gmail.com`,
      senha: 'Senha123',
      nome: 'Teste'
    }

    cy.visit('/cadastro')
    cy.preencherFormulario(usuario)
    cy.get('button').click()
    cy.contains('Cadastro realizado').should('be.visible')
  })
})
```

### Variáveis de Ambiente

```javascript
// cypress.config.js
module.exports = {
  env: {
    baseUrl: 'https://exemplo.com',
    apiUrl: 'https://api.exemplo.com',
    usuario_teste: 'teste@email.com',
    senha_teste: 'Senha123'
  }
}
```

```javascript
// Usar no teste
describe('Usar Env Vars', () => {
  it('Acessar variáveis de ambiente', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.login(
      Cypress.env('usuario_teste'),
      Cypress.env('senha_teste')
    )
  })
})
```

---

## Testes de Performance

### Medição de Tempo de Carregamento

```javascript
describe('Performance', () => {
  it('Página deve carregar em menos de 3s', () => {
    const inicio = Date.now()
    
    cy.visit('/')
    cy.get('main').should('be.visible')
    
    const duracao = Date.now() - inicio
    expect(duracao).to.be.lessThan(3000)
  })

  it('Elemento deve aparecer em menos de 2s', () => {
    cy.visit('/busca')
    cy.get('input').type('javascript')
    
    cy.get('button').click()
    
    // Medir tempo até resultados aparecerem
    cy.get('.resultado', { timeout: 2000 }).should('exist')
  })

  it('Validar Core Web Vitals', () => {
    cy.visit('/')
    
    cy.window().then((win) => {
      // Acessar Web Vitals do navegador
      if (win.performance && win.performance.getEntriesByType) {
        const paintEntries = win.performance.getEntriesByType('paint')
        
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            expect(entry.startTime).to.be.lessThan(2500)
          }
        })
      }
    })
  })
})
```

### Monitorar Requisições de Rede

```javascript
it('Validar tempo de resposta da API', () => {
  cy.intercept('GET', '/api/usuarios', (req) => {
    const inicio = Date.now()
    
    req.reply((res) => {
      const duracao = Date.now() - inicio
      expect(duracao).to.be.lessThan(1000) // < 1s
      res.send()
    })
  }).as('api')

  cy.visit('/usuarios')
  cy.wait('@api')
})
```

---

## Padrões de Teste Avançados

### AAA Pattern (Arrange, Act, Assert)

```javascript
describe('Padrão AAA', () => {
  it('Cadastrar novo usuário', () => {
    // ARRANGE - Preparar dados
    const novoUsuario = {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'Senha123'
    }

    // ACT - Executar ação
    cy.visit('/cadastro')
    cy.get('[data-test="input-nome"]').type(novoUsuario.nome)
    cy.get('[data-test="input-email"]').type(novoUsuario.email)
    cy.get('[data-test="input-senha"]').type(novoUsuario.senha)
    cy.get('[data-test="btn-cadastro"]').click()

    // ASSERT - Verificar resultado
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.url().should('include', '/dashboard')
  })
})
```

### Given-When-Then (BDD)

```javascript
describe('Fluxo de Checkout - Comportamento', () => {
  // GIVEN - Dado que
  beforeEach(() => {
    cy.visit('/loja')
    cy.adicionarAoCarrinho('Produto A', 2)
  })

  // WHEN - Quando
  it('o usuário prossegue ao checkout', () => {
    cy.get('[data-test="btn-checkout"]').click()
    cy.url().should('include', '/checkout')
  })

  // THEN - Então
  it('deve exibir resumo do pedido', () => {
    cy.get('[data-test="btn-checkout"]').click()
    cy.get('[data-test="resumo"]').should('be.visible')
    cy.contains('Produto A').should('be.visible')
    cy.contains('Quantidade: 2').should('be.visible')
  })
})
```

### Page Object Model Avançado

```javascript
// cypress/support/pages/CheckoutPage.js
class CheckoutPage {
  visitarPagina() {
    cy.visit('/checkout')
    return this
  }

  preencherEndereco(endereco) {
    cy.get('[data-test="rua"]').type(endereco.rua)
    cy.get('[data-test="cidade"]').type(endereco.cidade)
    cy.get('[data-test="cep"]').type(endereco.cep)
    return this
  }

  preencherPagamento(pagamento) {
    cy.get('[data-test="cartao"]').type(pagamento.numero)
    cy.get('[data-test="cvv"]').type(pagamento.cvv)
    return this
  }

  finalizarCompra() {
    cy.get('[data-test="btn-finalizar"]').click()
    return this
  }

  verificarSucesso() {
    cy.contains('Pedido realizado com sucesso').should('be.visible')
    cy.url().should('include', '/confirmacao')
  }
}

export default CheckoutPage

// Usar no teste
import CheckoutPage from '../support/pages/CheckoutPage'

describe('Checkout', () => {
  it('Completar compra com fluência', () => {
    const checkout = new CheckoutPage()

    checkout.visitarPagina()
      .preencherEndereco({
        rua: 'Rua A',
        cidade: 'São Paulo',
        cep: '01234-567'
      })
      .preencherPagamento({
        numero: '4532015112830366',
        cvv: '123'
      })
      .finalizarCompra()
      .verificarSucesso()
  })
})
```

---

## Retry e Flakiness

### Retry Automático

```javascript
describe('Retry com Cypress', () => {
  it('Clement flaky com retry automático', () => {
    // Cypress tenta novamente se falhar
    cy.get('.elemento-que-as-vezes-nao-carrega', { timeout: 10000 })
      .should('be.visible')
  })

  it('Usar cy.should para retry', () => {
    // Retry automático até sucesso ou timeout
    cy.get('body').should(($body) => {
      expect($body).to.contain('Texto esperado')
    })
  })
})
```

### Evitar Flakiness

```javascript
// ❌ RUIM - Flaky
it('teste flaky', () => {
  cy.get('button').click()
  cy.wait(1000)
  cy.get('.resultado').should('exist')
})

// ✅ BOM - Confiável
it('teste confiável', () => {
  cy.get('button').click()
  cy.get('.loading').should('not.exist') // Esperar carregamento acabar
  cy.get('.resultado').should('exist')
})
```

---

## Testes Visuais (Visual Regression)

### Screenshots Automáticos

```javascript
describe('Testes Visuais', () => {
  it('Capturar screenshot de página inteira', () => {
    cy.visit('/')
    cy.screenshot('homepage-completa')
  })

  it('Capturar screenshot de elemento', () => {
    cy.visit('/')
    cy.get('.hero-section').screenshot('hero-section')
  })

  it('Capturar em múltiplos viewports', () => {
    const viewports = [
      { width: 1280, height: 720 },  // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ]

    viewports.forEach((viewport) => {
      cy.viewport(viewport.width, viewport.height)
      cy.visit('/')
      cy.screenshot(`homepage-${viewport.width}x${viewport.height}`)
    })
  })
})
```

### Comparação Visual com Plugin

```javascript
// npm install --save-dev @applitools/eyes-cypress
const { eyesOpen, eyesCheckWindow, eyesClose } = require('@applitools/eyes-cypress')

describe('Testes Visuais com Applitools', () => {
  beforeEach(() => {
    eyesOpen({
      appName: 'Meu App',
      testName: 'Teste Visual'
    })
  })

  afterEach(() => {
    eyesClose()
  })

  it('Verificar homepage visualmente', () => {
    cy.visit('/')
    eyesCheckWindow('Homepage')
  })

  it('Verificar formulário', () => {
    cy.visit('/cadastro')
    eyesCheckWindow('Formulário de Cadastro')
  })
})
```

---

## CI/CD com Cypress

### GitHub Actions

```yaml
# .github/workflows/cypress-tests.yml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Cypress tests
        run: npx cypress run --record --parallel --browser chrome
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Parallelização

```bash
# Executar testes em paralelo
npx cypress run --record --parallel --ci-build-id abc123
```

---

## Debugging Avançado

### Debug Mode

```javascript
describe('Debugging', () => {
  it('Usar debug', () => {
    cy.visit('/')
    
    // Parar execução para inspecionar
    cy.get('.elemento').debug()
    
    // Continuar depois
    cy.get('.elemento').should('be.visible')
  })

  it('Usar pause', () => {
    cy.visit('/')
    cy.pause() // Pausar e permitir step-by-step
    cy.get('button').click()
  })

  it('Verificar variáveis', () => {
    cy.get('.elemento').then(($el) => {
      console.log($el)
      debugger // Breakpoint do browser
    })
  })
})
```

### Custom Logger

```javascript
Cypress.Commands.add('log', (mensagem) => {
  cy.task('log', mensagem)
})

it('Usar custom logger', () => {
  cy.log('Iniciando teste')
  cy.visit('/')
  cy.log('Página carregada')
  cy.get('button').click()
  cy.log('Botão clicado')
})
```

---

## Plugins e Extensões

### Plugins Úteis

```javascript
// cypress.config.js
module.exports = {
  plugins: [
    require('@bahmutov/cypress-code-coverage'),
    require('cypress-file-upload'),
    require('cypress-multi-select')
  ]
}
```

### Comandos Customizados Avançados

```javascript
// cypress/support/commands.js

// Login com verificação de redirecionamento
Cypress.Commands.add('loginEValidar', (email, senha) => {
  cy.visit('/login')
  cy.get('[data-test="email"]').type(email)
  cy.get('[data-test="senha"]').type(senha)
  cy.get('[data-test="btn-login"]').click()
  
  // Aguardar redirect
  cy.url().should('include', '/dashboard')
  cy.get('[data-test="user-menu"]').should('contain', email)
})

// Upload de arquivo
Cypress.Commands.add('fazerUpload', (seletor, caminho) => {
  cy.get(seletor).selectFile(caminho)
})

// Validar múltiplos elementos
Cypress.Commands.add('validarElementos', (elementos) => {
  elementos.forEach((el) => {
    cy.get(el).should('be.visible')
  })
})
```

### Task para Operações de Sistema

```javascript
// cypress.config.js
on('task', {
  log(mensagem) {
    console.log(mensagem)
    return null
  },
  
  criarArquivo(caminho, conteudo) {
    require('fs').writeFileSync(caminho, conteudo)
    return null
  },
  
  lerArquivo(caminho) {
    return require('fs').readFileSync(caminho, 'utf8')
  }
})
```

---

## Exemplo Completo Integrado

```javascript
// cypress/e2e/fluxo-completo.cy.js
import CheckoutPage from '../support/pages/CheckoutPage'

describe('Fluxo Completo de E-commerce', () => {
  beforeEach(() => {
    cy.loginEValidar('usuario@email.com', 'Senha123')
  })

  it('Completar compra com sucesso', () => {
    // Adicionar produtos
    cy.visit('/loja')
    cy.adicionarAoCarrinho('Notebook', 1)
    cy.adicionarAoCarrinho('Mouse', 2)

    // Ir ao carrinho
    cy.visit('/carrinho')
    cy.get('[data-test="item"]').should('have.length', 2)

    // Checkout
    const checkout = new CheckoutPage()
    checkout.visitarPagina()
      .preencherEndereco({
        rua: 'Rua A',
        cidade: 'São Paulo',
        cep: '01234-567'
      })
      .preencherPagamento({
        numero: '4532015112830366',
        cvv: '123'
      })
      .finalizarCompra()
      .verificarSucesso()

    // Validar email de confirmação
    cy.task('lerArquivo', 'emails.log').then((conteudo) => {
      expect(conteudo).to.include('Seu pedido foi confirmado')
    })

    // Screenshot para validação visual
    cy.screenshot('pedido-confirmado')
  })
})
```

---

## Referências

- [Cypress Advanced](https://docs.cypress.io/guides/core-concepts/interacting-with-elements)
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Plugins](https://docs.cypress.io/plugins)


# Conceitos Avançados de JavaScript

## 📋 Índice
1. [Escopo e Contexto](#escopo-e-contexto)
2. [Hoisting](#hoisting)
3. [This Binding](#this-binding)
4. [Protótipos e Herança](#protótipos-e-herança)
5. [Callbacks e Higher-Order Functions](#callbacks-e-higher-order-functions)
6. [Currying e Partial Application](#currying-e-partial-application)
7. [Composição de Funções](#composição-de-funções)
8. [Event Loop e Assincronia](#event-loop-e-assincronia)
9. [Memoização](#memoização)
10. [Programação Funcional](#programação-funcional)

---

## Escopo e Contexto

### Escopo Global, Função e Bloco

**Escopo Global**: Variáveis acessíveis em todo o código

```javascript
var globalVar = 'global'

function exemplo() {
  console.log(globalVar) // 'global'
}
```

**Escopo de Função**: Variáveis visíveis apenas dentro da função

```javascript
function teste() {
  var funcVar = 'função'
  console.log(funcVar) // 'função'
}

console.log(funcVar) // ReferenceError
```

**Escopo de Bloco**: Introduzido com `let` e `const`

```javascript
if (true) {
  let blocoVar = 'bloco'
  const blocoConst = 'constante'
  console.log(blocoVar)    // 'bloco'
}

console.log(blocoVar)      // ReferenceError
```

### Escopo Lexical

JavaScript usa escopo lexical (estático). Uma função acessa variáveis do escopo onde foi **definida**, não onde foi **chamada**:

```javascript
const global = 'global'

function externa() {
  const externa_var = 'externa'
  
  function interna() {
    console.log(global)        // 'global'
    console.log(externa_var)   // 'externa'
  }
  
  return interna
}

const meuFunc = externa()
meuFunc() // Acessa externa_var mesmo fora de externa()
```

### Shadowing

Variáveis de escopo interno podem "sombrear" as externas:

```javascript
const x = 'global'

{
  const x = 'bloco'
  console.log(x) // 'bloco'
}

console.log(x) // 'global'
```

---

## Hoisting

Hoisting é o comportamento de mover declarações para o topo do escopo.

### Hoisting com `var`

```javascript
console.log(x) // undefined (não ReferenceError!)
var x = 5
console.log(x) // 5

// É interpretado como:
// var x;
// console.log(x); // undefined
// x = 5;
// console.log(x); // 5
```

### Hoisting com `let` e `const`

```javascript
console.log(y) // ReferenceError
let y = 10

// Temporal Dead Zone - não pode usar antes da declaração
```

### Hoisting de Funções

Funções declaradas são hoisted completamente:

```javascript
console.log(saudacao('João')) // 'Olá João'

function saudacao(nome) {
  return `Olá ${nome}`
}

// Mas funções expressas NÃO:
console.log(despedida('João')) // TypeError

var despedida = function(nome) {
  return `Adeus ${nome}`
}
```

---

## This Binding

O valor de `this` depende de como a função é chamada:

### 1. Chamada Regular (Global)

```javascript
function teste() {
  console.log(this)
}

teste() // window (browser) ou global (Node.js)
```

### 2. Método de Objeto

```javascript
const pessoa = {
  nome: 'João',
  saudar() {
    console.log(this.nome)
  }
}

pessoa.saudar() // 'João' (this = pessoa)
```

### 3. Construtor

```javascript
function Pessoa(nome) {
  this.nome = nome
}

const joao = new Pessoa('João')
console.log(joao.nome) // 'João' (this = nova instância)
```

### 4. Arrow Functions (Herdam `this`)

```javascript
const pessoa = {
  nome: 'João',
  saudar: () => {
    console.log(this) // this global, não this = pessoa
  }
}

// Arrow functions não têm seu próprio this
const obj = {
  nome: 'Maria',
  criarFuncao() {
    return () => {
      console.log(this.nome) // 'Maria' (herda de criarFuncao)
    }
  }
}

const func = obj.criarFuncao()
func() // 'Maria'
```

### 5. Bind, Call e Apply

```javascript
function apresentar() {
  return `Oi, sou ${this.nome}`
}

const pessoa1 = { nome: 'João' }
const pessoa2 = { nome: 'Maria' }

// call - executa imediatamente
console.log(apresentar.call(pessoa1))    // Oi, sou João

// apply - como call mas com array de argumentos
console.log(apresentar.apply(pessoa2))   // Oi, sou Maria

// bind - retorna nova função com this vinculado
const apresentarJoao = apresentar.bind(pessoa1)
console.log(apresentarJoao())            // Oi, sou João
```

---

## Protótipos e Herança

### Cadeia de Protótipos

Todos os objetos JavaScript herdam de `Object.prototype`:

```javascript
const obj = { a: 1 }
console.log(obj.toString()) // Herdado de Object.prototype

// Visualizar protótipo
console.log(Object.getPrototypeOf(obj))
console.log(obj.__proto__) // Não recomendado, mas funciona
```

### Construtor e Prototype

```javascript
function Animal(nome) {
  this.nome = nome
}

Animal.prototype.fazer_som = function() {
  console.log(`${this.nome} faz som`)
}

const cachorro = new Animal('Rex')
cachorro.fazer_som() // Rex faz som

// Verificar prototype
console.log(cachorro instanceof Animal) // true
```

### Herança com Protótipos

```javascript
function Veiculo(marca) {
  this.marca = marca
}

Veiculo.prototype.info = function() {
  return `Marca: ${this.marca}`
}

function Carro(marca, modelo) {
  Veiculo.call(this, marca)
  this.modelo = modelo
}

// Configurar herança
Carro.prototype = Object.create(Veiculo.prototype)
Carro.prototype.constructor = Carro

Carro.prototype.detalhes = function() {
  return `${this.info()}, Modelo: ${this.modelo}`
}

const meuCarro = new Carro('Toyota', 'Corolla')
console.log(meuCarro.detalhes()) // Marca: Toyota, Modelo: Corolla
```

### Classes (Sintaxe Moderna)

```javascript
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome
    this.idade = idade
  }

  apresentar() {
    return `Oi, sou ${this.nome}`
  }

  static contar() {
    return 'Método estático'
  }

  get maiorDeIdade() {
    return this.idade >= 18
  }

  set novaIdade(idade) {
    this.idade = idade
  }
}

class Funcionario extends Pessoa {
  constructor(nome, idade, salario) {
    super(nome, idade)
    this.salario = salario
  }

  trabalhar() {
    return `${this.nome} está trabalhando`
  }
}

const func = new Funcionario('João', 30, 3000)
console.log(func.apresentar())   // Oi, sou João
console.log(func.trabalhar())    // João está trabalhando
console.log(func.maiorDeIdade)   // true
```

---

## Callbacks e Higher-Order Functions

### Callbacks

Funções passadas como argumento para executar depois:

```javascript
function buscarDados(callback) {
  setTimeout(() => {
    const dados = { id: 1, nome: 'João' }
    callback(dados)
  }, 1000)
}

buscarDados((dados) => {
  console.log(dados) // { id: 1, nome: 'João' }
})
```

### Callback Hell

Aninhamento excessivo de callbacks (evitar):

```javascript
// ❌ RUIM
function processar() {
  buscarDados((dados) => {
    validarDados(dados, (valido) => {
      salvarDados(dados, (resultado) => {
        notificar(resultado, (msg) => {
          console.log(msg)
        })
      })
    })
  })
}

// ✅ BOM - Usar Promises ou async/await
async function processar() {
  const dados = await buscarDados()
  const valido = await validarDados(dados)
  const resultado = await salvarDados(dados)
  const msg = await notificar(resultado)
  console.log(msg)
}
```

### Higher-Order Functions

Funções que recebem ou retornam funções:

```javascript
// Recebe função
function aplicarOperacao(a, b, operacao) {
  return operacao(a, b)
}

const resultado = aplicarOperacao(5, 3, (x, y) => x + y)
console.log(resultado) // 8

// Retorna função
function criar_multiplicador(x) {
  return function(y) {
    return x * y
  }
}

const multiplicarPor3 = criar_multiplicador(3)
console.log(multiplicarPor3(4)) // 12
```

---

## Currying e Partial Application

### Currying

Transformar função com múltiplos parâmetros em sequência de funções unárias:

```javascript
// Normal
function somar(a, b, c) {
  return a + b + c
}

console.log(somar(1, 2, 3)) // 6

// Curried
function somarCurried(a) {
  return (b) => {
    return (c) => {
      return a + b + c
    }
  }
}

console.log(somarCurried(1)(2)(3)) // 6

// Sintaxe arrow simplificada
const somarCurried2 = (a) => (b) => (c) => a + b + c
console.log(somarCurried2(1)(2)(3)) // 6
```

### Partial Application

Fixar alguns argumentos e retornar função com argumentos restantes:

```javascript
function multiplicar(a, b) {
  return a * b
}

// Partial application
function criarMultiplicador(a) {
  return (b) => multiplicar(a, b)
}

const vezes2 = criarMultiplicador(2)
const vezes3 = criarMultiplicador(3)

console.log(vezes2(5))  // 10
console.log(vezes3(5))  // 15
```

---

## Composição de Funções

Combinar múltiplas funções para criar novas funções:

```javascript
// Funções simples
const adicionar1 = (x) => x + 1
const multiplicarPor2 = (x) => x * 2
const subtrair3 = (x) => x - 3

// Função de composição
function compor(...funcoes) {
  return (valor) => {
    return funcoes.reduceRight((acc, func) => func(acc), valor)
  }
}

const pipeline = compor(adicionar1, multiplicarPor2, subtrair3)
console.log(pipeline(5)) // ((5 - 3) * 2) + 1 = 5

// Pipe (execução esquerda para direita)
function pipe(...funcoes) {
  return (valor) => {
    return funcoes.reduce((acc, func) => func(acc), valor)
  }
}

const pipeline2 = pipe(subtrair3, multiplicarPor2, adicionar1)
console.log(pipeline2(5)) // ((5 - 3) * 2) + 1 = 5
```

---

## Event Loop e Assincronia

### Pilha de Execução (Call Stack)

```javascript
function a() {
  console.log('A início')
  b()
  console.log('A fim')
}

function b() {
  console.log('B')
}

a()
// Output: A início, B, A fim
```

### Fila de Microtasks vs Macrotasks

```javascript
console.log('Script')

setTimeout(() => {
  console.log('setTimeout (macrotask)')
}, 0)

Promise.resolve()
  .then(() => {
    console.log('Promise (microtask)')
  })

console.log('Fim script')

// Output: Script, Fim script, Promise, setTimeout
// Microtasks são executadas antes de macrotasks
```

### Event Loop Explicado

```javascript
// 1. Call Stack executa
console.log('1')

// 2. setTimeout vai para Web API e depois Macrotask Queue
setTimeout(() => console.log('2'), 0)

// 3. Promise vai para Microtask Queue
Promise.resolve().then(() => console.log('3'))

// 4. Call Stack continua
console.log('4')

// Ordem de execução:
// 1. '1' (script)
// 4. '4' (script)
// 3. '3' (microtask)
// 2. '2' (macrotask)
```

---

## Memoização

Cache de resultados de funções para evitar recomputação:

```javascript
// Sem memoização
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.time('Sem memo')
fibonacci(40) // Muito lento
console.timeEnd('Sem memo')

// Com memoização
function criarFibonacciMemo() {
  const cache = {}

  return function fib(n) {
    if (n in cache) {
      return cache[n]
    }

    if (n <= 1) return n

    cache[n] = fib(n - 1) + fib(n - 2)
    return cache[n]
  }
}

const fibMemo = criarFibonacciMemo()

console.time('Com memo')
fibMemo(40) // Muito rápido!
console.timeEnd('Com memo')
```

---

## Programação Funcional

### Imutabilidade

```javascript
// ❌ Mutação
const arr = [1, 2, 3]
arr.push(4)
console.log(arr) // [1, 2, 3, 4]

// ✅ Imutável
const arr2 = [1, 2, 3]
const arr3 = [...arr2, 4]
console.log(arr2) // [1, 2, 3]
console.log(arr3) // [1, 2, 3, 4]
```

### Pure Functions

Funções sem efeitos colaterais:

```javascript
// ❌ Impura (depende de variável externa)
let multiplicador = 2

function multiplicar(x) {
  return x * multiplicador
}

// ✅ Pura (resultado depende apenas dos parâmetros)
function multiplicarPuro(x, mult) {
  return x * mult
}

console.log(multiplicarPuro(5, 2)) // 10
```

### Redução (Reduce)

```javascript
const numeros = [1, 2, 3, 4, 5]

// Soma
const soma = numeros.reduce((acc, num) => acc + num, 0)
console.log(soma) // 15

// Contagem
const pares = numeros.reduce((acc, num) => {
  return num % 2 === 0 ? acc + 1 : acc
}, 0)
console.log(pares) // 2

// Agrupar
const pessoas = [
  { nome: 'João', idade: 30 },
  { nome: 'Maria', idade: 25 },
  { nome: 'Pedro', idade: 30 }
]

const porIdade = pessoas.reduce((acc, pessoa) => {
  const chave = pessoa.idade
  if (!acc[chave]) {
    acc[chave] = []
  }
  acc[chave].push(pessoa)
  return acc
}, {})

console.log(porIdade)
// { 30: [João, Pedro], 25: [Maria] }
```

### Functor e Monad (Conceitos Avançados)

```javascript
// Functor - estrutura que implementa map
class Container {
  constructor(valor) {
    this.valor = valor
  }

  static of(valor) {
    return new Container(valor)
  }

  map(func) {
    return Container.of(func(this.valor))
  }
}

const resultado = Container.of(2)
  .map(x => x * 2)
  .map(x => x + 1)

console.log(resultado.valor) // 5
```

---

## Referências

- [MDN - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [JavaScript.info - Avançado](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [Functional Programming in JavaScript](https://eloquentjavascript.net/)


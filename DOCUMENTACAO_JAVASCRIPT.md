# Fundamentos de JavaScript

## 📋 Índice
1. [Introdução](#introdução)
2. [Conceitos Básicos](#conceitos-básicos)
3. [Tipos de Dados](#tipos-de-dados)
4. [Funções](#funções)
5. [Objetos e Arrays](#objetos-e-arrays)
6. [Promessas e Async/Await](#promessas-e-asyncawait)
7. [Módulos](#módulos)

---

## Introdução

JavaScript é uma linguagem de programação interpretada, dinamicamente tipada e orientada a objetos. Criada em 1995, é a linguagem padrão para interatividade na web e também é usada em ambientes de servidor (Node.js).

**Características principais:**
- Linguagem de scripting leve e dinâmica
- Baseada em protótipos (embora suporte programação orientada a objetos)
- Execução assíncrona
- Integrada nativamente em navegadores web

---

## Conceitos Básicos

### Variáveis

Em JavaScript, existem três formas de declarar variáveis:

```javascript
// var - escopo global ou de função (evitar em código moderno)
var x = 10;

// let - escopo de bloco (recomendado)
let y = 20;

// const - constante, escopo de bloco (recomendado)
const z = 30;
```

**Diferenças:**
- `var`: Tem hoisting e escopo de função
- `let`: Tem hoisting temporal e escopo de bloco
- `const`: Não pode ser reatribuída (mas objetos/arrays podem ter conteúdo alterado)

### Tipos de Dados

JavaScript possui os seguintes tipos primitivos:

```javascript
// Number
const numero = 42;
const flutuante = 3.14;

// String
const texto = "Olá, mundo!";
const template = `Olá, ${texto}`;

// Boolean
const verdadeiro = true;
const falso = false;

// Null (ausência intencional de valor)
const nulo = null;

// Undefined (variável declarada mas não inicializada)
let indefinido;

// Symbol (único e imutável)
const simbolo = Symbol('id');

// BigInt (números muito grandes)
const grande = 123456789012345678901234567890n;
```

### Operadores

```javascript
// Aritméticos
console.log(10 + 5);  // 15
console.log(10 - 5);  // 5
console.log(10 * 5);  // 50
console.log(10 / 5);  // 2
console.log(10 % 3);  // 1

// Comparação
console.log(10 == '10');   // true (comparação de valor)
console.log(10 === '10');  // false (comparação de tipo)
console.log(10 != '10');   // false
console.log(10 !== '10');  // true

// Lógicos
console.log(true && false);  // false
console.log(true || false);  // true
console.log(!true);          // false
```

---

## Tipos de Dados

### Objetos

Objetos são coleções de pares chave-valor:

```javascript
const pessoa = {
  nome: 'João',
  idade: 30,
  email: 'joao@email.com',
  endereco: {
    rua: 'Rua A',
    cidade: 'São Paulo'
  }
};

// Acessando propriedades
console.log(pessoa.nome);           // João
console.log(pessoa['idade']);       // 30
console.log(pessoa.endereco.cidade); // São Paulo
```

### Arrays

Arrays são listas ordenadas de elementos:

```javascript
const numeros = [1, 2, 3, 4, 5];
const misto = [1, 'texto', true, null];

// Acessando elementos
console.log(numeros[0]);      // 1
console.log(numeros.length);  // 5

// Métodos úteis
numeros.push(6);              // Adiciona ao final
numeros.pop();                // Remove do final
numeros.unshift(0);           // Adiciona no início
numeros.shift();              // Remove do início

// Iteração
numeros.forEach((num, index) => {
  console.log(`Índice ${index}: ${num}`);
});

// Transformação
const dobrados = numeros.map(num => num * 2);
const pares = numeros.filter(num => num % 2 === 0);
const soma = numeros.reduce((acum, num) => acum + num, 0);
```

---

## Funções

### Declaração de Funções

```javascript
// Função tradicional
function saudacao(nome) {
  return `Olá, ${nome}!`;
}

console.log(saudacao('Maria')); // Olá, Maria!

// Função anônima
const despedida = function(nome) {
  return `Até logo, ${nome}!`;
};

// Arrow function (ES6)
const bemvindo = (nome) => {
  return `Bem-vindo, ${nome}!`;
};

// Arrow function simplificada
const quadrado = (x) => x * x;
const adicionar = (a, b) => a + b;
```

### Parâmetros e Valores Padrão

```javascript
function criar(nome, tipo = 'padrão') {
  console.log(`${nome} - ${tipo}`);
}

criar('Item');           // Item - padrão
criar('Item', 'custom'); // Item - custom

// Rest parameters
function somar(...numeros) {
  return numeros.reduce((a, b) => a + b, 0);
}

console.log(somar(1, 2, 3, 4)); // 10
```

### Closures

Uma closure é uma função que "lembra" do ambiente em que foi criada:

```javascript
function contadora() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const contador = contadora();
console.log(contador()); // 1
console.log(contador()); // 2
console.log(contador()); // 3
```

---

## Objetos e Arrays

### Desestruturação

```javascript
// Objetos
const pessoa = { nome: 'João', idade: 30, email: 'joao@email.com' };
const { nome, idade } = pessoa;
console.log(nome, idade); // João 30

// Arrays
const cores = ['vermelho', 'verde', 'azul'];
const [primeira, segunda] = cores;
console.log(primeira, segunda); // vermelho verde

// Com renomeação
const { nome: n, idade: i } = pessoa;
console.log(n, i); // João 30
```

### Spread Operator

```javascript
const array1 = [1, 2, 3];
const array2 = [...array1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

---

## Promessas e Async/Await

### Promessas

Uma Promise representa o resultado eventual de uma operação assíncrona:

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Sucesso!');
  }, 1000);
});

promise
  .then((resultado) => {
    console.log(resultado); // Sucesso!
  })
  .catch((erro) => {
    console.error(erro);
  });
```

### Async/Await

Sintaxe mais limpa para trabalhar com Promises:

```javascript
async function buscarDados() {
  try {
    const resposta = await fetch('https://api.exemplo.com/dados');
    const dados = await resposta.json();
    console.log(dados);
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

buscarDados();
```

### Promise.all

Aguarda múltiplas Promises:

```javascript
Promise.all([promise1, promise2, promise3])
  .then((resultados) => {
    console.log(resultados); // Array com todos os resultados
  });
```

---

## Módulos

### CommonJS (Node.js)

```javascript
// Exportar
module.exports = {
  funcao1: () => {},
  funcao2: () => {}
};

// Importar
const { funcao1, funcao2 } = require('./arquivo');
```

### ES6 Modules

```javascript
// Exportar
export function funcao1() {}
export const constante = 42;

export default class Classe {}

// Importar
import Classe, { funcao1, constante } from './arquivo.js';
```

---

## Boas Práticas

1. **Use `const` por padrão**, `let` quando necessário, evite `var`
2. **Nomes significativos**: Variáveis, funções e classes com nomes descritivos
3. **Funções pequenas**: Cada função deve fazer uma coisa bem
4. **Trate erros**: Sempre use try/catch ou .catch() em Promises
5. **Evite callback hell**: Use Promises ou async/await
6. **Validação**: Sempre valide entrada de dados
7. **Use linter**: ESLint para manter código consistente

---

## Referências

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [ECMAScript Specification](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)


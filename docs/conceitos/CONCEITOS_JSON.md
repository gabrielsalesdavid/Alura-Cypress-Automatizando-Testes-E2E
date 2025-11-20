# Conceitos Avançados de JSON

## 📋 Índice
1. [JSON Schema](#json-schema)
2. [Validação de JSON](#validação-de-json)
3. [JSON-LD (JSON para Web Semântica)](#json-ld-json-para-web-semântica)
4. [JSON Patch](#json-patch)
5. [JSON Pointer](#json-pointer)
6. [Segurança em JSON](#segurança-em-json)
7. [Otimização e Performance](#otimização-e-performance)
8. [JSON vs Alternativas](#json-vs-alternativas)
9. [Streaming JSON](#streaming-json)
10. [JSONP (JSON com Padding)](#jsonp-json-com-padding)

---

## JSON Schema

JSON Schema é um vocabulário para validar a estrutura e conteúdo de documentos JSON.

### Exemplo Básico

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Usuário",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "nome": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "idade": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "ativo": {
      "type": "boolean"
    }
  },
  "required": ["id", "nome", "email"]
}
```

### Tipos de Dados

```json
{
  "tipos": {
    "string": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "numero_inteiro": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "numero_decimal": {
      "type": "number",
      "multipleOf": 0.1
    },
    "booleano": {
      "type": "boolean"
    },
    "nulo": {
      "type": "null"
    },
    "array": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "maxItems": 10
    },
    "objeto": {
      "type": "object",
      "properties": {
        "propriedade": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  }
}
```

### Padrões Avançados

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "endereco": {
      "type": "object",
      "properties": {
        "rua": { "type": "string" },
        "cidade": { "type": "string" },
        "cep": { "type": "string", "pattern": "^[0-9]{5}-[0-9]{3}$" }
      },
      "required": ["rua", "cidade"]
    },
    "telefone": {
      "type": "string",
      "pattern": "^\\(?[0-9]{2}\\)? 9?[0-9]{4}-[0-9]{4}$"
    }
  },
  "type": "object",
  "properties": {
    "nome": { "type": "string" },
    "endereco": { "$ref": "#/definitions/endereco" },
    "telefones": {
      "type": "array",
      "items": { "$ref": "#/definitions/telefone" }
    }
  }
}
```

### Validação com JavaScript

```javascript
// npm install ajv
const Ajv = require('ajv')
const ajv = new Ajv()

const schema = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    idade: { type: 'integer', minimum: 0 }
  },
  required: ['nome']
}

const validate = ajv.compile(schema)

const dados = { nome: 'João', idade: 30 }
const valido = validate(dados)

if (!valido) {
  console.log(validate.errors)
}
```

---

## Validação de JSON

### Função de Validação Customizada

```javascript
function validarJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    
    // JSON válido
    return {
      valido: true,
      dados: parsed,
      erro: null
    }
  } catch (erro) {
    // JSON inválido
    return {
      valido: false,
      dados: null,
      erro: erro.message
    }
  }
}

const resultado = validarJSON('{"nome": "João"}')
console.log(resultado)
// { valido: true, dados: { nome: 'João' }, erro: null }
```

### Validação Estrutural

```javascript
function validarEstrutura(dados, schema) {
  for (const [chave, tipo] of Object.entries(schema)) {
    if (!(chave in dados)) {
      return false // Campo obrigatório não encontrado
    }
    
    if (typeof dados[chave] !== tipo) {
      return false // Tipo incorreto
    }
  }
  
  return true
}

const schema = {
  nome: 'string',
  idade: 'number',
  ativo: 'boolean'
}

const usuario = {
  nome: 'João',
  idade: 30,
  ativo: true
}

console.log(validarEstrutura(usuario, schema)) // true
```

---

## JSON-LD (JSON para Web Semântica)

JSON-LD adiciona contexto semântico aos dados JSON:

```json
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "João Silva",
  "jobTitle": "Desenvolvedor",
  "url": "https://exemplo.com",
  "worksFor": {
    "@type": "Organization",
    "name": "Tech Company"
  }
}
```

### Exemplo em Testes Cypress

```json
{
  "@context": "https://schema.org/",
  "@type": "WebApplication",
  "name": "AdoPet",
  "url": "https://adopet-frontend-cypress.vercel.app/",
  "applicationCategory": "UtilitiesApplication",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "BRL"
  }
}
```

---

## JSON Patch

Descreve mudanças em um documento JSON de forma estruturada (RFC 6902):

```json
[
  {
    "op": "add",
    "path": "/usuarios/0",
    "value": {
      "id": 1,
      "nome": "João"
    }
  },
  {
    "op": "replace",
    "path": "/usuarios/0/nome",
    "value": "João Silva"
  },
  {
    "op": "remove",
    "path": "/usuarios/1"
  },
  {
    "op": "move",
    "from": "/usuarios/0",
    "path": "/usuarios/1"
  },
  {
    "op": "copy",
    "from": "/usuarios/0",
    "path": "/usuarios/2"
  },
  {
    "op": "test",
    "path": "/usuarios/0/nome",
    "value": "João Silva"
  }
]
```

### Implementação em JavaScript

```javascript
function aplicarPatch(documento, patches) {
  let resultado = JSON.parse(JSON.stringify(documento))
  
  for (const patch of patches) {
    switch (patch.op) {
      case 'add':
        setValor(resultado, patch.path, patch.value)
        break
      case 'remove':
        removerValor(resultado, patch.path)
        break
      case 'replace':
        setValor(resultado, patch.path, patch.value)
        break
      case 'move':
        const valor = getValor(resultado, patch.from)
        removerValor(resultado, patch.from)
        setValor(resultado, patch.path, valor)
        break
      case 'copy':
        const copia = JSON.parse(JSON.stringify(getValor(resultado, patch.from)))
        setValor(resultado, patch.path, copia)
        break
    }
  }
  
  return resultado
}
```

---

## JSON Pointer

Forma padrão de referenciar valores específicos em um documento JSON (RFC 6901):

```javascript
// JSON Pointer: /usuarios/0/nome
{
  "usuarios": [
    {
      "nome": "João",     // /usuarios/0/nome
      "email": "joao@email.com"  // /usuarios/0/email
    },
    {
      "nome": "Maria",    // /usuarios/1/nome
      "email": "maria@email.com" // /usuarios/1/email
    }
  ]
}

// Sintaxe:
// "/" = raiz
// "/usuarios" = array usuarios
// "/usuarios/0" = primeiro elemento
// "/usuarios/0/nome" = propriedade nome do primeiro
// "/usuarios/0/email" = propriedade email do primeiro
```

### Implementação

```javascript
function getValueByPointer(obj, pointer) {
  const parts = pointer.split('/').filter(p => p !== '')
  
  let current = obj
  for (const part of parts) {
    const decoded = decodeURIComponent(part)
    current = current[decoded]
    
    if (current === undefined) {
      return undefined
    }
  }
  
  return current
}

const dados = {
  usuarios: [
    { nome: 'João', email: 'joao@email.com' },
    { nome: 'Maria', email: 'maria@email.com' }
  ]
}

console.log(getValueByPointer(dados, '/usuarios/0/nome')) // João
console.log(getValueByPointer(dados, '/usuarios/1/email')) // maria@email.com
```

---

## Segurança em JSON

### 1. JSON Injection

```javascript
// ❌ PERIGOSO - Não fazer
const userInput = '{"admin": true}'
const dados = JSON.parse(userInput)
// Usuário pode injetar privilégios

// ✅ SEGURO - Validar com schema
const schema = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    email: { type: 'string' }
  },
  additionalProperties: false // Rejeita propriedades extras
}
```

### 2. XXE (XML External Entity) - JSON é seguro

JSON não tem as vulnerabilidades de XML, mas a API que o consome pode ter:

```javascript
// ❌ Risco: se converter JSON para XML
const jsonStr = '{"comando": "sistema_critico"}'

// ✅ Seguro: manter como JSON
const dados = JSON.parse(jsonStr)
if (dados.comando === 'seguro') {
  // executar
}
```

### 3. Sanitização

```javascript
function sanitizarJSON(jsonStr) {
  try {
    const obj = JSON.parse(jsonStr)
    
    // Remover campos potencialmente perigosos
    delete obj.script
    delete obj.onclick
    delete obj.__proto__
    
    return obj
  } catch (e) {
    return null
  }
}
```

### 4. CSRF em APIs JSON

```javascript
// Usar tokens CSRF em POST
const headers = {
  'Content-Type': 'application/json',
  'X-CSRF-Token': getCookie('csrftoken')
}

fetch('/api/usuarios', {
  method: 'POST',
  headers,
  body: JSON.stringify(dados)
})
```

---

## Otimização e Performance

### 1. Reduzir Tamanho

```javascript
// ❌ Não otimizado
{
  "nome_do_usuario": "João",
  "endereco_completo": "Rua A, 123",
  "data_de_criacao": "2025-11-20T10:30:00Z"
}

// ✅ Otimizado (gzip + estrutura menor)
{
  "nome": "João",
  "endereco": "Rua A, 123",
  "criado": "2025-11-20T10:30:00Z"
}
```

### 2. Paginação em APIs

```json
{
  "dados": [
    { "id": 1, "nome": "Item 1" },
    { "id": 2, "nome": "Item 2" }
  ],
  "total": 1000,
  "pagina": 1,
  "porPagina": 2,
  "proxima": "/api/items?pagina=2",
  "anterior": null
}
```

### 3. Streaming JSON

```javascript
// Para arquivos muito grandes
const fs = require('fs')
const JSONStream = require('JSONStream')

fs.createReadStream('arquivo-grande.json')
  .pipe(JSONStream.parse('*'))
  .on('data', (item) => {
    console.log(item) // Processa um item por vez
  })
```

### 4. Compressão

```javascript
// Cliente solicita gzip
const response = await fetch('/api/dados', {
  headers: {
    'Accept-Encoding': 'gzip, deflate'
  }
})

// Servidor retorna comprimido (reduz em ~70%)
```

---

## JSON vs Alternativas

### JSON vs XML

| Aspecto | JSON | XML |
|---|---|---|
| **Tamanho** | Menor | Maior |
| **Legibilidade** | Boa | Boa |
| **Attributes** | Não | Sim |
| **Namespaces** | Não | Sim |
| **Parsing** | Rápido | Lento |
| **Tipagem** | Nativa | Requer Schema |

```javascript
// JSON
{ "usuario": { "nome": "João", "id": "123" } }

// XML equivalente
<usuario><nome>João</nome><id>123</id></usuario>
```

### JSON vs YAML

```yaml
# YAML
usuario:
  nome: João
  idade: 30
  emails:
    - joao@email.com
    - joao.silva@work.com
```

```json
{
  "usuario": {
    "nome": "João",
    "idade": 30,
    "emails": [
      "joao@email.com",
      "joao.silva@work.com"
    ]
  }
}
```

### JSON vs MessagePack

MessagePack é mais compacto mas binário:

```javascript
// JSON: 30 bytes
{"nome":"João","idade":30}

// MessagePack: 16 bytes (mais eficiente para transmissão)
```

---

## Streaming JSON

Processar grandes volumes sem carregar em memória:

```javascript
// Node.js - JSONStream
const JSONStream = require('JSONStream')
const fs = require('fs')

fs.createReadStream('usuarios.json')
  .pipe(JSONStream.parse('usuarios.*'))
  .on('data', (usuario) => {
    console.log(`Processando ${usuario.nome}`)
    salvarNoBanco(usuario)
  })
  .on('end', () => {
    console.log('Concluído')
  })
```

---

## JSONP (JSON com Padding)

Técnica para contornar CORS usando callbacks:

```html
<!-- HTML -->
<script src="https://api.exemplo.com/usuarios?callback=processarUsuarios"></script>

<script>
function processarUsuarios(dados) {
  console.log(dados)
}
</script>
```

```javascript
// Servidor retorna:
processarUsuarios({
  "usuarios": [
    { "id": 1, "nome": "João" }
  ]
})

// JSONP é menos seguro que CORS, evitar em novas aplicações
```

---

## Boas Práticas Avançadas

1. **Sempre validar JSON** - Use schemas
2. **Versionamento de API** - Inclua versão na resposta
3. **Hypermedia** - Links para recursos relacionados
4. **Caching adequado** - Cache-Control headers
5. **Rate limiting** - Proteger contra abuso
6. **Compressão** - Usar gzip para respostas
7. **Segurança** - HTTPS, validação, sanitização

---

## Referências

- [JSON Official](https://www.json.org/)
- [JSON Schema](https://json-schema.org/)
- [RFC 8259 - JSON](https://tools.ietf.org/html/rfc8259)
- [RFC 6902 - JSON Patch](https://tools.ietf.org/html/rfc6902)
- [RFC 6901 - JSON Pointer](https://tools.ietf.org/html/rfc6901)
- [JSON-LD](https://json-ld.org/)


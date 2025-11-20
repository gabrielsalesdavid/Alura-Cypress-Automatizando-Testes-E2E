# Fundamentos de JSON

## 📋 Índice
1. [Introdução](#introdução)
2. [Estrutura Básica](#estrutura-básica)
3. [Tipos de Dados](#tipos-de-dados)
4. [Sintaxe e Regras](#sintaxe-e-regras)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Validação](#validação)
7. [Boas Práticas](#boas-práticas)

---

## Introdução

JSON (JavaScript Object Notation) é um formato de texto leve para troca de dados. Criado em 2001 por Douglas Crockford, é baseado em um subconjunto do JavaScript.

**Características principais:**
- Formato baseado em texto
- Independente de linguagem (suportado por quase todas as linguagens)
- Fácil de ler e escrever
- Estrutura bem definida
- Amplamente usado em APIs e configurações

---

## Estrutura Básica

JSON possui duas estruturas principais:

### 1. Objeto
Uma coleção desordenada de pares chave-valor entre `{}`:

```json
{
  "nome": "João Silva",
  "idade": 30,
  "ativo": true
}
```

### 2. Array
Uma lista ordenada de valores entre `[]`:

```json
[1, 2, 3, 4, 5]
```

### Combinações

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "João",
      "email": "joao@email.com"
    },
    {
      "id": 2,
      "nome": "Maria",
      "email": "maria@email.com"
    }
  ],
  "total": 2,
  "ativo": true
}
```

---

## Tipos de Dados

JSON suporta os seguintes tipos de dados:

### String
Texto entre aspas duplas:

```json
{
  "nome": "João",
  "cidade": "São Paulo",
  "descricao": "Uma descrição com múltiplas linhas"
}
```

**Caracteres especiais escapados:**
```json
{
  "texto": "Aspas: \" e barra invertida: \\",
  "quebra": "Primeira linha\nSegunda linha",
  "tab": "Com\tabulação"
}
```

### Number
Números inteiros ou decimais (sem aspas):

```json
{
  "idade": 30,
  "preco": 19.99,
  "negativo": -42,
  "cientifico": 1.23e-4
}
```

### Boolean
Valores `true` ou `false` (sem aspas):

```json
{
  "ativo": true,
  "deletado": false
}
```

### Null
Representa ausência de valor:

```json
{
  "observacoes": null,
  "referencia": null
}
```

### Array
Lista de valores:

```json
{
  "numeros": [1, 2, 3, 4, 5],
  "cores": ["vermelho", "verde", "azul"],
  "misto": [1, "texto", true, null]
}
```

### Objeto
Objeto aninhado:

```json
{
  "pessoa": {
    "nome": "João",
    "endereco": {
      "rua": "Rua A",
      "cidade": "São Paulo",
      "cep": "01234-567"
    }
  }
}
```

---

## Sintaxe e Regras

### Regras Obrigatórias

1. **Dados devem estar entre `{}`** (objeto) ou `[]` (array)
2. **Chaves devem estar entre aspas duplas**
3. **Valores string devem estar entre aspas duplas**
4. **Não há vírgula após o último elemento**
5. **JSON não suporta comentários** (diferente de JavaScript)

### Exemplos Corretos e Incorretos

```json
// ✅ CORRETO
{
  "nome": "João",
  "idade": 30
}

// ❌ INCORRETO - Sem aspas nas chaves
{
  nome: "João",
  idade: 30
}

// ❌ INCORRETO - Aspas simples em vez de duplas
{
  'nome': 'João',
  'idade': 30
}

// ❌ INCORRETO - Vírgula após último elemento
{
  "nome": "João",
  "idade": 30,
}

// ❌ INCORRETO - Comentário
{
  "nome": "João", // comentário
  "idade": 30
}
```

---

## Exemplos Práticos

### 1. Configuração de Aplicação

```json
{
  "app": {
    "nome": "Meu Aplicativo",
    "versao": "1.0.0",
    "ambiente": "producao"
  },
  "database": {
    "host": "localhost",
    "porta": 5432,
    "usuario": "admin",
    "senha": "segura123"
  },
  "debug": false
}
```

### 2. Resposta de API

```json
{
  "sucesso": true,
  "codigo": 200,
  "dados": {
    "usuario": {
      "id": 123,
      "nome": "João Silva",
      "email": "joao@email.com",
      "permissoes": ["ler", "escrever"]
    }
  },
  "mensagem": "Dados obtidos com sucesso"
}
```

### 3. Lista de Usuários

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "João",
      "ativo": true,
      "ultimoAcesso": "2025-11-20T10:30:00Z"
    },
    {
      "id": 2,
      "nome": "Maria",
      "ativo": true,
      "ultimoAcesso": "2025-11-19T14:15:00Z"
    },
    {
      "id": 3,
      "nome": "Pedro",
      "ativo": false,
      "ultimoAcesso": null
    }
  ],
  "total": 3,
  "pagina": 1,
  "porPagina": 10
}
```

### 4. Teste Automatizado (Fixture do Cypress)

```json
{
  "usuarios": [
    {
      "email": "maria@email.com",
      "senha": "Senha123"
    },
    {
      "email": "joao@email.com",
      "senha": "OutraSenha456"
    }
  ]
}
```

---

## Validação

### JSON Válido vs Inválido

```json
// ✅ VÁLIDO
{
  "usuarios": [
    {
      "id": 1,
      "nome": "João",
      "tags": ["admin", "user"]
    }
  ]
}

// ❌ INVÁLIDO - undefined não é permitido
{
  "valor": undefined
}

// ❌ INVÁLIDO - NaN não é permitido
{
  "numero": NaN
}

// ❌ INVÁLIDO - Funções não são permitidas
{
  "funcao": function() {}
}
```

### Ferramentas de Validação

1. **JSONLint**: https://jsonlint.com/
2. **VS Code**: Extensão nativa de validação
3. **Online JSON Validator**: https://www.jsonschemavalidator.net/
4. **Programaticamente em JavaScript**:

```javascript
// Converter JSON para objeto JavaScript
const json = '{"nome":"João","idade":30}';
const objeto = JSON.parse(json);
console.log(objeto.nome); // João

// Converter objeto JavaScript para JSON
const obj = { nome: "Maria", idade: 25 };
const jsonString = JSON.stringify(obj);
console.log(jsonString); // {"nome":"Maria","idade":25}

// Com indentação (pretty print)
const jsonPretty = JSON.stringify(obj, null, 2);
```

---

## Boas Práticas

### 1. Estrutura Clara e Organizada

```json
// ✅ BOM - Estrutura clara e hierárquica
{
  "usuario": {
    "dados_pessoais": {
      "nome": "João",
      "email": "joao@email.com"
    },
    "dados_profissionais": {
      "cargo": "Desenvolvedor",
      "departamento": "TI"
    }
  }
}

// ❌ RUIM - Muitos níveis de aninhamento
{
  "u": {
    "d": {
      "n": "João",
      "e": "joao@email.com"
    }
  }
}
```

### 2. Nomes Significativos

```json
// ✅ BOM - Nomes claros
{
  "nomeProduto": "Notebook",
  "preco": 2500.00,
  "estoque": 10
}

// ❌ RUIM - Nomes confusos
{
  "np": "Notebook",
  "p": 2500.00,
  "e": 10
}
```

### 3. Consistência de Formato

```json
// ✅ BOM - camelCase consistente
{
  "nomeProduto": "Mouse",
  "precoVenda": 50.00,
  "dataCriacao": "2025-01-10"
}

// ❌ RUIM - Formato inconsistente
{
  "NomeProduto": "Mouse",
  "preco_venda": 50.00,
  "dataCriacao": "2025-01-10"
}
```

### 4. Datas em Formato ISO 8601

```json
// ✅ BOM - Padrão internacional
{
  "dataCriacao": "2025-11-20T10:30:00Z",
  "dataAtualizacao": "2025-11-20T15:45:30Z"
}

// ❌ RUIM - Formato ambíguo
{
  "dataCriacao": "20/11/2025",
  "dataAtualizacao": "20-11-2025"
}
```

### 5. Tamanho Apropriado

```json
// ✅ BOM - Respostas paginadas
{
  "dados": [
    { "id": 1, "nome": "Item 1" },
    { "id": 2, "nome": "Item 2" }
  ],
  "total": 1000,
  "pagina": 1,
  "porPagina": 2
}

// ❌ RUIM - Retornar tudo de uma vez
{
  "dados": [
    // ... 1000 itens ...
  ]
}
```

---

## Comparação: JSON vs JavaScript

| Característica | JSON | JavaScript |
|---|---|---|
| **Chaves** | Devem ter aspas duplas | Podem ser sem aspas |
| **Strings** | Devem ter aspas duplas | Podem ter aspas simples ou duplas |
| **Valores** | Sem funções, undefined, NaN | Suporta tudo |
| **Comentários** | Não permitidos | Permitidos |
| **Trailing commas** | Não permitidas | Permitidas (ES5+) |
| **Números** | Apenas valores numéricos | Suporta BigInt |

---

## Referências

- [JSON Official Site](https://www.json.org/)
- [MDN - JSON](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON Schema](https://json-schema.org/)
- [RFC 8259 - JSON](https://tools.ietf.org/html/rfc8259)


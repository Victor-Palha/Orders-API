# API REST - Especificação de Endpoints

## Visão Geral

Documentação dos endpoints necessários para integração entre frontend (Vue 3) e backend (NestJS).

**Stack Backend:** NestJS + TypeORM + MySQL + JWT  
**Base URL:** `http://localhost:3000/api`

---

## 1. Autenticação

### POST /auth/register
Criação de novo usuário no sistema.

Request Body:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

Response (201):
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-20T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Possíveis Erros:
```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": "Email já cadastrado",
  "error": "Bad Request"
}

// 400 Bad Request
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than 6 characters"],
  "error": "Bad Request"
}
```

---

### POST /auth/login
Autenticação de usuário existente.

Request Body:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

Response (200):
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Possíveis Erros:
```json
// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "error": "Unauthorized"
}
```

---

### GET /auth/me
Retorna dados do usuário autenticado (requer token JWT).

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-20T10:00:00.000Z"
}
```

Possíveis Erros:
```json
// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

---

## 2. Pedidos

### GET /orders
Lista todos os pedidos do usuário autenticado com suporte a filtros e paginação.

Headers:
```
Authorization: Bearer {token}
```

Query Parameters (opcionais):
```
?status=PENDING          // Filtrar por status
?page=1                  // Página (default: 1)
?limit=10                // Itens por página (default: 10)
?sortBy=createdAt        // Ordenar por campo (default: createdAt)
?sortOrder=DESC          // Ordem (ASC ou DESC, default: DESC)
```

Response (200):
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "status": "PENDING",
      "totalAmount": 299.99,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z",
      "processedAt": null,
      "items": [
        {
          "id": 1,
          "productId": 101,
          "productName": "Mouse Gamer",
          "quantity": 2,
          "unitPrice": 149.99,
          "totalPrice": 299.98
        }
      ]
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

Possíveis Erros:
```json
// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Token inválido",
  "error": "Unauthorized"
}
```

---

### GET /orders/:id
Retorna detalhes completos de um pedido específico (apenas se pertencer ao usuário autenticado).

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "id": 1,
  "userId": 1,
  "status": "PROCESSING",
  "totalAmount": 299.99,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:05:00.000Z",
  "processedAt": "2024-01-20T10:05:00.000Z",
  "items": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Mouse Gamer",
      "quantity": 2,
      "unitPrice": 149.99,
      "totalPrice": 299.98
    },
    {
      "id": 2,
      "productId": 102,
      "productName": "Teclado Mecânico",
      "quantity": 1,
      "unitPrice": 450.00,
      "totalPrice": 450.00
    }
  ]
}
```

Possíveis Erros:
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Pedido não encontrado",
  "error": "Not Found"
}

// 403 Forbidden (se o pedido não pertence ao usuário)
{
  "statusCode": 403,
  "message": "Você não tem permissão para acessar este pedido",
  "error": "Forbidden"
}
```

---

### POST /orders
Cria um novo pedido e envia para fila SQS para processamento assíncrono.

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request Body:
```json
{
  "items": [
    {
      "productId": 101,
      "productName": "Mouse Gamer",
      "quantity": 2,
      "unitPrice": 149.99
    },
    {
      "productId": 102,
      "productName": "Teclado Mecânico",
      "quantity": 1,
      "unitPrice": 450.00
    }
  ]
}
```

Response (201):
```json
{
  "id": 1,
  "userId": 1,
  "status": "PENDING",
  "totalAmount": 749.98,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z",
  "processedAt": null,
  "items": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Mouse Gamer",
      "quantity": 2,
      "unitPrice": 149.99,
      "totalPrice": 299.98
    },
    {
      "id": 2,
      "productId": 102,
      "productName": "Teclado Mecânico",
      "quantity": 1,
      "unitPrice": 450.00,
      "totalPrice": 450.00
    }
  ]
}
```

Possíveis Erros:
```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": [
    "items must be an array",
    "items must contain at least 1 element",
    "items[0].quantity must be a positive number"
  ],
  "error": "Bad Request"
}

// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Token inválido",
  "error": "Unauthorized"
}
```

---

## 3. Enum de Status

Status possíveis para pedidos:
```typescript
enum OrderStatus {
  PENDING = 'PENDING',           // Aguardando processamento
  PROCESSING = 'PROCESSING',     // Em processamento
  PROCESSED = 'PROCESSED',       // Processado pela fila
  COMPLETED = 'COMPLETED',       // Concluído
  CANCELLED = 'CANCELLED'        // Cancelado
}
```

---

## 4. Modelo de Dados

### Tabela: users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: orders
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('PENDING', 'PROCESSING', 'PROCESSED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabela: order_items
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## 5. Validações

### Endpoint /auth/register
- `name`: string, min 3 caracteres
- `email`: email válido, único
- `password`: string, min 6 caracteres

### **Login:**
- `email`: email válido
- `password`: string, não vazio

### Endpoint /orders (POST)
- `items`: array, min 1 item
- `items[].productId`: number, positivo
- `items[].productName`: string, não vazio
- `items[].quantity`: number, positivo, min 1
- `items[].unitPrice`: number, positivo, min 0.01

---

## 6. Autenticação JWT

### Estrutura do Token
```json
{
  "sub": 1,              // User ID
  "email": "joao@example.com",
  "iat": 1705747200,     // Issued at
  "exp": 1705833600      // Expires at (24h)
}
```

### Header de Autorização
```
Authorization: Bearer {token}
```

### Rotas Protegidas
- `GET /auth/me`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`

### Rotas Públicas
- `POST /auth/register`
- `POST /auth/login`

---

## 7. Integração AWS SQS

### Fluxo de Processamento Assíncrono

1. **Frontend** envia `POST /orders`
2. **Backend** salva no MySQL com status `PENDING`
3. **Backend** envia mensagem para AWS SQS:
```json
{
  "orderId": 1,
  "userId": 1,
  "totalAmount": 749.98,
  "items": [...],
  "createdAt": "2024-01-20T10:00:00.000Z"
}
```
4. **Microserviço** consome fila SQS
5. **Microserviço** atualiza status para `PROCESSED`
6. **Frontend** consulta `GET /orders/:id` e vê status atualizado

---

## 8. Exemplos de Integração

### Autenticação
```typescript
// src/services/auth.service.ts
const response = await api.post('/auth/login', {
  email: 'joao@example.com',
  password: 'senha123'
})
// Salva token: localStorage.setItem('token', response.data.token)
```

### Listagem de Pedidos
```typescript
// src/services/order.service.ts
const response = await api.get('/orders', {
  params: { status: 'PENDING' }
})
// response.data.data contém array de pedidos
```

### Criação de Pedido
```typescript
// src/services/order.service.ts
const response = await api.post('/orders', {
  items: [
    {
      productId: 101,
      productName: 'Mouse Gamer',
      quantity: 2,
      unitPrice: 149.99
    }
  ]
})
// response.data contém o pedido criado
```

---

## 9. Padrão de Erros

### Estrutura de Resposta
```json
{
  "statusCode": 400 | 401 | 403 | 404 | 500,
  "message": "Mensagem de erro" | ["array", "de", "erros"],
  "error": "Bad Request" | "Unauthorized" | "Forbidden" | "Not Found" | "Internal Server Error"
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validação)
- `401` - Unauthorized (sem token ou token inválido)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não existe)
- `500` - Internal Server Error

---

## 10. Seeds para Desenvolvimento

### Usuário de Teste
```json
{
  "name": "Admin BeComp",
  "email": "admin@becomp.com",
  "password": "admin123"
}
```

### Pedidos de Exemplo
```json
[
  {
    "userId": 1,
    "status": "PENDING",
    "items": [
      {
        "productId": 101,
        "productName": "Mouse Gamer RGB",
        "quantity": 2,
        "unitPrice": 149.99
      }
    ]
  },
  {
    "userId": 1,
    "status": "PROCESSING",
    "items": [
      {
        "productId": 102,
        "productName": "Teclado Mecânico",
        "quantity": 1,
        "unitPrice": 450.00
      }
    ]
  },
  {
    "userId": 1,
    "status": "COMPLETED",
    "items": [
      {
        "productId": 103,
        "productName": "Monitor 27\"",
        "quantity": 1,
        "unitPrice": 1299.99
      }
    ]
  }
]
```

---

## 11. Dependências Recomendadas

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.0",
  "mysql2": "^3.0.0",
  "bcrypt": "^5.1.0",
  "passport-jwt": "^4.0.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0",
  "aws-sdk": "^2.1000.0"
}
```

---

## 12. Checklist de Implementação

### Backend
- [ ] Configurar MySQL + TypeORM
- [ ] Criar entidades (User, Order, OrderItem)
- [ ] Implementar AuthModule (register, login, JWT)
- [ ] Implementar OrdersModule (CRUD)
- [ ] Adicionar validações (class-validator)
- [ ] Configurar CORS
- [ ] Implementar Guards (JWT)
- [ ] Integrar AWS SQS (enviar mensagem ao criar pedido)
- [ ] Criar seeds de teste
- [ ] Documentar com Swagger (opcional)

### Microserviço
- [ ] Consumir fila SQS
- [ ] Processar pedidos
- [ ] Atualizar status no MySQL

---

## Resumo dos Endpoints

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | /auth/register | Não | Registro de usuário |
| POST | /auth/login | Não | Autenticação |
| GET | /auth/me | Sim | Dados do usuário |
| GET | /orders | Sim | Listagem de pedidos |
| GET | /orders/:id | Sim | Detalhes do pedido |
| POST | /orders | Sim | Criação de pedido |

Total: 6 endpoints

---


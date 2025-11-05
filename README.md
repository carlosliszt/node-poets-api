# API REST de Poesias - Node.js + Express + MySQL

API REST completa para gerenciamento de poetas, livros e poemas com autenticação JWT e **frontend Bootstrap integrado**.

## 📋 Arquitetura

A API segue o padrão **MVC-S (Model-View-Controller-Service)** com:
- **Models**: Entidades de dados
- **DAO (Data Access Object)**: Camada de acesso ao banco de dados
- **Services**: Lógica de negócio
- **Controllers**: Controle de requisições HTTP
- **Middlewares**: Autenticação, validação e tratamento de erros
- **Routes**: Roteamento de endpoints
- **Frontend**: Interface web com Bootstrap 5

## 🚀 Tecnologias

### Backend
- Node.js
- Express
- MySQL2
- JWT (JSON Web Tokens)
- Bcryptjs
- Express-validator
- Helmet (Segurança)
- Morgan (Logs)
- CORS

### Frontend
- HTML5
- CSS3
- Bootstrap 5.3.2
- Bootstrap Icons
- JavaScript (ES6+)
- Google Fonts (Playfair Display + Roboto)

## 📁 Estrutura do Projeto

```
poets_api/
├── public/                      # Frontend
│   ├── css/
│   │   └── style.css           # Estilos customizados
│   ├── js/
│   │   ├── config.js           # Configuração da API
│   │   ├── auth.js             # Autenticação e utilitários
│   │   ├── index.js            # Página inicial
│   │   ├── login.js            # Login
│   │   ├── poets.js            # Gerenciamento de poetas
│   │   ├── books.js            # Gerenciamento de livros
│   │   └── poems.js            # Gerenciamento de poemas
│   ├── index.html              # Página inicial
│   ├── login.html              # Página de login
│   ├── register.html           # Página de registro
│   ├── poets.html              # Lista de poetas
│   ├── books.html              # Lista de livros
│   └── poems.html              # Lista de poemas
├── src/
│   ├── config/
│   │   └── database.js         # Configuração do MySQL
│   ├── models/
│   │   ├── User.js
│   │   ├── Poet.js
│   │   ├── Book.js
│   │   └── Poem.js
│   ├── dao/
│   │   ├── UserDAO.js
│   │   ├── PoetDAO.js
│   │   ├── BookDAO.js
│   │   └── PoemDAO.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── PoetService.js
│   │   ├── BookService.js
│   │   └── PoemService.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── PoetController.js
│   │   ├── BookController.js
│   │   └── PoemController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── poetValidator.js
│   │   ├── bookValidator.js
│   │   └── poemValidator.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── poetRoutes.js
│   │   ├── bookRoutes.js
│   │   └── poemRoutes.js
│   └── app.js
├── docs/
│   ├── schema.sql
│   ├── postman_collection.json
│   └── insomnia_collection.json
├── .env
├── package.json
└── server.js
```

## ⚙️ Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
Execute o script SQL em `docs/schema.sql` no seu MySQL:
```bash
mysql -u root -p < docs/schema.sql
```

### 3. Configurar variáveis de ambiente
O arquivo `.env` já está configurado. Ajuste se necessário:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=poesia

JWT_SECRET=chave_super_secreta
JWT_EXPIRES_IN=24h
```

### 4. Iniciar servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

### 5. Acessar a aplicação
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

## 🎨 Frontend - Interface Web

O projeto inclui uma interface web completa e responsiva construída com Bootstrap 5:

### Páginas Disponíveis

#### 🏠 Página Inicial (`index.html`)
- Hero section com call-to-action
- Estatísticas em tempo real (poetas, livros, poemas)
- Poetas em destaque
- Design moderno com gradientes

#### 👥 Poetas (`poets.html`)
- Listagem completa de poetas
- Filtros por nacionalidade e movimento literário
- Busca em tempo real
- Cards com gradientes coloridos
- CRUD completo (autenticado)

#### 📚 Livros (`books.html`)
- Catálogo de livros
- Filtro por poeta
- Busca por título/descrição
- Informações detalhadas (ISBN, editora, páginas)
- CRUD completo (autenticado)

#### ✍️ Poemas (`poems.html`)
- Biblioteca de poemas
- Filtros por livro, tema e estilo
- Visualização completa do poema em modal
- Fonte especial para melhor leitura
- CRUD completo (autenticado)

#### 🔐 Login/Registro
- Autenticação JWT
- Formulários validados
- Mensagens de feedback
- Credenciais padrão: `admin` / `admin`

### Recursos do Frontend

✨ **Design Moderno**
- Gradientes coloridos
- Animações suaves
- Cards com hover effects
- Layout responsivo

🎨 **Componentes Bootstrap**
- Navbar sticky
- Cards
- Modals
- Forms
- Badges
- Alerts/Toasts

🔒 **Autenticação**
- Sistema de login/logout
- Token JWT armazenado no localStorage
- Proteção de rotas administrativas
- Exibição condicional de botões

📱 **Responsivo**
- Design mobile-first
- Breakpoints otimizados
- Menu hamburguer em dispositivos móveis

⚡ **Performance**
- Carregamento assíncrono
- Loading states
- Otimização de requisições

## 📚 Endpoints da API

### 🔐 Autenticação (`/api/auth`)

#### Registrar usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "email": "email@example.com",
  "password": "senha123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}
```

#### Obter usuário autenticado
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### 👥 Usuários (`/api/users`) - 🔒 Protegido

#### Listar todos os usuários
```http
GET /api/users
Authorization: Bearer {token}
```

#### Obter usuário por ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Criar usuário
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "novo_usuario",
  "email": "email@example.com",
  "password": "senha123"
}
```

#### Atualizar usuário
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "usuario_atualizado",
  "email": "novo_email@example.com"
}
```

#### Deletar usuário
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

### 📖 Poetas (`/api/poets`)

#### Listar todos os poetas
```http
GET /api/poets
# Filtros opcionais:
GET /api/poets?nationality=Brasileira
GET /api/poets?movement=Modernismo
```

#### Obter poeta por ID
```http
GET /api/poets/:id
```

#### Obter poeta com seus livros
```http
GET /api/poets/:id/books
```

#### Criar poeta - 🔒 Protegido
```http
POST /api/poets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nome do Poeta",
  "pseudonym": "Pseudônimo",
  "birth_year": 1900,
  "death_year": 1980,
  "nationality": "Brasileira",
  "literary_movement": "Modernismo",
  "biography": "Biografia do poeta...",
  "photo_url": "https://example.com/photo.jpg"
}
```

#### Atualizar poeta - 🔒 Protegido
```http
PUT /api/poets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nome Atualizado"
}
```

#### Deletar poeta - 🔒 Protegido
```http
DELETE /api/poets/:id
Authorization: Bearer {token}
```

### 📚 Livros (`/api/books`)

#### Listar todos os livros
```http
GET /api/books
# Filtro opcional:
GET /api/books?poet_id=1
```

#### Obter livro por ID
```http
GET /api/books/:id
```

#### Obter livro com seus poemas
```http
GET /api/books/:id/poems
```

#### Criar livro - 🔒 Protegido
```http
POST /api/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título do Livro",
  "poet_id": 1,
  "isbn": "978-1234567890",
  "publication_year": 2000,
  "publisher": "Editora",
  "pages": 200,
  "language": "Português",
  "edition": 1,
  "description": "Descrição do livro...",
  "cover_url": "https://example.com/cover.jpg"
}
```

#### Atualizar livro - 🔒 Protegido
```http
PUT /api/books/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título Atualizado"
}
```

#### Deletar livro - 🔒 Protegido
```http
DELETE /api/books/:id
Authorization: Bearer {token}
```

### ✍️ Poemas (`/api/poems`)

#### Listar todos os poemas
```http
GET /api/poems
# Filtros opcionais:
GET /api/poems?book_id=1
GET /api/poems?theme=amor
GET /api/poems?style=soneto
```

#### Obter poema por ID
```http
GET /api/poems/:id
```

#### Criar poema - 🔒 Protegido
```http
POST /api/poems
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título do Poema",
  "book_id": 1,
  "content": "Conteúdo do poema...",
  "page_number": 42,
  "verses_count": 14,
  "stanzas_count": 4,
  "style": "Soneto",
  "theme": "Amor",
  "notes": "Notas sobre o poema..."
}
```

#### Atualizar poema - 🔒 Protegido
```http
PUT /api/poems/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título Atualizado",
  "content": "Conteúdo atualizado..."
}
```

#### Deletar poema - 🔒 Protegido
```http
DELETE /api/poems/:id
Authorization: Bearer {token}
```

## 🔒 Autenticação JWT

Para acessar rotas protegidas, você precisa:

1. Fazer login ou registrar um usuário
2. Obter o token JWT retornado
3. Incluir o token no header das requisições:
   ```
   Authorization: Bearer {seu_token_aqui}
   ```

### Rotas Públicas (sem autenticação):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/poets`
- `GET /api/poets/:id`
- `GET /api/poets/:id/books`
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/books/:id/poems`
- `GET /api/poems`
- `GET /api/poems/:id`

### Rotas Protegidas (requerem autenticação):
- Todas as rotas de `POST`, `PUT`, `DELETE`
- Todas as rotas de `/api/users`

## 🧪 Testando a API

### Usando o Frontend Web
1. Acesse http://localhost:3000
2. Faça login com `admin` / `admin`
3. Navegue pelas páginas e teste as funcionalidades

### Usando Postman/Insomnia
Importe as coleções em `docs/`:
- `postman_collection.json`
- `insomnia_collection.json`

### Usando cURL

#### 1. Registrar um usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"teste\",\"email\":\"teste@email.com\",\"password\":\"123456\"}"
```

#### 2. Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"teste\",\"password\":\"123456\"}"
```

#### 3. Listar poetas
```bash
curl http://localhost:3000/api/poets
```

#### 4. Criar um poeta (com autenticação)
```bash
curl -X POST http://localhost:3000/api/poets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d "{\"name\":\"Novo Poeta\",\"nationality\":\"Brasileira\"}"
```

## 📊 Padrões de Resposta

### Sucesso
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### Erro
```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [ ... ]
}
```

## 🛡️ Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Controle de acesso cross-origin
- **Bcrypt**: Hash de senhas
- **JWT**: Autenticação stateless
- **Express-validator**: Validação de entrada
- **Prepared Statements**: Proteção contra SQL Injection

## 📝 Observações

- O banco de dados já vem com dados de exemplo (poets, books, poems)
- Usuário admin padrão: `username: admin`, `password: admin`
- Todos os timestamps são gerenciados automaticamente pelo MySQL
- As relações entre tabelas são mantidas por foreign keys com CASCADE
- O frontend está totalmente integrado e responsivo
- Funciona em todos os navegadores modernos

## 🎯 Funcionalidades do Frontend

✅ **Implementadas:**
- ✨ Design responsivo e moderno
- 🔐 Sistema de login/registro
- 📊 Dashboard com estatísticas
- 👥 CRUD completo de poetas
- 📚 CRUD completo de livros
- ✍️ CRUD completo de poemas
- 🔍 Sistema de busca e filtros
- 🎨 Animações e transições suaves
- 📱 Mobile-first design
- 🌈 Gradientes coloridos
- 🔔 Notificações toast
- ⚡ Loading states
- 📖 Visualização de poemas em modal

## 🤝 Contribuindo

Para contribuir com este projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT


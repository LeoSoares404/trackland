# 📰 TrackLand Journal

Plataforma de notícias personalizadas desenvolvida como teste técnico para a vaga de Desenvolvedor na Trackland.

## 🎯 Sobre o Projeto

O TrackLand Journal é uma aplicação web full-stack que permite aos usuários acompanhar notícias personalizadas com base em seus interesses. O usuário pode cadastrar preferências de categorias, salvar notícias favoritas e acompanhar seu histórico de leitura.

## ✅ Funcionalidades

### Obrigatórias
- Cadastro e login de usuários com autenticação JWT
- Feed de notícias personalizado por categorias de interesse
- Preferências editáveis a qualquer momento
- Busca de notícias por palavra-chave
- Filtros por categoria
- Paginação de resultados
- Tratamento de estados de carregamento, erro e ausência de resultados
- Integração real com The Guardian API

### Opcionais implementados
- Sistema de favoritos (salvar e remover notícias)
- Histórico de leitura sem duplicidade
- Modo escuro / claro
- Layout editorial com notícia em destaque

## 🛠️ Tecnologias

### Backend
- ASP.NET Core 8 Web API (C#)
- ASP.NET Identity (autenticação e hash de senha)
- Entity Framework Core 8 (ORM)
- PostgreSQL (banco de dados)
- JWT Bearer (tokens de autenticação)
- Swagger (documentação da API)

### Frontend
- React 18 + Vite
- React Router DOM (roteamento)
- Axios (requisições HTTP)
- CSS Modules (estilização)

### API Externa
- The Guardian API (notícias)

## 📁 Estrutura do Projeto

trackland/
├── Trackland.API/              # Backend ASP.NET Core
│   ├── Controllers/            # Endpoints da API
│   │   ├── AuthController.cs       # Registro e login
│   │   ├── NewsController.cs       # Feed e busca de notícias
│   │   ├── PreferencesController.cs # Preferências do usuário
│   │   ├── FavoritesController.cs  # Sistema de favoritos
│   │   └── HistoryController.cs    # Histórico de leitura
│   ├── Models/                 # Entidades do banco
│   ├── Data/                   # DbContext
│   ├── Migrations/             # Migrations do EF Core
│   └── appsettings.json        # Configurações
│
└── trackland-web/              # Frontend React
└── src/
├── components/         # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── context/            # Context API (autenticação)
├── services/           # Configuração do Axios
└── styles/             # Variáveis CSS globais

## 🚀 Como Executar

### Pré-requisitos
- .NET 8 SDK
- Node.js 20+
- PostgreSQL

### Backend

1. Clone o repositório:
```bash
git clone https://github.com/LeoSoares404/trackland.git
cd trackland/Trackland.API
```

2. Configure o `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=trackland;Username=postgres;Password=SUA_SENHA"
  },
  "Jwt": {
    "Key": "sua-chave-secreta-aqui",
    "Issuer": "trackland-api",
    "Audience": "trackland-client"
  },
  "Guardian": {
    "ApiKey": "SUA_API_KEY"
  }
}
```

3. Execute as migrations e inicie:
```bash
dotnet ef database update
dotnet run
```

API disponível em `http://localhost:5205`
Swagger em `http://localhost:5205/swagger`

### Frontend

```bash
cd trackland/trackland-web
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`

## 🔐 Segurança

- A API key do Guardian fica **apenas no backend** — nunca exposta ao frontend
- Senhas armazenadas com hash via ASP.NET Identity (PBKDF2)
- Autenticação via JWT com expiração de 7 dias
- CORS configurado para aceitar apenas o frontend

## 📐 Decisões Técnicas

### Por que ASP.NET Core?
Escolhido por ser uma stack robusta e amplamente utilizada no mercado enterprise. O ASP.NET Identity fornece autenticação completa sem necessidade de implementação manual de hash de senha e geração de tokens.

### Por que CSS Modules?
Optamos por CSS Modules ao invés de bibliotecas como Tailwind ou Bootstrap para demonstrar domínio de CSS puro, com variáveis globais, responsividade real via media queries e micro-interações com transições.

### Por que The Guardian API?
Escolhida por ser gratuita sem limites rígidos de requisições, ter documentação clara e retornar dados estruturados em português quando disponível.

## ⚠️ Dificuldades Encontradas

### 1. Compatibilidade de versões do .NET
Ao instalar os pacotes NuGet sem especificar a versão, o gerenciador baixava automaticamente a versão 10.x (mais recente), que é incompatível com o .NET 8. Solução: especificar `--version 8.*` em todos os pacotes.

### 2. Remoção de favoritos com IDs complexos
Os IDs dos artigos da Guardian API contêm barras (ex: `technology/2026/may/15/article-name`), o que quebrava a rota REST padrão `/api/Favorites/{id}`. Solução: migrar para query string (`/api/Favorites?articleId=...`) no backend e usar `encodeURIComponent` no frontend.

### 3. Submodules no Git
Ao tentar subir os dois projetos para o mesmo repositório GitHub, o Git os tratou como submodules por possuírem seus próprios `.git`. Solução: remover os `.git` internos e fazer o commit a partir da pasta raiz.

### 4. Autenticação JWT no Swagger
O Swagger gerado pelo template padrão do ASP.NET não inclui suporte a JWT. Solução: configurar manualmente o `AddSecurityDefinition` e `AddSecurityRequirement` no `Program.cs`.

### 5. Dark mode persistente
O tema escuro precisava ser mantido ao recarregar a página. Solução: salvar a preferência no `localStorage` e aplicar via atributo `data-theme` no elemento raiz do HTML.

## 📹 Demonstração

[Link do vídeo de demonstração](#) — em breve

## 👨‍💻 Autor

**Leonardo Soares**
- GitHub: [@LeoSoares404](https://github.com/LeoSoares404)
- Email: leosalostiano@gmail.com
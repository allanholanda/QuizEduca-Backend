# QuizEduca - Backend

API desenvolvida para o Hackathon 5FSDT, com o objetivo de fornecer suporte a quizzes educacionais para professores e alunos da rede pública. A aplicação permite criação, edição, exclusão e resposta de quizzes, além de análises de desempenho.

## Tecnologias Utilizadas

- **Node.js** (v20+)
- **TypeScript** (v5)
- **Fastify** (v4) – framework web rápido e leve
- **TypeORM** (v0.3) – ORM para PostgreSQL
- **PostgreSQL** – banco de dados relacional
- **JSON Web Tokens (JWT)** – autenticação
- **Zod** – validação de schemas
- **Bcryptjs** – hash de senhas

## Arquitetura

O projeto segue uma arquitetura em camadas, organizada da seguinte forma:

src/
├── entities/ # Entidades do TypeORM (modelos de banco)
├── env/ # Configuração de variáveis de ambiente
├── http/ # Controllers, rotas, middlewares e schemas de validação
├── lib/ # Configuração da conexão com o banco (TypeORM)
├── repositories/ # Camada de acesso a dados (abstração do TypeORM)
├── use-cases/ # Lógica de negócio (casos de uso)
├── utils/ # Utilitários (erros personalizados, helpers)
├── app.ts # Configuração do Fastify
└── server.ts # Inicialização do servidor


## Pré-requisitos

- Node.js (versão 20 ou superior)
- PostgreSQL (versão 12 ou superior)
- Gerenciador de pacotes (npm ou yarn)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/allanholanda/QuizEduca-Backend
   cd quiz-educacional-backend

2. Instale as dependências:
    npm install

3. Configure as variáveis de ambiente:
    Crie um arquivo .env na raiz com o seguinte conteúdo:
        PORT=3000
        ENV=development
        DATABASE_USER=your_user
        DATABASE_HOST=localhost
        DATABASE_NAME=quiz_app
        DATABASE_PASSWORD=your_password
        DATABASE_PORT=5432
        JWT_SECRET=yout_jwt_secret

4. Realize a instalação do POSTGRES via Docker:
    docker pull postgres:latest
    docker run --name meu-postgres \
    -e POSTGRES_PASSWORD=senha-segura \
    -e POSTGRES_USER=usuario \
    -e POSTGRES_DB=meubanco \
    -p 5432:5432 \
    -d \
    postgres:latest

5. Utilize o DBeaver ou similar para se conectar ao POSTGRES.

6. Execute o script SQL abaixo para gerar o banco de dados:
    -- Criação do banco de dados (executar apenas uma vez)
    CREATE DATABASE quiz_app;

    -- Tabela de usuários (professores e alunos)
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, -- hash bcrypt
        role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de quizzes
    CREATE TABLE quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de perguntas
    CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('multiple_choice', 'true_false')),
        options JSONB, -- array de strings para múltipla escolha; nulo para verdadeiro/falso
        correct_answer JSONB NOT NULL, -- para múltipla escolha: índice (ex: 0) ; para V/F: true/false
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de submissões (tentativas dos alunos)
    CREATE TABLE submissions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        score NUMERIC(5,2), -- pontuação percentual (opcional)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de respostas individuais
    CREATE TABLE answers (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        selected_option JSONB NOT NULL, -- resposta do aluno (mesmo formato de correct_answer)
        is_correct BOOLEAN, -- pode ser calculado no backend ou no momento da correção
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Índices para melhor performance
    CREATE INDEX idx_quizzes_teacher ON quizzes(teacher_id);
    CREATE INDEX idx_questions_quiz ON questions(quiz_id);
    CREATE INDEX idx_submissions_quiz ON submissions(quiz_id);
    CREATE INDEX idx_submissions_student ON submissions(student_id);
    CREATE INDEX idx_answers_submission ON answers(submission_id);

    -- Atualização automática do updated_at em quizzes
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER trigger_update_quizzes_updated_at
        BEFORE UPDATE ON quizzes
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

7. Para rodar o projeto, execute o comando abaixo no terminal:
    npm run start:dev
    O servidor iniciará na porta configurada (padrão: 3000).

8. Rotas Principais
    Autenticação
        POST /auth/register – Registro de usuário (teacher ou student)
        POST /auth/login – Login, retorna token JWT

    Quizzes
        GET /quizzes – Lista quizzes (para professores: próprios; para alunos: todos)
        GET /quizzes/:id – Detalhes de um quiz
        POST /quizzes – Cria um novo quiz (apenas professor)
        PUT /quizzes/:id – Edita um quiz (apenas professor autor)
        DELETE /quizzes/:id – Remove um quiz (apenas professor autor)

    Submissões (respostas dos alunos)
        POST /submissions/start – Inicia uma nova tentativa de quiz
        POST /submissions/:id/submit – Envia as respostas de uma tentativa
        GET /submissions/:id – Retorna o resultado detalhado de uma submissão
        GET /submissions/my – Lista submissões do aluno logado

    Analytics
        GET /analytics/teacher – Estatísticas agregadas dos quizzes do professor

9. Testando com Postman
    Acesse a documentação em: .
    Crie um ambiente no Postman com a variável base_url apontando para http://localhost:3000.

Contribuição
Este projeto foi desenvolvido como parte de um hackathon educacional. Para contribuir, abra uma issue ou envie um pull request.

Licença
MIT
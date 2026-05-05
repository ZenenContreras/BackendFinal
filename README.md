# 🧠 SQL Judge — Plataforma Inteligente para Evaluación y Optimización de SQL

> Backend construido con **NestJS**, **Clean Architecture**, **PostgreSQL**, **Redis** y **Docker**.

Plataforma backend que permite evaluar automáticamente consultas SQL enviadas por estudiantes, medir su rendimiento y generar recomendaciones inteligentes de optimización. Similar a un juez online, pero orientado al aprendizaje de bases de datos.

---

## 📋 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelo de Dominio](#-modelo-de-dominio)
- [Stack Tecnológico](#-stack-tecnológico)
- [Primeros Pasos](#-primeros-pasos)
- [Variables de Entorno](#-variables-de-entorno)
- [Docker Compose](#-docker-compose)
- [Scripts Disponibles](#-scripts-disponibles)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Flujo General del Sistema](#-flujo-general-del-sistema)
- [Estrategia de Branching](#-estrategia-de-branching)
- [Contribución](#-contribución)

---

## 🏗 Arquitectura

El proyecto sigue los principios de **Clean Architecture**, separando responsabilidades en tres capas concéntricas:

```
┌──────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│   Controllers · Prisma Repos · JWT · Guards · BullMQ     │
│  ┌────────────────────────────────────────────────────┐  │
│  │                  APPLICATION                       │  │
│  │          Use Cases · DTOs · Interfaces             │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │                 DOMAIN                       │  │  │
│  │  │     Models · Repository Contracts · Errors   │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Regla de dependencia**: Las capas internas **nunca** dependen de las externas. `Domain` no conoce Prisma, NestJS ni Express.

---

## 📁 Estructura del Proyecto

```
backendFinal/
├── prisma/
│   └── schema.prisma              # Modelos de base de datos (Prisma ORM)
│
├── src/
│   ├── domain/                    # CAPA 1 — Reglas de Negocio (Pura)
│   │   ├── models/                # Entidades de dominio
│   │   │   ├── user.ts
│   │   │   ├── course.ts
│   │   │   ├── enrollment.ts
│   │   │   ├── challenge.ts
│   │   │   └── submission.ts
│   │   ├── repositories/          # Interfaces / Puertos (Contratos)
│   │   │   ├── user.repository.ts
│   │   │   ├── course.repository.ts
│   │   │   ├── challenge.repository.ts
│   │   │   └── submission.repository.ts
│   │   └── exceptions/            # Errores de dominio personalizados
│   │       └── domain.exception.ts
│   │
│   ├── application/               # CAPA 2 — Casos de Uso (Lógica)
│   │   ├── use-cases/
│   │   │   ├── auth/              # Login, Register
│   │   │   ├── users/             # GetProfile, ListUsers, UpdateRole
│   │   │   ├── courses/           # CreateCourse, EnrollStudent, etc.
│   │   │   ├── challenges/        # CreateChallenge, UploadSchema, etc.
│   │   │   └── submissions/       # CreateSubmission, GetSubmission
│   │   └── dtos/                  # Data Transfer Objects compartidos
│   │
│   ├── infrastructure/            # CAPA 3 — Implementaciones (NestJS / DB)
│   │   ├── auth/                  # Módulo de autenticación
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── dtos/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── common/                # Utilidades transversales
│   │   │   ├── filters/           # Filtros de excepciones HTTP
│   │   │   ├── interceptors/      # Interceptors de response
│   │   │   └── decorators/        # Decoradores custom
│   │   │
│   │   ├── config/                # Configuración de entorno
│   │   │
│   │   ├── database/              # Prisma ORM
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   │
│   │   ├── controllers/           # Entry points HTTP
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   └── users.module.ts
│   │   │   ├── courses/
│   │   │   │   ├── courses.controller.ts
│   │   │   │   └── courses.module.ts
│   │   │   ├── challenges/
│   │   │   │   ├── challenges.controller.ts
│   │   │   │   └── challenges.module.ts
│   │   │   └── submissions/
│   │   │       ├── submissions.controller.ts
│   │   │       └── submissions.module.ts
│   │   │
│   │   └── persistence/           # Implementaciones de repositorios
│   │       ├── user.prisma-repository.ts
│   │       ├── course.prisma-repository.ts
│   │       ├── challenge.prisma-repository.ts
│   │       └── submission.prisma-repository.ts
│   │
│   ├── worker/                    # Worker SQL (procesamiento asíncrono)
│   │   ├── worker.module.ts
│   │   └── submission.processor.ts
│   │
│   ├── app.module.ts              # Módulo raíz — une todas las capas
│   └── main.ts                    # Bootstrap de la aplicación
│
├── test/                          # Tests e2e
├── docker-compose.yml             # Servicios: API + PostgreSQL + Redis
├── Dockerfile                     # Imagen Docker de la API
├── .env.example                   # Variables de entorno de referencia
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📊 Modelo de Dominio

```
┌──────────┐       1:N        ┌──────────┐       1:N        ┌─────────────┐
│   User   │──────────────────│  Course   │──────────────────│  Challenge  │
│          │  (professor)     │           │                  │             │
│ ADMIN    │                  │ name      │                  │ title       │
│ PROFESSOR│                  │ code      │                  │ difficulty  │
│ STUDENT  │                  │ period    │                  │ tags[]      │
└──────────┘                  │ groupName │                  │ status      │
     │                        └──────────┘                  │ schemaSql   │
     │                             │                        │ seedDataSql │
     │  N:M (via Enrollment)       │                        │ expectedRes │
     └─────────────────────────────┘                        └─────────────┘
                                                                  │
                                                           1:N    │
                                                                  ▼
                                                          ┌──────────────┐
                                                          │  Submission  │
                                                          │              │
                                                          │ query        │
                                                          │ status       │
                                                          │ score        │
                                                          │ execTimeMs   │
                                                          │ feedback     │
                                                          └──────────────┘

┌──────────────┐       N:M (via EvaluationChallenge)      ┌─────────────┐
│  Evaluation  │──────────────────────────────────────────│  Challenge  │
│              │                                          │             │
│ name         │                                          │             │
│ startDate    │                                          │             │
│ endDate      │                                          │             │
│ maxAttempts  │                                          │             │
└──────────────┘                                          └─────────────┘
```

### Roles del sistema

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Gestionar usuarios, profesores, cursos. Consultar información general. |
| **PROFESSOR** | Crear cursos, inscribir estudiantes, crear retos SQL, crear evaluaciones, revisar resultados y reportes. |
| **STUDENT** | Ver cursos inscritos, consultar retos publicados, enviar soluciones SQL, consultar resultados y recomendaciones. |

---

## 🛠 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **NestJS 11** | Framework backend (Node.js) |
| **TypeScript** | Lenguaje principal |
| **Prisma ORM** | Modelado y acceso a base de datos |
| **PostgreSQL 16** | Base de datos principal |
| **Redis 7** | Cola de procesamiento (BullMQ) |
| **JWT + Passport** | Autenticación y autorización |
| **Swagger** | Documentación interactiva de la API |
| **Docker Compose** | Orquestación de servicios |
| **class-validator** | Validación de DTOs |
| **bcrypt** | Hash de contraseñas |

---

## 🚀 Primeros Pasos

### Prerrequisitos

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) y Docker Compose
- [npm](https://www.npmjs.com/) v10+

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd BackendFinal

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Levantar servicios (PostgreSQL + Redis)
docker compose up -d

# 5. Ejecutar migraciones de Prisma
npx prisma migrate dev

# 6. Generar cliente Prisma
npx prisma generate

# 7. Iniciar en modo desarrollo
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.  
La documentación Swagger en `http://localhost:3000/api`.

---

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgresql://user_admin:password123@localhost:5432/sql_judge_platform?schema=public"

# JWT
JWT_SECRET="tu-secreto-super-seguro-aqui"
JWT_EXPIRATION="24h"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# App
PORT=3000
```

---

## 🐳 Docker Compose

Servicios incluidos:

| Servicio | Imagen | Puerto | Descripción |
|---|---|---|---|
| `postgres` | `postgres:16` | `5432` | Base de datos principal |
| `redis` | `redis:7` | `6379` | Cola de procesamiento |

```bash
# Levantar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo watch (hot reload)
npm run start:debug        # Modo debug con watch

# Producción
npm run build              # Compilar TypeScript
npm run start:prod         # Ejecutar build compilado

# Calidad de código
npm run lint               # Linter (ESLint)
npm run format             # Formatear código (Prettier)

# Testing
npm run test               # Unit tests
npm run test:watch         # Tests en modo watch
npm run test:cov           # Coverage report
npm run test:e2e           # Tests end-to-end

# Base de datos
npx prisma migrate dev     # Crear/aplicar migraciones
npx prisma generate        # Regenerar cliente Prisma
npx prisma studio          # GUI para explorar la DB
```

---

## 📡 Endpoints de la API

### Auth
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/auth/register` | Público | Registrar usuario |
| `POST` | `/auth/login` | Público | Iniciar sesión (retorna JWT) |

### Usuarios
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `GET` | `/users` | ADMIN | Listar todos los usuarios |
| `GET` | `/users/me` | Autenticado | Obtener perfil propio |
| `GET` | `/users/:id` | ADMIN | Obtener usuario por ID |
| `PATCH` | `/users/:id/role` | ADMIN | Cambiar rol de un usuario |
| `DELETE` | `/users/:id` | ADMIN | Eliminar usuario |

### Cursos
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/courses` | PROFESSOR | Crear curso |
| `GET` | `/courses` | Autenticado | Listar cursos (filtrado por rol) |
| `GET` | `/courses/:id` | Autenticado | Detalle de un curso |
| `PATCH` | `/courses/:id` | PROFESSOR (owner) | Actualizar curso |
| `DELETE` | `/courses/:id` | PROFESSOR / ADMIN | Eliminar curso |
| `POST` | `/courses/:id/enroll` | PROFESSOR | Inscribir estudiante |
| `DELETE` | `/courses/:id/enroll/:studentId` | PROFESSOR | Desinscribir estudiante |
| `GET` | `/courses/:id/students` | PROFESSOR | Listar estudiantes inscritos |

### Retos SQL
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/challenges` | PROFESSOR | Crear reto |
| `GET` | `/challenges` | Autenticado | Listar retos (filtrado) |
| `GET` | `/challenges/:id` | Autenticado | Detalle de un reto |
| `PATCH` | `/challenges/:id` | PROFESSOR (owner) | Actualizar reto |
| `PATCH` | `/challenges/:id/status` | PROFESSOR | Cambiar estado |
| `DELETE` | `/challenges/:id` | PROFESSOR / ADMIN | Eliminar reto |
| `POST` | `/challenges/:id/schema` | PROFESSOR | Cargar esquema SQL (DDL) |
| `GET` | `/challenges/:id/schema` | PROFESSOR | Ver esquema cargado |
| `POST` | `/challenges/:id/expected-result` | PROFESSOR | Definir resultado esperado |
| `POST` | `/challenges/:id/seed-data` | PROFESSOR | Cargar datos de prueba |
| `POST` | `/challenges/:id/generate-data` | PROFESSOR | Generar datos aleatorios |
| `GET` | `/challenges/:id/seed-data` | PROFESSOR | Ver datos de prueba |

### Submissions
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/submissions` | STUDENT | Enviar solución SQL |
| `GET` | `/submissions/:id` | Autenticado | Consultar estado/resultado |
| `GET` | `/submissions/challenge/:challengeId` | Autenticado | Listar submissions de un reto |

---

## 🔄 Flujo General del Sistema

```
                                    ┌──────────────┐
                                    │   Profesor    │
                                    └──────┬───────┘
                                           │
                          Crea curso, retos, esquemas, datos
                                           │
                                           ▼
┌──────────┐    Envía SQL     ┌─────────────────────────┐
│Estudiante│─────────────────▶│        API NestJS       │
└──────────┘                  │  (Valida JWT + Roles)   │
                              └────────────┬────────────┘
                                           │
                                    Encola job
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │     Redis (BullMQ)      │
                              │    Cola de trabajos      │
                              └────────────┬────────────┘
                                           │
                                    Worker consume
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │      Worker SQL         │
                              │  Prepara runner Docker  │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │   Runner SQL (Docker)   │
                              │  • Crea DB temporal     │
                              │  • Carga esquema + data │
                              │  • Ejecuta query        │
                              │  • Mide tiempo          │
                              │  • Compara resultado    │
                              │  • Destruye container   │
                              └────────────┬────────────┘
                                           │
                              Resultado + Recomendaciones IA
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │    PostgreSQL (main)    │
                              │  Guarda calificación    │
                              └─────────────────────────┘
```

---

## 🌿 Estrategia de Branching

Seguimos **Git Flow** simplificado:

```
main ← Solo entregas estables (tags: v0.1.0, v1.0.0)
 └── develop ← Integración continua de features
      ├── feature/users-roles
      ├── feature/courses-enrollment
      ├── feature/challenges-schema
      └── feature/worker-stub-seeds
```

### Reglas

1. **Nunca** hacer push directo a `main` ni a `develop`
2. Todo cambio entra via **Pull Request** hacia `develop`
3. Cada PR requiere **aprobación** del director del proyecto
4. Cada feature branch nace de `develop` actualizado
5. Nombres de ramas: `feature/<nombre-descriptivo>`

### Workflow para crear una feature

```bash
# 1. Asegurarse de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/mi-feature

# 3. Desarrollar, commitear con mensajes descriptivos
git add .
git commit -m "feat(module): descripción clara del cambio"

# 4. Push y abrir PR
git push origin feature/mi-feature
# → Abrir PR en GitHub hacia develop
```

### Convención de commits

```
feat(auth): implement JWT login and register
fix(courses): correct enrollment validation
refactor(challenges): extract schema upload to use case
docs(readme): update API endpoints table
test(users): add unit tests for GetProfile use case
```

---

## 🤝 Contribución

| Integrante | Feature Branch | Módulo |
|---|---|---|
| Director (Arquitecto) | `develop` | Auth, Prisma, Guards, Config, Swagger, Docker |
| Compañero A | `feature/users-roles` | Gestión de usuarios y roles (CRUD) |
| Compañero B | `feature/courses-enrollment` | CRUD de cursos + inscripciones |
| Compañero C | `feature/challenges-schema` | CRUD de retos SQL + carga de esquemas |
| Compañero D | `feature/worker-stub-seeds` | Worker SQL stub + generador de datos de prueba |

---

## 📄 Licencia

Proyecto académico — Universidad. Todos los derechos reservados.

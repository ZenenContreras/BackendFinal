# Guia de Pruebas - SQL Judge Platform

Guia paso a paso para probar todos los endpoints de la plataforma. Las pruebas siguen un flujo logico donde cada seccion depende de la anterior.

**Base URL:** `http://localhost:3000`

---

## Requisitos previos

```bash
docker compose up --build -d
```

Verificar que los 3 contenedores esten corriendo:
```bash
docker ps
```

Esperado: `sql_judge_api`, `sql_judge_db`, `sql_judge_queue` todos con status `Up`.

---

## 1. Auth (Autenticacion)

### 1.1 Registrar un profesor

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Garcia",
    "email": "garcia@test.com",
    "password": "123456"
  }'
```

**Respuesta esperada (201):**
```json
{
  "id": "<PROFESSOR_ID>",
  "name": "Dr. Garcia",
  "email": "garcia@test.com",
  "role": "STUDENT"
}
```

> El usuario se crea como STUDENT. Hay que cambiar el rol manualmente en la BD:

```bash
docker exec sql_judge_db psql -U user_admin -d sql_judge_platform \
  -c "UPDATE users SET role='PROFESSOR' WHERE email='garcia@test.com';"
```

### 1.2 Registrar un estudiante

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Valerie Perez",
    "email": "valerie@test.com",
    "password": "123456"
  }'
```

**Respuesta esperada (201):**
```json
{
  "id": "<STUDENT_ID>",
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "role": "STUDENT"
}
```

### 1.3 Registrar un admin

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "123456"
  }'
```

Luego cambiar rol a ADMIN:
```bash
docker exec sql_judge_db psql -U user_admin -d sql_judge_platform \
  -c "UPDATE users SET role='ADMIN' WHERE email='admin@test.com';"
```

### 1.4 Login como profesor

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "garcia@test.com",
    "password": "123456"
  }'
```

**Respuesta esperada (200):**
```json
{
  "accessToken": "<TOKEN_PROFESSOR>",
  "user": {
    "id": "<PROFESSOR_ID>",
    "name": "Dr. Garcia",
    "email": "garcia@test.com",
    "role": "PROFESSOR"
  }
}
```

> Guardar el `accessToken` y el `id` del profesor para las siguientes pruebas.

### 1.5 Login como estudiante

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "valerie@test.com",
    "password": "123456"
  }'
```

> Guardar el `accessToken` y el `id` del estudiante.

### 1.6 Login como admin

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "123456"
  }'
```

> Guardar el `accessToken` del admin.

### 1.7 Login con credenciales invalidas (error esperado)

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "garcia@test.com",
    "password": "wrongpassword"
  }'
```

**Respuesta esperada (401):**
```json
{
  "message": "Datos Invalidos",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 1.8 Registro con email duplicado (error esperado)

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Otro User",
    "email": "garcia@test.com",
    "password": "123456"
  }'
```

**Respuesta esperada (409):**
```json
{
  "message": "El Email \"garcia@test.com\" ya esta registrado",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## 2. Users (Usuarios)

> Usar variables con los tokens obtenidos en la seccion anterior:
> - `TOKEN_PROF` = token del profesor
> - `TOKEN_STUDENT` = token del estudiante
> - `TOKEN_ADMIN` = token del admin

### 2.1 Ver perfil propio

```bash
curl -s http://localhost:3000/users/me \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):**
```json
{
  "id": "<PROFESSOR_ID>",
  "name": "Dr. Garcia",
  "email": "garcia@test.com",
  "role": "PROFESSOR"
}
```

### 2.2 Listar todos los usuarios (solo ADMIN)

```bash
curl -s http://localhost:3000/users \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

**Respuesta esperada (200):** Array con todos los usuarios registrados.

### 2.3 Obtener usuario por ID (solo ADMIN)

```bash
curl -s http://localhost:3000/users/<PROFESSOR_ID> \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

**Respuesta esperada (200):** Objeto con datos del profesor.

### 2.4 Cambiar rol de usuario (solo ADMIN)

```bash
curl -s -X PATCH http://localhost:3000/users/<STUDENT_ID>/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -d '{
    "role": "PROFESSOR"
  }'
```

**Respuesta esperada (200):**
```json
{
  "id": "<STUDENT_ID>",
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "role": "PROFESSOR"
}
```

> Revertir el cambio despues de probar:

```bash
curl -s -X PATCH http://localhost:3000/users/<STUDENT_ID>/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -d '{"role": "STUDENT"}'
```

### 2.5 Acceso denegado sin ser ADMIN

```bash
curl -s http://localhost:3000/users \
  -H "Authorization: Bearer <TOKEN_STUDENT>"
```

**Respuesta esperada (403):**
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 2.6 Acceso sin token

```bash
curl -s http://localhost:3000/users/me
```

**Respuesta esperada (401):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

## 3. Courses (Cursos)

### 3.1 Crear curso

```bash
curl -s -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "name": "Bases de Datos II",
    "code": "BD2-2026",
    "period": "2026-1",
    "groupName": "1",
    "professorId": "<PROFESSOR_ID>"
  }'
```

**Respuesta esperada (201):**
```json
{
  "id": "<COURSE_ID>",
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "groupName": "1",
  "professorId": "<PROFESSOR_ID>",
  "professor": {
    "id": "<PROFESSOR_ID>",
    "name": "Dr. Garcia",
    "email": "garcia@test.com",
    "role": "PROFESSOR"
  },
  "students": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

> Guardar el `id` del curso como `COURSE_ID`.

### 3.2 Listar cursos

```bash
curl -s http://localhost:3000/courses \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Array con el curso creado.

### 3.3 Obtener curso por ID

```bash
curl -s http://localhost:3000/courses/<COURSE_ID> \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Objeto del curso con profesor y estudiantes.

### 3.4 Actualizar curso

```bash
curl -s -X PATCH http://localhost:3000/courses/<COURSE_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "name": "Bases de Datos Avanzadas"
  }'
```

**Respuesta esperada (200):** Curso con nombre actualizado.

### 3.5 Inscribir estudiante

```bash
curl -s -X POST http://localhost:3000/courses/<COURSE_ID>/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "studentId": "<STUDENT_ID>"
  }'
```

**Respuesta esperada (201):** Curso con el estudiante en el array `students`.

### 3.6 Listar estudiantes del curso

```bash
curl -s http://localhost:3000/courses/<COURSE_ID>/students \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Array con el estudiante inscrito.

### 3.7 Desinscribir estudiante

```bash
curl -s -X DELETE http://localhost:3000/courses/<COURSE_ID>/enroll/<STUDENT_ID> \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Curso con `students` vacio.

> Volver a inscribir al estudiante para las pruebas de challenges:

```bash
curl -s -X POST http://localhost:3000/courses/<COURSE_ID>/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{"studentId": "<STUDENT_ID>"}'
```

---

## 4. Challenges (Retos SQL)

### 4.1 Crear reto

```bash
curl -s -X POST http://localhost:3000/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "title": "Select All Users",
    "description": "Escribe una consulta SELECT para obtener todos los usuarios",
    "difficulty": "EASY",
    "tags": ["SELECT", "basics"],
    "courseId": "<COURSE_ID>"
  }'
```

**Respuesta esperada (201):**
```json
{
  "id": "<CHALLENGE_ID>",
  "title": "Select All Users",
  "description": "Escribe una consulta SELECT para obtener todos los usuarios",
  "difficulty": "EASY",
  "tags": ["SELECT", "basics"],
  "databaseEngine": "PostgreSQL",
  "timeLimit": 2000,
  "status": "DRAFT",
  "schemaSql": null,
  "seedDataSql": null,
  "expectedResult": null,
  "courseId": "<COURSE_ID>",
  "authorId": "<PROFESSOR_ID>",
  "createdAt": "...",
  "updatedAt": "..."
}
```

> Guardar el `id` del reto como `CHALLENGE_ID`.

### 4.2 Listar todos los retos

```bash
curl -s http://localhost:3000/challenges \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Array con el reto creado.

### 4.3 Filtrar retos por curso

```bash
curl -s "http://localhost:3000/challenges?courseId=<COURSE_ID>" \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Array solo con retos del curso indicado.

### 4.4 Obtener reto por ID

```bash
curl -s http://localhost:3000/challenges/<CHALLENGE_ID> \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Objeto del reto.

### 4.5 Actualizar reto

```bash
curl -s -X PATCH http://localhost:3000/challenges/<CHALLENGE_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "title": "Select All Users v2",
    "difficulty": "MEDIUM"
  }'
```

**Respuesta esperada (200):** Reto con titulo y dificultad actualizados.

### 4.6 Subir schema DDL

```bash
curl -s -X POST http://localhost:3000/challenges/<CHALLENGE_ID>/schema \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "schemaSql": "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));"
  }'
```

**Respuesta esperada (200):** Reto con `schemaSql` actualizado.

### 4.7 Obtener schema DDL

```bash
curl -s http://localhost:3000/challenges/<CHALLENGE_ID>/schema \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):**
```json
{
  "schemaSql": "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));"
}
```

### 4.8 Subir datos de prueba

```bash
curl -s -X POST http://localhost:3000/challenges/<CHALLENGE_ID>/seed-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "seedDataSql": "INSERT INTO users (name, email) VALUES ('\''John'\'', '\''john@test.com'\'');"
  }'
```

**Respuesta esperada (200):** Reto con `seedDataSql` actualizado.

### 4.9 Obtener datos de prueba

```bash
curl -s http://localhost:3000/challenges/<CHALLENGE_ID>/seed-data \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):**
```json
{
  "seedDataSql": "INSERT INTO users (name, email) VALUES ('John', 'john@test.com');"
}
```

### 4.10 Definir resultado esperado

```bash
curl -s -X POST http://localhost:3000/challenges/<CHALLENGE_ID>/expected-result \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "expectedResult": [
      {"id": 1, "name": "John", "email": "john@test.com"}
    ]
  }'
```

**Respuesta esperada (200):** Reto con `expectedResult` actualizado.

### 4.11 Publicar reto (cambiar estado)

```bash
curl -s -X PATCH http://localhost:3000/challenges/<CHALLENGE_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "status": "PUBLISHED"
  }'
```

**Respuesta esperada (200):** Reto con `status: "PUBLISHED"`.

### 4.12 Estudiante puede ver retos publicados

```bash
curl -s http://localhost:3000/challenges \
  -H "Authorization: Bearer <TOKEN_STUDENT>"
```

**Respuesta esperada (200):** Array con los retos (incluye el publicado).

### 4.13 Archivar reto

```bash
curl -s -X PATCH http://localhost:3000/challenges/<CHALLENGE_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROF>" \
  -d '{
    "status": "ARCHIVED"
  }'
```

**Respuesta esperada (200):** Reto con `status: "ARCHIVED"`.

### 4.14 Eliminar reto

```bash
curl -s -X DELETE http://localhost:3000/challenges/<CHALLENGE_ID> \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (200):** Objeto del reto eliminado.

### 4.15 Verificar eliminacion

```bash
curl -s http://localhost:3000/challenges/<CHALLENGE_ID> \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

**Respuesta esperada (404 o error):** Reto no encontrado.

---

## 5. Pruebas de permisos (negativas)

### 5.1 Estudiante no puede crear curso

```bash
curl -s -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_STUDENT>" \
  -d '{
    "name": "Curso Falso",
    "code": "FAKE",
    "period": "2026-1",
    "groupName": "1",
    "professorId": "<STUDENT_ID>"
  }'
```

**Respuesta esperada (403):** Forbidden.

### 5.2 Estudiante no puede crear reto

```bash
curl -s -X POST http://localhost:3000/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_STUDENT>" \
  -d '{
    "title": "Reto Falso",
    "description": "No deberia poder",
    "difficulty": "EASY",
    "tags": ["test"],
    "courseId": "<COURSE_ID>"
  }'
```

**Respuesta esperada (403):** Forbidden.

### 5.3 Estudiante no puede subir schema

```bash
curl -s -X POST http://localhost:3000/challenges/<CHALLENGE_ID>/schema \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_STUDENT>" \
  -d '{"schemaSql": "DROP TABLE users;"}'
```

**Respuesta esperada (403):** Forbidden.

### 5.4 Sin token no se puede acceder

```bash
curl -s http://localhost:3000/challenges
```

**Respuesta esperada (401):** Unauthorized.

---

## 6. Limpieza (opcional)

Eliminar el curso (elimina challenges asociados en cascada):
```bash
curl -s -X DELETE http://localhost:3000/courses/<COURSE_ID> \
  -H "Authorization: Bearer <TOKEN_PROF>"
```

Eliminar usuarios (solo ADMIN):
```bash
curl -s -X DELETE http://localhost:3000/users/<PROFESSOR_ID> \
  -H "Authorization: Bearer <TOKEN_ADMIN>"

curl -s -X DELETE http://localhost:3000/users/<STUDENT_ID> \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

---

## Resumen de endpoints

| # | Modulo | Metodo | Endpoint | Rol requerido |
|---|--------|--------|----------|---------------|
| 1 | Auth | POST | `/auth/register` | Ninguno |
| 2 | Auth | POST | `/auth/login` | Ninguno |
| 3 | Users | GET | `/users/me` | Cualquiera |
| 4 | Users | GET | `/users` | ADMIN |
| 5 | Users | GET | `/users/:id` | ADMIN |
| 6 | Users | PATCH | `/users/:id/role` | ADMIN |
| 7 | Users | DELETE | `/users/:id` | ADMIN |
| 8 | Courses | POST | `/courses` | PROFESSOR |
| 9 | Courses | GET | `/courses` | Cualquiera |
| 10 | Courses | GET | `/courses/:id` | Cualquiera |
| 11 | Courses | PATCH | `/courses/:id` | PROFESSOR |
| 12 | Courses | DELETE | `/courses/:id` | PROFESSOR, ADMIN |
| 13 | Courses | POST | `/courses/:id/enroll` | PROFESSOR |
| 14 | Courses | GET | `/courses/:id/students` | PROFESSOR |
| 15 | Courses | DELETE | `/courses/:id/enroll/:studentId` | PROFESSOR |
| 16 | Challenges | POST | `/challenges` | PROFESSOR |
| 17 | Challenges | GET | `/challenges` | Cualquiera |
| 18 | Challenges | GET | `/challenges/:id` | Cualquiera |
| 19 | Challenges | PATCH | `/challenges/:id` | PROFESSOR |
| 20 | Challenges | PATCH | `/challenges/:id/status` | PROFESSOR |
| 21 | Challenges | DELETE | `/challenges/:id` | PROFESSOR, ADMIN |
| 22 | Challenges | POST | `/challenges/:id/schema` | PROFESSOR |
| 23 | Challenges | GET | `/challenges/:id/schema` | PROFESSOR |
| 24 | Challenges | POST | `/challenges/:id/seed-data` | PROFESSOR |
| 25 | Challenges | GET | `/challenges/:id/seed-data` | PROFESSOR |
| 26 | Challenges | POST | `/challenges/:id/expected-result` | PROFESSOR |

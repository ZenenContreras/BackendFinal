# Modulo: Challenges (Retos SQL)

Documentacion de los endpoints de gestion de retos SQL para profesores y estudiantes.

---

## Modelo de datos

| Campo            | Tipo              | Descripcion                                      |
|------------------|-------------------|--------------------------------------------------|
| id               | UUID              | Identificador unico                              |
| title            | String            | Titulo del reto                                   |
| description      | String            | Descripcion del reto                              |
| difficulty       | Enum              | `EASY`, `MEDIUM`, `HARD`                         |
| tags             | String[]          | Etiquetas (ej: `["SELECT", "JOIN"]`)             |
| databaseEngine   | String            | Motor de BD (default: `"PostgreSQL"`)            |
| timeLimit        | Int               | Limite de tiempo en ms (default: `2000`)         |
| status           | Enum              | `DRAFT`, `PUBLISHED`, `ARCHIVED`                 |
| schemaSql        | String (nullable) | Script DDL (CREATE TABLE)                        |
| seedDataSql      | String (nullable) | Script de datos de prueba (INSERT INTO)          |
| expectedResult   | JSON (nullable)   | Resultado esperado para evaluacion automatica    |
| courseId         | UUID              | Curso al que pertenece                            |
| authorId         | UUID              | Profesor que creo el reto                         |
| createdAt        | DateTime          | Fecha de creacion                                 |
| updatedAt        | DateTime          | Fecha de ultima actualizacion                     |

---

## Endpoints

### POST `/challenges`
Crea un nuevo reto SQL.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Headers:**
```
Authorization: Bearer <token PROFESSOR>
```

**Body:**
```json
{
  "title": "Select All Users",
  "description": "Escribe una consulta SELECT para obtener todos los usuarios",
  "difficulty": "EASY",
  "tags": ["SELECT", "basics"],
  "courseId": "uuid-del-curso",
  "databaseEngine": "PostgreSQL",
  "timeLimit": 2000
}
```

> `databaseEngine` y `timeLimit` son opcionales.

**Respuesta exitosa (201):**
```json
{
  "id": "uuid-del-reto",
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
  "courseId": "uuid-del-curso",
  "authorId": "uuid-del-profesor",
  "createdAt": "2026-05-08T14:39:54.302Z",
  "updatedAt": "2026-05-08T14:39:54.302Z"
}
```

---

### GET `/challenges`
Lista todos los retos. Se puede filtrar por curso.

- **Token requerido:** SI
- **Rol requerido:** Cualquiera

**Query params opcionales:**
| Param    | Tipo   | Descripcion            |
|----------|--------|------------------------|
| courseId | UUID   | Filtrar por curso      |

**Ejemplo:**
```
GET /challenges?courseId=uuid-del-curso
```

**Respuesta exitosa (200):** Array de challenges.

---

### GET `/challenges/:id`
Obtiene un reto por su ID.

- **Token requerido:** SI
- **Rol requerido:** Cualquiera

**Respuesta exitosa (200):** Objeto challenge.

**Error (404):**
```json
{
  "message": "Reto no encontrado",
  "error": "RETO_NO_ENCONTRADO"
}
```

---

### PATCH `/challenges/:id`
Actualiza los datos de un reto.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Body (todos los campos opcionales):**
```json
{
  "title": "Nuevo titulo",
  "description": "Nueva descripcion",
  "difficulty": "MEDIUM",
  "tags": ["SELECT", "WHERE"],
  "databaseEngine": "PostgreSQL",
  "timeLimit": 3000
}
```

**Respuesta exitosa (200):** Objeto challenge actualizado.

---

### PATCH `/challenges/:id/status`
Cambia el estado del reto (ciclo de vida: DRAFT -> PUBLISHED -> ARCHIVED).

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Body:**
```json
{
  "status": "PUBLISHED"
}
```

Valores posibles: `DRAFT`, `PUBLISHED`, `ARCHIVED`

**Respuesta exitosa (200):** Objeto challenge actualizado.

---

### DELETE `/challenges/:id`
Elimina un reto.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR` o `ADMIN`

**Respuesta exitosa (200):** Objeto challenge eliminado.

---

### POST `/challenges/:id/schema`
Sube el script DDL (CREATE TABLE) del reto.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Body:**
```json
{
  "schemaSql": "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));"
}
```

**Respuesta exitosa (200):** Objeto challenge actualizado.

---

### GET `/challenges/:id/schema`
Obtiene el script DDL del reto.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Respuesta exitosa (200):**
```json
{
  "schemaSql": "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));"
}
```

---

### POST `/challenges/:id/seed-data`
Sube los datos de prueba (INSERT INTO) del reto.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Body:**
```json
{
  "seedDataSql": "INSERT INTO users (name, email) VALUES ('John', 'john@test.com');"
}
```

**Respuesta exitosa (200):** Objeto challenge actualizado.

---

### GET `/challenges/:id/seed-data`
Obtiene los datos de prueba del reto.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Respuesta exitosa (200):**
```json
{
  "seedDataSql": "INSERT INTO users (name, email) VALUES ('John', 'john@test.com');"
}
```

---

### POST `/challenges/:id/expected-result`
Define el resultado esperado para evaluacion automatica.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Body:**
```json
{
  "expectedResult": [
    {"id": 1, "name": "John", "email": "john@test.com"}
  ]
}
```

**Respuesta exitosa (200):** Objeto challenge actualizado.

---

## Flujo tipico de uso

1. **Crear reto** - `POST /challenges` (estado inicial: `DRAFT`)
2. **Subir schema** - `POST /challenges/:id/schema`
3. **Subir datos de prueba** - `POST /challenges/:id/seed-data`
4. **Definir resultado esperado** - `POST /challenges/:id/expected-result`
5. **Publicar reto** - `PATCH /challenges/:id/status` con `{"status": "PUBLISHED"}`
6. Los estudiantes pueden ver retos publicados via `GET /challenges`

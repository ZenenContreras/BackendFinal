# Modulo: Courses & Enrollment

Documentacion de los endpoints de gestion de cursos e inscripcion de estudiantes.

---

## Cursos

### POST `/courses`
Crea un nuevo curso asignado a un profesor.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Headers:**
```
Authorization: Bearer <token PROFESSOR>
```

**Body:**
```json
{
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "groupName": "1",
  "professorId": "uuid-del-profesor"
}
```

> `groupName` y `group` son alias. Se puede enviar cualquiera de los dos.

**Respuesta exitosa:** `201 Created`
```json
{
  "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "groupName": "1",
  "professorId": "uuid-del-profesor",
  "professor": {
    "id": "uuid-del-profesor",
    "name": "Dr. Garcia",
    "email": "garcia@test.com",
    "role": "PROFESSOR"
  },
  "students": [],
  "createdAt": "2026-05-07T10:00:00.000Z",
  "updatedAt": "2026-05-07T10:00:00.000Z"
}
```

---

### GET `/courses`
Retorna la lista de todos los cursos con su profesor y estudiantes.

- **Token requerido:** SI
- **Rol requerido:** Cualquier rol autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa:** `200 OK`
```json
[
  {
    "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "name": "Bases de Datos II",
    "code": "BD2-2026",
    "period": "2026-1",
    "groupName": "1",
    "professorId": "uuid-del-profesor",
    "professor": {
      "id": "uuid-del-profesor",
      "name": "Dr. Garcia",
      "email": "garcia@test.com",
      "role": "PROFESSOR"
    },
    "students": [],
    "createdAt": "2026-05-07T10:00:00.000Z",
    "updatedAt": "2026-05-07T10:00:00.000Z"
  }
]
```

---

### GET `/courses/:id`
Retorna el detalle de un curso especifico.

- **Token requerido:** SI
- **Rol requerido:** Cualquier rol autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Parametro en ruta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `id` | string | ID unico del curso |

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "groupName": "1",
  "professorId": "uuid-del-profesor",
  "professor": {
    "id": "uuid-del-profesor",
    "name": "Dr. Garcia",
    "email": "garcia@test.com",
    "role": "PROFESSOR"
  },
  "students": [
    {
      "id": "uuid-del-estudiante",
      "name": "Valerie Perez",
      "email": "valerie@test.com",
      "role": "STUDENT"
    }
  ],
  "createdAt": "2026-05-07T10:00:00.000Z",
  "updatedAt": "2026-05-07T10:00:00.000Z"
}
```

---

### PATCH `/courses/:id`
Actualiza los datos de un curso existente.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Headers:**
```
Authorization: Bearer <token PROFESSOR>
```

**Parametro en ruta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `id` | string | ID unico del curso a modificar |

**Body (todos los campos son opcionales):**
```json
{
  "name": "Bases de Datos Avanzadas",
  "code": "BDA-2026",
  "period": "2026-2",
  "groupName": "2",
  "professorId": "uuid-de-otro-profesor"
}
```

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "name": "Bases de Datos Avanzadas",
  "code": "BDA-2026",
  "period": "2026-2",
  "groupName": "2",
  "professorId": "uuid-de-otro-profesor",
  "professor": { "..." : "..." },
  "students": [],
  "createdAt": "2026-05-07T10:00:00.000Z",
  "updatedAt": "2026-05-07T11:00:00.000Z"
}
```

---

### DELETE `/courses/:id`
Elimina un curso de la plataforma.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR` o `ADMIN`

**Headers:**
```
Authorization: Bearer <token PROFESSOR | ADMIN>
```

**Parametro en ruta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `id` | string | ID unico del curso a eliminar |

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "..."
}
```

---

## Inscripciones (Enrollment)

### POST `/courses/:id/enroll`
Inscribe un estudiante en un curso.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Headers:**
```
Authorization: Bearer <token PROFESSOR>
```

**Parametro en ruta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `id` | string | ID del curso |

**Body:**
```json
{
  "studentId": "uuid-del-estudiante"
}
```

> El usuario debe existir y tener rol `STUDENT`. Si ya esta inscrito, no se duplica.

**Respuesta exitosa:** `201 Created`
```json
{
  "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "name": "Bases de Datos II",
  "students": [
    {
      "id": "uuid-del-estudiante",
      "name": "Valerie Perez",
      "email": "valerie@test.com",
      "role": "STUDENT"
    }
  ],
  "..."
}
```

---

### GET `/courses/:id/students`
Lista los estudiantes inscritos en un curso.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Headers:**
```
Authorization: Bearer <token PROFESSOR>
```

**Parametro en ruta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `id` | string | ID del curso |

**Respuesta exitosa:** `200 OK`
```json
[
  {
    "id": "uuid-del-estudiante",
    "name": "Valerie Perez",
    "email": "valerie@test.com",
    "role": "STUDENT"
  }
]
```

---

### DELETE `/courses/:id/enroll/:studentId`
Desinscribe un estudiante de un curso.

- **Token requerido:** SI
- **Rol requerido:** `PROFESSOR`

**Headers:**
```
Authorization: Bearer <token PROFESSOR>
```

**Parametros en ruta:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `id` | string | ID del curso |
| `studentId` | string | ID del estudiante a desinscribir |

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "name": "Bases de Datos II",
  "students": [],
  "..."
}
```

---

## Errores comunes

| Codigo | Error | Causa |
|--------|-------|-------|
| `400` | Bad Request | Campos faltantes, formato incorrecto o el usuario no tiene el rol esperado |
| `401` | Unauthorized | Token no enviado o invalido |
| `403` | Forbidden | El rol del usuario no tiene permiso para esta accion |
| `404` | Not Found | El curso, profesor o estudiante no existe |
| `409` | Conflict | El codigo del curso ya existe |

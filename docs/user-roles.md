# Módulo: Users & Roles

Documentación de los endpoints de autenticación y gestión de usuarios.

---

## Autenticación

### POST `/auth/register`
Registra un nuevo usuario en la plataforma. Por defecto se asigna el rol `STUDENT`.

- **Token requerido:** NO
- **Rol requerido:** Ninguno

**Body:**
```json
{
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "password": "123456"
}
```

**Respuesta exitosa:** `201 Created`
```json
{
  "id": "a76ba004-1401-44ed-8f9e-2ca6b3178929",
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "role": "STUDENT"
}
```

---

### POST `/auth/login`
Inicia sesión y retorna un token JWT para usar en las rutas protegidas.

- **Token requerido:** NO
- **Rol requerido:** Ninguno

**Body:**
```json
{
  "email": "valerie@test.com",
  "password": "123456"
}
```

**Respuesta exitosa:** `200 OK`
```json
{
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "a76ba004-1401-44ed-8f9e-2ca6b3178929",
    "name": "Valerie Perez",
    "email": "valerie@test.com",
    "role": "STUDENT"
  }
}
```

---

## Usuarios

### GET `/users/me`
Retorna el perfil del usuario autenticado.

- **Token requerido:** SI
- **Rol requerido:** Cualquier rol autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "a76ba004-1401-44ed-8f9e-2ca6b3178929",
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "role": "STUDENT"
}
```

---

### GET `/users`
Retorna la lista de todos los usuarios registrados.

- **Token requerido:** SI
- **Rol requerido:** `ADMIN`

**Headers:**
```
Authorization: Bearer <token ADMIN>
```

**Respuesta exitosa:** `200 OK`
```json
[
  {
    "id": "a76ba004-1401-44ed-8f9e-2ca6b3178929",
    "name": "Valerie Perez",
    "email": "valerie@test.com",
    "role": "STUDENT"
  }
]
```

---

### GET `/users/:id`
Retorna la información de un usuario específico.

- **Token requerido:** SI
- **Rol requerido:** `ADMIN`

**Headers:**
```
Authorization: Bearer <token ADMIN>
```

**Parámetro en ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID único del usuario generado automáticamente |

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "a76ba004-1401-44ed-8f9e-2ca6b3178929",
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "role": "STUDENT"
}
```

---

### PATCH `/users/:id/role`
Cambia el rol de un usuario específico.

- **Token requerido:** SI
- **Rol requerido:** `ADMIN`

**Headers:**
```
Authorization: Bearer <token ADMIN>
```

**Parámetro en ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID único del usuario a modificar |

**Body:**
```json
{
  "role": "PROFESSOR"
}
```

> Valores válidos para `role`: `ADMIN`, `PROFESSOR`, `STUDENT`

**Respuesta exitosa:** `200 OK`
```json
{
  "id": "a76ba004-1401-44ed-8f9e-2ca6b3178929",
  "name": "Valerie Perez",
  "email": "valerie@test.com",
  "role": "PROFESSOR"
}
```

---

### DELETE `/users/:id`
Elimina un usuario de la plataforma.

- **Token requerido:** SI
- **Rol requerido:** `ADMIN`

**Headers:**
```
Authorization: Bearer <token ADMIN>
```

**Parámetro en ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID único del usuario a eliminar |

**Respuesta exitosa:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

## Errores comunes

| Código | Error | Causa |
|--------|-------|-------|
| `400` | Bad Request | Campos faltantes o con formato incorrecto |
| `401` | Unauthorized | Token no enviado o inválido |
| `403` | Forbidden | El rol del usuario no tiene permiso |
| `404` | Not Found | El usuario con ese ID no existe |
| `409` | Conflict | El email ya está registrado |
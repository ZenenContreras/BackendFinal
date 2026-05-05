## Backend Final Project

## Descripcion

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Estructura

```
src/
├── domain/                      # CAPA 1: Reglas de Negocio (Pura)
│   ├── models/                  # Entidades (User, Course, Challenge)
│   ├── repositories/            # Interfaces/Puertos (Contratos)
│   └── exceptions/              # Errores personalizados
├── use-cases/                   # CAPA 2: Casos de Uso (Lógica)
│   ├── auth/                    # Login, Register
│   ├── courses/                 # CreateCourse, ListCourses
│   └── challenges/              # CreateChallenge, UploadSchema
├── infrastructure/              # CAPA 3: Implementación (NestJS/DB)
│   ├── common/                  # Filtros, Interceptors, Decorators
│   ├── config/                  # TypeORM, Redis, Environment vars
│   ├── controllers/             # Entry points (HTTP)
│   ├── persistence/             # Mappers y Repositorios (TypeORM)
│   │   └── entities/            # Esquemas de BD (Decoradores @Entity)
│   └── services/                # Implementaciones (Bcrypt, JWT, Redis)
├── app.module.ts                # Unión de todas las capas
└── main.ts                      # Configuración de la aplicación
```

## Primeros Pasos

```bash
npm install
```

## Compilar y ejectar el proyecto

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Pruebas

```bash
# unit tests
npm run test

# e2e tests 
npm run test:e2e

# test coverage
npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).


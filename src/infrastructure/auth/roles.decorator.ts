import { SetMetadata } from '@nestjs/common';
import { Role } from '../../domain/models/user';

export const ROLES_KEY = 'roles';

// Uso: @Roles(Role.ADMIN) o @Roles(Role.ADMIN, Role.PROFESSOR)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
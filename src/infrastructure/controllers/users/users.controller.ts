import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role, User } from '../../../domain/models/user';
import { GetProfileUseCase } from '../../../application/use-cases/users/get-profile.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/users/update-role.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IsEnum } from 'class-validator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// DTO inline para actualizar rol
class UpdateRoleDto {
    @IsEnum(Role, { message: 'El Rol debe ser: ADMIN, PROFESSOR o STUDENT' })
    role!: Role;
}

function sanitizeUser(user: User) {
    const { passwordHash, ...safe } = user;
    return safe;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Todos los endpoints requieren JWT
export class UsersController {
    constructor(
        private readonly getProfileUseCase: GetProfileUseCase,
        private readonly updateRoleUseCase: UpdateRoleUseCase,
        private readonly userRepository: UserRepository,
    ) { }

    // GET /users/me — cualquier usuario autenticado
    @Get('me')
    async getMe(@Request() req: any) {
        const user = await this.getProfileUseCase.execute(req.user.userId);
        return sanitizeUser(user);
    }

    // GET /users — solo ADMIN
    @Get()
    @Roles(Role.ADMIN)
    async findAll() {
        return this.userRepository.findAll();
    }

    // GET /users/:id — solo ADMIN
    @Get(':id')
    @Roles(Role.ADMIN)
    async findOne(@Param('id') id: string) {
        const user = await this.getProfileUseCase.execute(id);
        return sanitizeUser(user);
    }

    // PATCH /users/:id/role — solo ADMIN
    @Patch(':id/role')
    @Roles(Role.ADMIN)
    async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        const user = await this.updateRoleUseCase.execute(id, dto.role);
        return sanitizeUser(user);
    }

    // DELETE /users/:id — solo ADMIN
    @Delete(':id')
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string) {
        await this.userRepository.delete(id);
        return { message: 'Usuario eliminado' };
    }
}
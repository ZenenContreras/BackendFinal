import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User, Role } from '../../../domain/models/user';
import { UserNotFoundException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class UpdateRoleUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(targetUserId: string, newRole: Role): Promise<User> {
        // Verificar que el usuario exista
        const user = await this.userRepository.findById(targetUserId);
        if (!user) {
            throw new UserNotFoundException(targetUserId);
        }

        // Actualizar rol
        return this.userRepository.updateRole(targetUserId, newRole);
    }
}
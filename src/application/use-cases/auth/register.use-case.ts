import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User, Role } from '../../../domain/models/user';
import { EmailAlreadyExistsException } from '../../../domain/exceptions/domain.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(name: string, email: string, password: string): Promise<User> {
        //  Verificar que el email no esté registrado
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new EmailAlreadyExistsException(email);
        }

        //  Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        //  Crear el usuario con rol STUDENT por defecto
        return this.userRepository.create({
            name,
            email,
            passwordHash,
            role: Role.STUDENT,
        });
    }
}
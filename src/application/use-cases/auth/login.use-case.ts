import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/models/user';
import { DomainException } from '../../../domain/exceptions/domain.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(email: string, password: string): Promise<User> {
        //  Buscar el usuario por email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            // Mismo mensaje para email y password
            throw new DomainException('Datos Invalidos', 'DATOS_INVALIDOS');
        }

        // Comparar la contraseña con el hash
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new DomainException('Datos Invalidos', 'DATOS_INVALIDOS');
        }

        return user;
    }
}
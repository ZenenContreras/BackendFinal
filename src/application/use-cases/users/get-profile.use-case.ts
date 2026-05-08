import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/models/user';
import { UserNotFoundException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class GetProfileUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }
        return user;
    }
}
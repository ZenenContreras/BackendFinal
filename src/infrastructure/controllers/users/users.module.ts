import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetProfileUseCase } from '../../../application/use-cases/users/get-profile.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/users/update-role.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserPrismaRepository } from '../../persistence/user.prisma-repository';

@Module({
    controllers: [UsersController],
    providers: [
        GetProfileUseCase,
        UpdateRoleUseCase,
        {
            provide: UserRepository,
            useClass: UserPrismaRepository,
        },
    ],
})
export class UsersModule { }
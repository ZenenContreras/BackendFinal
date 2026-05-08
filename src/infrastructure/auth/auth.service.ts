import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { DomainException } from '../../domain/exceptions/domain.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
        private readonly jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        try {
            const user = await this.loginUseCase.execute(dto.email, dto.password);

            // Generar JWT con los datos mínimos necesarios
            const token = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                accessToken: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (error) {
            if (error instanceof DomainException) {
                throw new UnauthorizedException(error.message);
            }
            throw error;
        }
    }

    async register(dto: RegisterDto) {
        try {
            const user = await this.registerUseCase.execute(
                dto.name,
                dto.email,
                dto.password,
            );

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
        } catch (error) {
            if (error instanceof DomainException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
}
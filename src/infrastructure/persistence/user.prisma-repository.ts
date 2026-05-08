import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, Role } from '../../domain/models/user';

@Injectable()
export class UserPrismaRepository implements UserRepository {

    constructor(private readonly prisma: PrismaService) { }

    // Prisma retorna sus propios tipos — los mapeamos a entidades de dominio
    private toEntity(raw: any): User {
        return new User({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            passwordHash: raw.passwordHash,
            role: raw.role as Role,
        });
    }

    async findById(id: string): Promise<User | null> {
        const raw = await this.prisma.db.user.findUnique({ where: { id } });
        return raw ? this.toEntity(raw) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const raw = await this.prisma.db.user.findUnique({ where: { email } });
        return raw ? this.toEntity(raw) : null;
    }

    async findAll(): Promise<User[]> {
        const rows = await this.prisma.db.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return rows.map(this.toEntity.bind(this));
    }

    async create(data: User): Promise<User> {
        const raw = await this.prisma.db.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                role: data.role,
            },
        });
        return this.toEntity(raw);
    }

    async updateRole(id: string, role: Role): Promise<User> {
        const raw = await this.prisma.db.user.update({
            where: { id },
            data: { role },
        });
        return this.toEntity(raw);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.db.user.delete({ where: { id } });
    }
}
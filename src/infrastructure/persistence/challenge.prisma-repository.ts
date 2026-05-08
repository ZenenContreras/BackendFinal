import { Injectable } from '@nestjs/common';
import { Challenge, ChallengeStatus } from '../../domain/models/challenge';
import {
  CreateChallengeData,
  IChallengeRepository,
  UpdateChallengeData,
} from '../../domain/repositories/challenge.repository';
import { PrismaService } from '../database/prisma.service';

type PrismaChallengeRaw = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  databaseEngine: string;
  timeLimit: number;
  status: string;
  schemaSql: string | null;
  seedDataSql: string | null;
  expectedResult: any | null;
  courseId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaChallengeRepository implements IChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChallengeData): Promise<Challenge> {
    const created = await this.prisma.challenge.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        tags: data.tags,
        databaseEngine: data.databaseEngine ?? 'PostgreSQL',
        timeLimit: data.timeLimit ?? 2000,
        courseId: data.courseId,
        authorId: data.authorId,
      },
    });

    return this.toDomain(created);
  }

  async findAll(courseId?: string): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return challenges.map((c) => this.toDomain(c));
  }

  async findById(id: string): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });

    return challenge ? this.toDomain(challenge) : null;
  }

  async update(id: string, data: UpdateChallengeData): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data,
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<Challenge> {
    const deleted = await this.prisma.challenge.delete({
      where: { id },
    });

    return this.toDomain(deleted);
  }

  async updateStatus(id: string, status: ChallengeStatus): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data: { status },
    });

    return this.toDomain(updated);
  }

  async uploadSchema(id: string, schemaSql: string): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data: { schemaSql },
    });

    return this.toDomain(updated);
  }

  async uploadSeedData(id: string, seedDataSql: string): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data: { seedDataSql },
    });

    return this.toDomain(updated);
  }

  async setExpectedResult(id: string, expectedResult: any): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data: { expectedResult },
    });

    return this.toDomain(updated);
  }

  private toDomain(raw: PrismaChallengeRaw): Challenge {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      difficulty: raw.difficulty as Challenge['difficulty'],
      tags: raw.tags,
      databaseEngine: raw.databaseEngine,
      timeLimit: raw.timeLimit,
      status: raw.status as ChallengeStatus,
      schemaSql: raw.schemaSql,
      seedDataSql: raw.seedDataSql,
      expectedResult: raw.expectedResult,
      courseId: raw.courseId,
      authorId: raw.authorId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
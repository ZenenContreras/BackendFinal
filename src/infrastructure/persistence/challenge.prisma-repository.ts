import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { Challenge } from '../../domain/models/challenge';
import {
  CHALLENGE_REPOSITORY,
  CreateChallengeData,
  IChallengeRepository,
  UpdateChallengeData,
} from '../../domain/repositories/challenge.repository';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaChallengeRepository implements IChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(challenge: CreateChallengeData): Promise<Challenge> {
    const created = await this.prisma.challenge.create({ data: challenge });
    return this.toDomain(created);
  }

  async findAll(): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany({ orderBy: { createdAt: 'desc' } });
    return challenges.map((item) => this.toDomain(item));
  }

  async findById(id: string): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    return challenge ? this.toDomain(challenge) : null;
  }

  async update(id: string, challenge: UpdateChallengeData): Promise<Challenge> {
    const updateData = {
      ...challenge,
      expectedResult: challenge.expectedResult as Prisma.InputJsonValue,
    };

    const updated = await this.prisma.challenge.update({
      where: { id },
      data: updateData as any,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<Challenge> {
    const deleted = await this.prisma.challenge.delete({ where: { id } });
    return this.toDomain(deleted);
  }

  async updateSchema(id: string, schemaSql: string): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({ where: { id }, data: { schemaSql } });
    return this.toDomain(updated);
  }

  async updateSeedData(id: string, seedDataSql: string): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({ where: { id }, data: { seedDataSql } });
    return this.toDomain(updated);
  }

  async updateExpectedResult(id: string, expectedResult: unknown): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data: { expectedResult: expectedResult as Prisma.InputJsonValue },
    });
    return this.toDomain(updated);
  }

  private toDomain(raw: any): Challenge {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      difficulty: raw.difficulty,
      tags: raw.tags,
      databaseEngine: raw.databaseEngine,
      timeLimit: raw.timeLimit,
      status: raw.status,
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

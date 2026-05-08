import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Challenge, ChallengeStatus, Difficulty } from '../../../domain/models/challenge';
import {
  CHALLENGE_REPOSITORY,
  CreateChallengeData,
  UpdateChallengeData,
} from '../../../domain/repositories/challenge.repository';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { GenerateDataDto } from './dto/generate-data.dto';
import { SeedDataDto } from './dto/seed-data.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { UpdateExpectedResultDto } from './dto/update-expected-result.dto';
import { UploadSchemaDto } from './dto/upload-schema.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: IChallengeRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateChallengeDto): Promise<Challenge> {
    this.assertRequired(dto.title, 'title');
    this.assertRequired(dto.description, 'description');
    this.assertRequired(dto.databaseEngine, 'databaseEngine');
    this.assertRequired(dto.courseId, 'courseId');
    this.assertRequired(dto.authorId, 'authorId');
    this.assertRequired(dto.tags, 'tags');

    await this.assertCourseExists(dto.courseId);
    await this.assertProfessorExists(dto.authorId);

    const challengeData: CreateChallengeData = {
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      tags: dto.tags,
      databaseEngine: dto.databaseEngine,
      timeLimit: dto.timeLimit,
      courseId: dto.courseId,
      authorId: dto.authorId,
    };

    return this.challengeRepository.create(challengeData);
  }

  findAll(): Promise<Challenge[]> {
    return this.challengeRepository.findAll();
  }

  async findOne(id: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    return challenge;
  }

  async update(id: string, dto: UpdateChallengeDto): Promise<Challenge> {
    await this.findOne(id);
    return this.challengeRepository.update(id, {
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      tags: dto.tags,
      databaseEngine: dto.databaseEngine,
      timeLimit: dto.timeLimit,
      status: dto.status,
    });
  }

  async updateStatus(id: string, status: ChallengeStatus): Promise<Challenge> {
    await this.findOne(id);
    return this.challengeRepository.update(id, { status });
  }

  async uploadSchema(id: string, dto: UploadSchemaDto): Promise<Challenge> {
    await this.findOne(id);
    return this.challengeRepository.updateSchema(id, dto.schemaSql);
  }

  async updateExpectedResult(
    id: string,
    dto: UpdateExpectedResultDto,
  ): Promise<Challenge> {
    await this.findOne(id);
    return this.challengeRepository.updateExpectedResult(id, dto.expectedResult);
  }

  async seedData(id: string, dto: SeedDataDto): Promise<Challenge> {
    await this.findOne(id);
    return this.challengeRepository.updateSeedData(id, dto.seedDataSql);
  }

  async getSeedData(id: string): Promise<{ seedDataSql?: string }> {
    const challenge = await this.findOne(id);
    return { seedDataSql: challenge.seedDataSql };
  }

  async generateData(
    id: string,
    dto: GenerateDataDto,
  ): Promise<{ seedDataSql: string }> {
    const challenge = await this.findOne(id);
    if (!challenge.schemaSql) {
      throw new BadRequestException('Schema SQL must be uploaded before generating data');
    }

    const seedDataSql = this.buildSeedDataSql(challenge.schemaSql, dto.count ?? 5);
    await this.challengeRepository.updateSeedData(id, seedDataSql);
    return { seedDataSql };
  }

  async delete(id: string): Promise<Challenge> {
    await this.findOne(id);
    return this.challengeRepository.delete(id);
  }

  private async assertCourseExists(courseId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  }

  private async assertProfessorExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'PROFESSOR') {
      throw new BadRequestException('Author must have PROFESSOR role');
    }
  }

  private assertRequired(value: unknown, field: string): void {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      throw new BadRequestException(`${field} is required`);
    }
  }

  private buildSeedDataSql(schemaSql: string, count: number): string {
    const tableName = this.extractTableName(schemaSql);
    const columns = this.extractTableColumns(schemaSql);

    if (columns.length === 0) {
      throw new BadRequestException('Unable to generate seed data from schema');
    }

    const inserts = Array.from({ length: count }, (_, index) => {
      const values = columns.map((column) => this.generateValue(column, index + 1));
      return `INSERT INTO ${tableName} (${columns.map((column) => column.name).join(', ')}) VALUES (${values.join(', ')});`;
    });

    return `-- Generated seed data for ${tableName}\n${inserts.join('\n')}`;
  }

  private extractTableName(schemaSql: string): string {
    const match = schemaSql.match(/create\s+table\s+[`"']?([a-zA-Z0-9_]+)[`"']?/i);
    if (!match) {
      throw new BadRequestException('No table definition found in schema SQL');
    }
    return match[1];
  }

  private extractTableColumns(schemaSql: string): Array<{ name: string; type: string }> {
    const blockMatch = schemaSql.match(/create\s+table\s+[`"']?[a-zA-Z0-9_]+[`"']?\s*\(([^;]+?)\)\s*;/is);
    if (!blockMatch) {
      return [];
    }

    return blockMatch[1]
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/,$/, ''))
      .filter((line) => line.length > 0)
      .filter((line) => !/^(primary key|unique|constraint|foreign key|check)/i.test(line))
      .map((line) => {
        const parts = line.split(/\s+/);
        return {
          name: parts[0].replace(/[`"']/g, ''),
          type: parts[1]?.toLowerCase() ?? 'text',
        };
      })
      .filter((column) => column.name && column.type);
  }

  private generateValue(column: { name: string; type: string }, index: number): string {
    const type = column.type;
    if (/int|serial|numeric|decimal|float|double|real/.test(type)) {
      return `${index}`;
    }

    if (/bool/.test(type)) {
      return index % 2 === 0 ? 'true' : 'false';
    }

    if (/date|time/.test(type)) {
      return `'2026-01-01'`;
    }

    if (/json|jsonb/.test(type)) {
      return `'{}'`;
    }

    return `'value_${column.name}_${index}'`;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CHALLENGE_REPOSITORY } from '../../../domain/repositories/challenge.repository';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { UpdateChallengeStatusDto } from './dto/update-challenge-status.dto';
import { UploadSchemaDto } from './dto/upload-schema.dto';
import { UploadSeedDataDto } from './dto/upload-seed-data.dto';
import { SetExpectedResultDto } from './dto/set-expected-result.dto';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async create(dto: CreateChallengeDto, authorId: string) {
    return this.challengeRepository.create({
      ...dto,
      authorId,
    });
  }

  async findAll(courseId?: string) {
    return this.challengeRepository.findAll(courseId);
  }

  async findOne(id: string) {
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }
    return challenge;
  }

  async update(id: string, dto: UpdateChallengeDto) {
    await this.findOne(id);
    return this.challengeRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.challengeRepository.delete(id);
  }

  async updateStatus(id: string, dto: UpdateChallengeStatusDto) {
    await this.findOne(id);
    return this.challengeRepository.updateStatus(id, dto.status);
  }

  async uploadSchema(id: string, dto: UploadSchemaDto) {
    await this.findOne(id);
    return this.challengeRepository.uploadSchema(id, dto.schemaSql);
  }

  async getSchema(id: string) {
    const challenge = await this.findOne(id);
    return { schemaSql: challenge.schemaSql ?? null };
  }

  async uploadSeedData(id: string, dto: UploadSeedDataDto) {
    await this.findOne(id);
    return this.challengeRepository.uploadSeedData(id, dto.seedDataSql);
  }

  async getSeedData(id: string) {
    const challenge = await this.findOne(id);
    return { seedDataSql: challenge.seedDataSql ?? null };
  }

  async setExpectedResult(id: string, dto: SetExpectedResultDto) {
    await this.findOne(id);
    return this.challengeRepository.setExpectedResult(id, dto.expectedResult);
  }
}
import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

export interface CreateChallengeDto {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  databaseEngine?: string;
  timeLimit?: number;
  courseId: string;
  authorId: string;
}

@Injectable()
export class CreateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(dto: CreateChallengeDto): Promise<Challenge> {
    if (!dto.title || !dto.description) {
      throw new DomainException('Título y descripción son obligatorios', 'DATOS_INVALIDOS');
    }

    return this.challengeRepository.create(dto);
  }
}
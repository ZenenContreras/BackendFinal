import { Injectable } from '@nestjs/common';
import type{ IChallengeRepository, UpdateChallengeData } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, data: UpdateChallengeData): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }

    return this.challengeRepository.update(id, data);
  }
}
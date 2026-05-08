import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge, ChallengeStatus } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class UpdateChallengeStatusUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, status: ChallengeStatus): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }

    return this.challengeRepository.updateStatus(id, status);
  }
}
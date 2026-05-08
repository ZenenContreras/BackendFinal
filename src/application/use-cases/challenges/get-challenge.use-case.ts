import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class GetChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }
    return challenge;
  }
}
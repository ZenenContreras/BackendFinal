import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class SetExpectedResultUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, expectedResult: any): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }

    if (!expectedResult) {
      throw new DomainException('El resultado esperado no puede estar vacío', 'DATOS_INVALIDOS');
    }

    return this.challengeRepository.setExpectedResult(id, expectedResult);
  }
}
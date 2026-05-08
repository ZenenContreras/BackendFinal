import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class UploadSeedDataUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, seedDataSql: string): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }

    if (!seedDataSql || seedDataSql.trim().length === 0) {
      throw new DomainException('Los datos de prueba no pueden estar vacíos', 'DATOS_INVALIDOS');
    }

    return this.challengeRepository.uploadSeedData(id, seedDataSql);
  }
}
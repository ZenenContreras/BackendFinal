import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';
import { DomainException } from '../../../domain/exceptions/domain.exception';

@Injectable()
export class UploadSchemaUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, schemaSql: string): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new DomainException('Reto no encontrado', 'RETO_NO_ENCONTRADO');
    }

    if (!schemaSql || schemaSql.trim().length === 0) {
      throw new DomainException('El esquema SQL no puede estar vacío', 'DATOS_INVALIDOS');
    }

    return this.challengeRepository.uploadSchema(id, schemaSql);
  }
}
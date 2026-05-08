import { Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/models/challenge';

@Injectable()
export class ListChallengesUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(courseId?: string): Promise<Challenge[]> {
    return this.challengeRepository.findAll(courseId);
  }
}
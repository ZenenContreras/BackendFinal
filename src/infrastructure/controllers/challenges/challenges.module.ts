import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from '../../../application/use-cases/challenges/challenges.service';
import { CHALLENGE_REPOSITORY } from '../../../domain/repositories/challenge.repository';
import { PrismaChallengeRepository } from '../../persistence/challenge.prisma-repository';

@Module({
  controllers: [ChallengesController],
  providers: [
    ChallengesService,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: PrismaChallengeRepository,
    },
  ],
})
export class ChallengesModule {}

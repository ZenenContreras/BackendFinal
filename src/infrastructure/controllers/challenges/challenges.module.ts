import { Module } from '@nestjs/common';
import { ChallengesService } from '../../../application/use-cases/challenges/challenges.service';
import { CHALLENGE_REPOSITORY } from '../../../domain/repositories/challenge.repository';
import { PrismaModule } from '../../database/prisma.module';
import { PrismaChallengeRepository } from '../../persistence/challenge.prisma-repository';
import { ChallengesController } from './challenges.controller';

@Module({
  imports: [PrismaModule],
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
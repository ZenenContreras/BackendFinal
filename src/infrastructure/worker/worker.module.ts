import { Module } from '@nestjs/common';
import { SubmissionProcessor } from './submission.processor';
import { CHALLENGE_REPOSITORY } from '../../domain/repositories/challenge.repository';
import { SUBMISSION_REPOSITORY } from '../../domain/repositories/submission.repository';
import { PrismaChallengeRepository } from '../persistence/challenge.prisma-repository';
import { PrismaSubmissionRepository } from '../persistence/submission.prisma-repository';

@Module({
  providers: [
    SubmissionProcessor,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: PrismaChallengeRepository,
    },
    {
      provide: SUBMISSION_REPOSITORY,
      useClass: PrismaSubmissionRepository,
    },
  ],
})
export class WorkerModule {}

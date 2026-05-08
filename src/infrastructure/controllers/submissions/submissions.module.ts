import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from '../../../application/use-cases/submissions/submissions.service';
import { PrismaSubmissionRepository } from '../../persistence/submission.prisma-repository';
import { SUBMISSION_REPOSITORY } from '../../../domain/repositories/submission.repository';

@Module({
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    {
      provide: SUBMISSION_REPOSITORY,
      useClass: PrismaSubmissionRepository,
    },
  ],
})
export class SubmissionsModule {}

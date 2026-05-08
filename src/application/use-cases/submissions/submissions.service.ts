import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import {
  CreateSubmissionData,
  UpdateSubmissionResultData,
  SUBMISSION_REPOSITORY,
} from '../../../domain/repositories/submission.repository';
import type { ISubmissionRepository } from '../../../domain/repositories/submission.repository';
import { SubmissionStatus } from '../../../domain/models/submission';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  private readonly queue: Queue;

  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: ISubmissionRepository,
    private readonly prisma: PrismaService,
  ) {
    const connection = {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
    };

    this.queue = new Queue('submissions', { connection });
  }

  async create(dto: CreateSubmissionDto) {
    await this.assertStudentExists(dto.studentId);
    await this.assertChallengeExists(dto.challengeId);

    const submissionData: CreateSubmissionData = {
      query: dto.query,
      status: SubmissionStatus.QUEUED,
      studentId: dto.studentId,
      challengeId: dto.challengeId,
    };

    const submission = await this.submissionRepository.create(submissionData);

    await this.queue.add('submission', {
      submissionId: submission.id,
      challengeId: dto.challengeId,
      studentId: dto.studentId,
      query: dto.query,
    });

    return submission;
  }

  async findById(id: string) {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    return submission;
  }

  async findByChallengeId(challengeId: string) {
    await this.assertChallengeExists(challengeId);
    return this.submissionRepository.findByChallengeId(challengeId);
  }

  async updateResult(id: string, result: UpdateSubmissionResultData) {
    return this.submissionRepository.updateResult(id, result);
  }

  private async assertStudentExists(studentId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: studentId }, select: { role: true } });
    if (!user) {
      throw new NotFoundException('Student not found');
    }
    if (user.role !== 'STUDENT') {
      throw new BadRequestException('User must have STUDENT role');
    }
  }

  private async assertChallengeExists(challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
  }
}

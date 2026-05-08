import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { Submission, SubmissionStatus } from '../../domain/models/submission';
import {
  CreateSubmissionData,
  ISubmissionRepository,
  SUBMISSION_REPOSITORY,
  UpdateSubmissionResultData,
} from '../../domain/repositories/submission.repository';

@Injectable()
export class PrismaSubmissionRepository implements ISubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(submission: CreateSubmissionData): Promise<Submission> {
    const created = await this.prisma.submission.create({ data: submission });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Submission | null> {
    const submission = await this.prisma.submission.findUnique({ where: { id } });
    return submission ? this.toDomain(submission) : null;
  }

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
      where: { challengeId },
      orderBy: { createdAt: 'desc' },
    });
    return submissions.map((item) => this.toDomain(item));
  }

  async updateStatus(id: string, status: SubmissionStatus): Promise<Submission> {
    const updated = await this.prisma.submission.update({ where: { id }, data: { status } });
    return this.toDomain(updated);
  }

  async updateResult(id: string, result: UpdateSubmissionResultData): Promise<Submission> {
    const updateData = {
      ...result,
      testResults: result.testResults as Prisma.InputJsonValue,
    };

    const updated = await this.prisma.submission.update({
      where: { id },
      data: updateData as any,
    });
    return this.toDomain(updated);
  }

  private toDomain(raw: any): Submission {
    return {
      id: raw.id,
      query: raw.query,
      status: raw.status,
      score: raw.score,
      executionTimeMs: raw.executionTimeMs,
      testResults: raw.testResults,
      feedback: raw.feedback,
      studentId: raw.studentId,
      challengeId: raw.challengeId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}

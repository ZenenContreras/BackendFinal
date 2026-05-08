import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import { CHALLENGE_REPOSITORY } from '../../domain/repositories/challenge.repository';
import type { IChallengeRepository } from '../../domain/repositories/challenge.repository';
import { SUBMISSION_REPOSITORY } from '../../domain/repositories/submission.repository';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { SubmissionStatus } from '../../domain/models/submission';

interface SubmissionJob {
  submissionId: string;
  challengeId: string;
  studentId: string;
  query: string;
}

@Injectable()
export class SubmissionProcessor implements OnModuleDestroy {
  private worker: Worker<SubmissionJob, unknown>;

  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: IChallengeRepository,
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: ISubmissionRepository,
  ) {
    const connection = {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
    };

    this.worker = new Worker(
      'submissions',
      async (job: Job<SubmissionJob>) => this.processSubmission(job),
      { connection },
    );
  }

  async onModuleDestroy() {
    await this.worker.close();
  }

  private async processSubmission(job: Job<SubmissionJob>) {
    const { submissionId, challengeId, query } = job.data;

    await this.submissionRepository.updateStatus(submissionId, SubmissionStatus.RUNNING);

    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) {
      await this.submissionRepository.updateResult(submissionId, {
        status: SubmissionStatus.RUNTIME_ERROR,
        score: 0,
        executionTimeMs: 0,
        feedback: 'Challenge not found',
      });
      return;
    }

    const executionTimeMs = 150 + Math.floor(Math.random() * 250);
    const normalizedQuery = query.trim().toLowerCase();
    const accepted = normalizedQuery.startsWith('select');

    const status = accepted
      ? SubmissionStatus.ACCEPTED
      : SubmissionStatus.WRONG_ANSWER;

    const score = accepted ? 100 : 0;
    const feedback = accepted
      ? 'Consulta aceptada por el worker stub. Más adelante podemos ejecutar el query real en un runner SQL.'
      : 'El worker stub no reconoce la consulta como un SELECT válido. Revisa la sintaxis y la lógica.';

    await this.submissionRepository.updateResult(submissionId, {
      status,
      score,
      executionTimeMs,
      testResults: {
        stub: true,
        query,
        expected: challenge.expectedResult ?? null,
      },
      feedback,
    });
  }
}

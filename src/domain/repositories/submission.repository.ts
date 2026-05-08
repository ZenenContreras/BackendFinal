import { Submission, SubmissionStatus } from '../models/submission';

export interface CreateSubmissionData {
  query: string;
  status: SubmissionStatus;
  studentId: string;
  challengeId: string;
}

export interface UpdateSubmissionResultData {
  status: SubmissionStatus;
  score?: number;
  executionTimeMs?: number;
  testResults?: unknown;
  feedback?: string;
}

export interface ISubmissionRepository {
  create(submission: CreateSubmissionData): Promise<Submission>;
  findById(id: string): Promise<Submission | null>;
  findByChallengeId(challengeId: string): Promise<Submission[]>;
  updateStatus(id: string, status: SubmissionStatus): Promise<Submission>;
  updateResult(id: string, result: UpdateSubmissionResultData): Promise<Submission>;
}

export const SUBMISSION_REPOSITORY = Symbol('SUBMISSION_REPOSITORY');

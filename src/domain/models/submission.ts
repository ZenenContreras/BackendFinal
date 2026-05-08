import { User } from './user';
import { Challenge } from './challenge';

export enum SubmissionStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  SYNTAX_ERROR = 'SYNTAX_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  OPTIMIZATION_REQUIRED = 'OPTIMIZATION_REQUIRED',
}

export class Submission {
  id?: string;
  query: string;
  status: SubmissionStatus;
  score?: number;
  executionTimeMs?: number;
  testResults?: unknown;
  feedback?: string;
  studentId: string;
  challengeId: string;
  student?: Omit<User, 'passwordHash'>;
  challenge?: Challenge;
  createdAt?: Date;
  updatedAt?: Date;
}

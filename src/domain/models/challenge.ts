import { User } from './user';
import { Course } from './course';

export enum ChallengeStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export type JsonValue = unknown;

export class Challenge {
  id?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  databaseEngine: string;
  timeLimit: number;
  status: ChallengeStatus;
  schemaSql?: string;
  seedDataSql?: string;
  expectedResult?: JsonValue;
  courseId: string;
  authorId: string;
  course?: Course;
  author?: Omit<User, 'passwordHash'>;
  createdAt?: Date;
  updatedAt?: Date;
}

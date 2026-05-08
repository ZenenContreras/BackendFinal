import { Challenge, ChallengeStatus, Difficulty } from '../models/challenge';

export interface CreateChallengeData {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  databaseEngine?: string;
  timeLimit?: number;
  courseId: string;
  authorId: string;
}

export interface UpdateChallengeData {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  tags?: string[];
  databaseEngine?: string;
  timeLimit?: number;
}

export interface IChallengeRepository {
  create(data: CreateChallengeData): Promise<Challenge>;
  findAll(courseId?: string): Promise<Challenge[]>;
  findById(id: string): Promise<Challenge | null>;
  update(id: string, data: UpdateChallengeData): Promise<Challenge>;
  delete(id: string): Promise<Challenge>;
  updateStatus(id: string, status: ChallengeStatus): Promise<Challenge>;
  uploadSchema(id: string, schemaSql: string): Promise<Challenge>;
  uploadSeedData(id: string, seedDataSql: string): Promise<Challenge>;
  setExpectedResult(id: string, expectedResult: any): Promise<Challenge>;
}

export const CHALLENGE_REPOSITORY = Symbol('CHALLENGE_REPOSITORY');
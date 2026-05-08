import { Challenge, ChallengeStatus, Difficulty, JsonValue } from '../models/challenge';

export interface CreateChallengeData {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  databaseEngine: string;
  timeLimit: number;
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
  status?: ChallengeStatus;
  schemaSql?: string;
  seedDataSql?: string;
  expectedResult?: JsonValue;
}

export interface IChallengeRepository {
  create(challenge: CreateChallengeData): Promise<Challenge>;
  findAll(): Promise<Challenge[]>;
  findById(id: string): Promise<Challenge | null>;
  update(id: string, challenge: UpdateChallengeData): Promise<Challenge>;
  delete(id: string): Promise<Challenge>;
  updateSchema(id: string, schemaSql: string): Promise<Challenge>;
  updateSeedData(id: string, seedDataSql: string): Promise<Challenge>;
  updateExpectedResult(id: string, expectedResult: JsonValue): Promise<Challenge>;
}

export const CHALLENGE_REPOSITORY = Symbol('CHALLENGE_REPOSITORY');

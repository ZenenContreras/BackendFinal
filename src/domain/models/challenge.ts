export type ChallengeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export class Challenge {
  id!: string;
  title!: string;
  description!: string;
  difficulty!: Difficulty;
  tags!: string[];
  databaseEngine!: string;
  timeLimit!: number;
  status!: ChallengeStatus;
  schemaSql?: string | null;
  seedDataSql?: string | null;
  expectedResult?: any | null;
  courseId!: string;
  authorId!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
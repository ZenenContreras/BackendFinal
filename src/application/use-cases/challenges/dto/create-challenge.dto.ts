import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ChallengeStatus, Difficulty } from '../../../../domain/models/challenge';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  @IsNotEmpty()
  databaseEngine!: string;

  @IsNotEmpty()
  timeLimit!: number;

  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;
}

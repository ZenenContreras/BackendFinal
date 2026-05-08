import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ChallengeStatus, Difficulty } from '../../../../domain/models/challenge';

export class UpdateChallengeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  databaseEngine?: string;

  @IsOptional()
  timeLimit?: number;

  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;
}

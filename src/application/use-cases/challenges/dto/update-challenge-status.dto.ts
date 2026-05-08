import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChallengeStatusDto {
  @ApiProperty({ enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] })
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
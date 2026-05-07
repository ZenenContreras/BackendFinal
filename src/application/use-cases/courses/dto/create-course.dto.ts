import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  code: string;

  @IsString()
  @MinLength(3)
  period: string;

  @IsOptional()
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsUUID()
  professorId: string;
}

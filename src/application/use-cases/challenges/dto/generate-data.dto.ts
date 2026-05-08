import { IsInt, IsOptional, Min } from 'class-validator';

export class GenerateDataDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number;
}

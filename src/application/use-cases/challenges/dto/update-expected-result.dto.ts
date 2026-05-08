import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateExpectedResultDto {
  @IsObject()
  @IsNotEmpty()
  expectedResult!: Record<string, unknown>;
}

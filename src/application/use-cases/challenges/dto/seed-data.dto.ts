import { IsNotEmpty, IsString } from 'class-validator';

export class SeedDataDto {
  @IsString()
  @IsNotEmpty()
  seedDataSql!: string;
}

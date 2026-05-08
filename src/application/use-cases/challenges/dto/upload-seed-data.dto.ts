import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadSeedDataDto {
  @ApiProperty({ description: 'Script con INSERT INTO...' })
  @IsString()
  seedDataSql!: string;
}
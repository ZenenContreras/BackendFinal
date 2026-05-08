import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadSchemaDto {
  @ApiProperty({ description: 'Script DDL con CREATE TABLE...' })
  @IsString()
  schemaSql!: string;
}
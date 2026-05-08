import { IsNotEmpty, IsString } from 'class-validator';

export class UploadSchemaDto {
  @IsString()
  @IsNotEmpty()
  schemaSql!: string;
}

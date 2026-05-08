import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetExpectedResultDto {
  @ApiProperty({ description: 'Resultado esperado en formato JSON' })
  @IsNotEmpty()
  expectedResult: any;
}
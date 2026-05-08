import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../../domain/models/user';
import { ChallengesService } from '../../../application/use-cases/challenges/challenges.service';
import { CreateChallengeDto } from '../../../application/use-cases/challenges/dto/create-challenge.dto';
import { UpdateChallengeDto } from '../../../application/use-cases/challenges/dto/update-challenge.dto';
import { UploadSchemaDto } from '../../../application/use-cases/challenges/dto/upload-schema.dto';
import { UpdateExpectedResultDto } from '../../../application/use-cases/challenges/dto/update-expected-result.dto';
import { SeedDataDto } from '../../../application/use-cases/challenges/dto/seed-data.dto';
import { GenerateDataDto } from '../../../application/use-cases/challenges/dto/generate-data.dto';
import { ChallengeStatus } from '../../../domain/models/challenge';

@ApiTags('Challenges')
@ApiBearerAuth()
@Controller('challenges')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @Roles(Role.PROFESSOR)
  create(@Body() dto: CreateChallengeDto) {
    return this.challengesService.create(dto);
  }

  @Get()
  findAll() {
    return this.challengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.challengesService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(Role.PROFESSOR)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ChallengeStatus,
  ) {
    return this.challengesService.updateStatus(id, status);
  }

  @Post(':id/schema')
  @Roles(Role.PROFESSOR)
  uploadSchema(@Param('id') id: string, @Body() dto: UploadSchemaDto) {
    return this.challengesService.uploadSchema(id, dto);
  }

  @Post(':id/expected-result')
  @Roles(Role.PROFESSOR)
  updateExpectedResult(
    @Param('id') id: string,
    @Body() dto: UpdateExpectedResultDto,
  ) {
    return this.challengesService.updateExpectedResult(id, dto);
  }

  @Post(':id/seed-data')
  @Roles(Role.PROFESSOR)
  seedData(@Param('id') id: string, @Body() dto: SeedDataDto) {
    return this.challengesService.seedData(id, dto);
  }

  @Get(':id/seed-data')
  @Roles(Role.PROFESSOR)
  getSeedData(@Param('id') id: string) {
    return this.challengesService.getSeedData(id);
  }

  @Post(':id/generate-data')
  @Roles(Role.PROFESSOR)
  generateData(
    @Param('id') id: string,
    @Body() dto: GenerateDataDto,
  ) {
    return this.challengesService.generateData(id, dto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.challengesService.delete(id);
  }
}

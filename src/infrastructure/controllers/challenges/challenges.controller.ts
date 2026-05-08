import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../../domain/models/user';
import { ChallengesService } from '../../../application/use-cases/challenges/challenges.service';
import { CreateChallengeDto } from '../../../application/use-cases/challenges/dto/create-challenge.dto';
import { UpdateChallengeDto } from '../../../application/use-cases/challenges/dto/update-challenge.dto';
import { UpdateChallengeStatusDto } from '../../../application/use-cases/challenges/dto/update-challenge-status.dto';
import { UploadSchemaDto } from '../../../application/use-cases/challenges/dto/upload-schema.dto';
import { UploadSeedDataDto } from '../../../application/use-cases/challenges/dto/upload-seed-data.dto';
import { SetExpectedResultDto } from '../../../application/use-cases/challenges/dto/set-expected-result.dto';

@ApiTags('Challenges')
@ApiBearerAuth()
@Controller('challenges')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @Roles(Role.PROFESSOR)
  create(@Body() dto: CreateChallengeDto, @Request() req) {
    return this.challengesService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return this.challengesService.findAll(courseId);
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
  updateStatus(@Param('id') id: string, @Body() dto: UpdateChallengeStatusDto) {
    return this.challengesService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.challengesService.remove(id);
  }

  @Post(':id/schema')
  @Roles(Role.PROFESSOR)
  uploadSchema(@Param('id') id: string, @Body() dto: UploadSchemaDto) {
    return this.challengesService.uploadSchema(id, dto);
  }

  @Get(':id/schema')
  @Roles(Role.PROFESSOR)
  getSchema(@Param('id') id: string) {
    return this.challengesService.getSchema(id);
  }

  @Post(':id/expected-result')
  @Roles(Role.PROFESSOR)
  setExpectedResult(@Param('id') id: string, @Body() dto: SetExpectedResultDto) {
    return this.challengesService.setExpectedResult(id, dto);
  }

  @Post(':id/seed-data')
  @Roles(Role.PROFESSOR)
  uploadSeedData(@Param('id') id: string, @Body() dto: UploadSeedDataDto) {
    return this.challengesService.uploadSeedData(id, dto);
  }

  @Get(':id/seed-data')
  @Roles(Role.PROFESSOR)
  getSeedData(@Param('id') id: string) {
    return this.challengesService.getSeedData(id);
  }
}
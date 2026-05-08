import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../../domain/models/user';
import { CreateSubmissionDto } from '../../../application/use-cases/submissions/dto/create-submission.dto';
import { SubmissionsService } from '../../../application/use-cases/submissions/submissions.service';

@ApiTags('Submissions')
@ApiBearerAuth()
@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @Roles(Role.STUDENT)
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findById(id);
  }

  @Get('challenge/:challengeId')
  findByChallenge(@Param('challengeId') challengeId: string) {
    return this.submissionsService.findByChallengeId(challengeId);
  }
}

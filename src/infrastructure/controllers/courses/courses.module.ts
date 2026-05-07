import { Module } from '@nestjs/common';
import { CoursesService } from '../../../application/use-cases/courses/courses.service';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course.repository';
import { PrismaModule } from '../../database/prisma.module';
import { PrismaCourseRepository } from '../../persistence/course.prisma-repository';
import { CoursesController } from './courses.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    {
      provide: COURSE_REPOSITORY,
      useClass: PrismaCourseRepository,
    },
  ],
})
export class CoursesModule {}

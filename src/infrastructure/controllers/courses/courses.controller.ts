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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../../domain/models/user';
import { CoursesService } from '../../../application/use-cases/courses/courses.service';
import { CreateCourseDto } from '../../../application/use-cases/courses/dto/create-course.dto';
import { EnrollStudentDto } from '../../../application/use-cases/courses/dto/enroll-student.dto';
import { UpdateCourseDto } from '../../../application/use-cases/courses/dto/update-course.dto';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.PROFESSOR)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/enroll')
  @Roles(Role.PROFESSOR)
  enrollStudent(
    @Param('id') courseId: string,
    @Body() enrollStudentDto: EnrollStudentDto,
  ) {
    return this.coursesService.enrollStudent(courseId, enrollStudentDto);
  }

  @Get(':id/students')
  @Roles(Role.PROFESSOR)
  listStudents(@Param('id') courseId: string) {
    return this.coursesService.listStudents(courseId);
  }

  @Delete(':id/enroll/:studentId')
  @Roles(Role.PROFESSOR)
  removeStudent(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.coursesService.removeStudent(courseId, studentId);
  }
}

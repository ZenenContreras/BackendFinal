import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoursesService } from '../../../application/use-cases/courses/courses.service';
import { CreateCourseDto } from '../../../application/use-cases/courses/dto/create-course.dto';
import { EnrollStudentDto } from '../../../application/use-cases/courses/dto/enroll-student.dto';
import { UpdateCourseDto } from '../../../application/use-cases/courses/dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
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
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/enroll')
  enrollStudent(
    @Param('id') courseId: string,
    @Body() enrollStudentDto: EnrollStudentDto,
  ) {
    return this.coursesService.enrollStudent(courseId, enrollStudentDto);
  }

  @Get(':id/students')
  listStudents(@Param('id') courseId: string) {
    return this.coursesService.listStudents(courseId);
  }

  @Delete(':id/enroll/:studentId')
  removeStudent(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.coursesService.removeStudent(courseId, studentId);
  }
}

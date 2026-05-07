import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Course } from '../../../domain/models/course';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course.repository';
import type { ICourseRepository } from '../../../domain/repositories/course.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly coursesRepository: ICourseRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    this.assertRequired(createCourseDto.name, 'name');
    this.assertRequired(createCourseDto.code, 'code');
    this.assertRequired(createCourseDto.period, 'period');
    this.assertRequired(createCourseDto.professorId, 'professorId');

    const groupName = this.resolveRequiredGroupName(createCourseDto);
    await this.assertProfessorExists(createCourseDto.professorId);

    try {
      return await this.coursesRepository.create({
        name: createCourseDto.name,
        code: createCourseDto.code,
        period: createCourseDto.period,
        groupName,
        professorId: createCourseDto.professorId,
      });
    } catch (error) {
      this.handleKnownPrismaError(error);
      throw error;
    }
  }

  findAll(): Promise<Course[]> {
    return this.coursesRepository.findAll();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    await this.findOne(id);

    if (updateCourseDto.professorId) {
      await this.assertProfessorExists(updateCourseDto.professorId);
    }

    const groupName = this.resolveGroupName(updateCourseDto);

    try {
      return await this.coursesRepository.update(id, {
        name: updateCourseDto.name,
        code: updateCourseDto.code,
        period: updateCourseDto.period,
        groupName,
        professorId: updateCourseDto.professorId,
      });
    } catch (error) {
      this.handleKnownPrismaError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<Course> {
    await this.findOne(id);
    return this.coursesRepository.delete(id);
  }

  async enrollStudent(
    courseId: string,
    enrollStudentDto: EnrollStudentDto,
  ): Promise<Course> {
    await this.findOne(courseId);
    this.assertRequired(enrollStudentDto.studentId, 'studentId');
    await this.assertStudentExists(enrollStudentDto.studentId);

    return this.coursesRepository.enrollStudent(
      courseId,
      enrollStudentDto.studentId,
    );
  }

  async listStudents(courseId: string): Promise<Course['students']> {
    const course = await this.findOne(courseId);
    return course.students ?? [];
  }

  async removeStudent(courseId: string, studentId: string): Promise<Course> {
    await this.findOne(courseId);
    await this.assertStudentExists(studentId);

    try {
      return await this.coursesRepository.removeStudent(courseId, studentId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Student is not enrolled in this course');
      }

      throw error;
    }
  }

  private resolveGroupName(dto: {
    groupName?: string;
    group?: string;
  }): string | undefined {
    return dto.groupName ?? dto.group;
  }

  private resolveRequiredGroupName(dto: {
    groupName?: string;
    group?: string;
  }): string {
    const groupName = this.resolveGroupName(dto);
    this.assertRequired(groupName, 'groupName');

    return groupName as string;
  }

  private async assertProfessorExists(professorId: string): Promise<void> {
    const professor = await this.prisma.user.findUnique({
      where: { id: professorId },
      select: { role: true },
    });

    if (!professor) {
      throw new NotFoundException('Professor not found');
    }

    if (professor.role !== 'PROFESSOR') {
      throw new BadRequestException('User must have PROFESSOR role');
    }
  }

  private async assertStudentExists(studentId: string): Promise<void> {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { role: true },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.role !== 'STUDENT') {
      throw new BadRequestException('User must have STUDENT role');
    }
  }

  private assertRequired(value: unknown, field: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required`);
    }
  }

  private handleKnownPrismaError(error: unknown): void {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return;
    }

    if (error.code === 'P2002') {
      throw new BadRequestException('Course code already exists');
    }
  }
}

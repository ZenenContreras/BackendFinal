import { Injectable } from '@nestjs/common';
import { Course } from '../../domain/models/course';
import {
  CreateCourseData,
  ICourseRepository,
  UpdateCourseData,
} from '../../domain/repositories/course.repository';
import { PrismaService } from '../database/prisma.service';

type PrismaCourseWithRelations = {
  id: string;
  name: string;
  code: string;
  period: string;
  groupName: string;
  professorId: string;
  createdAt: Date;
  updatedAt: Date;
  professor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  students?: Array<{
    student: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }>;
};

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: CreateCourseData): Promise<Course> {
    const created = await this.prisma.course.create({
      data: course,
      include: this.defaultInclude(),
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      include: this.defaultInclude(),
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((course) => this.toDomain(course));
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    return course ? this.toDomain(course) : null;
  }

  async update(id: string, course: UpdateCourseData): Promise<Course> {
    const updated = await this.prisma.course.update({
      where: { id },
      data: course,
      include: this.defaultInclude(),
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<Course> {
    const deleted = await this.prisma.course.delete({
      where: { id },
      include: this.defaultInclude(),
    });

    return this.toDomain(deleted);
  }

  async enrollStudent(courseId: string, studentId: string): Promise<Course> {
    await this.prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      create: {
        studentId,
        courseId,
      },
      update: {},
    });

    return this.listStudents(courseId);
  }

  async removeStudent(courseId: string, studentId: string): Promise<Course> {
    await this.prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    return this.listStudents(courseId);
  }

  async listStudents(courseId: string): Promise<Course> {
    const course = await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: this.defaultInclude(),
    });

    return this.toDomain(course);
  }

  private defaultInclude() {
    return {
      professor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      students: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    };
  }

  private toDomain(course: PrismaCourseWithRelations): Course {
    return {
      id: course.id,
      name: course.name,
      code: course.code,
      period: course.period,
      groupName: course.groupName,
      professorId: course.professorId,
      professor: course.professor as Course['professor'],
      students: course.students?.map((enrollment) => enrollment.student) as Course['students'] ?? [],
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}

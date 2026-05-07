import { Course } from '../models/course';

export interface CreateCourseData {
  name: string;
  code: string;
  period: string;
  groupName: string;
  professorId: string;
}

export interface UpdateCourseData {
  name?: string;
  code?: string;
  period?: string;
  groupName?: string;
  professorId?: string;
}

export interface ICourseRepository {
  create(course: CreateCourseData): Promise<Course>;
  findAll(): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  update(id: string, course: UpdateCourseData): Promise<Course>;
  delete(id: string): Promise<Course>;
  enrollStudent(courseId: string, studentId: string): Promise<Course>;
  removeStudent(courseId: string, studentId: string): Promise<Course>;
  listStudents(courseId: string): Promise<Course>;
}

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

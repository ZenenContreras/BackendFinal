import { User } from './user';

export class Course {
  id: string;
  name: string;
  code: string;
  period: string;
  groupName: string;
  professorId: string;
  professor?: Omit<User, 'passwordHash'>;
  students?: Array<Omit<User, 'passwordHash'>>;
  createdAt?: Date;
  updatedAt?: Date;
}

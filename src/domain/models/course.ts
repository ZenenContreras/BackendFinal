import { User } from './user';

export class Course {
  id: string;
  name: string;
  code: string;
  period: string;
  groupName: string;
  professorId: string;
  professor?: Omit<User, 'password'>;
  students?: Array<Omit<User, 'password'>>;
  createdAt?: Date;
  updatedAt?: Date;
}

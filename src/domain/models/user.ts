export enum Role {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  STUDENT = 'STUDENT',
}

export class User {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt?: Date;

  constructor(props: Omit<User, 'createdAt'>) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
  }
}
import { User, Role } from '../models/user';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract create(user: User): Promise<User>;
  abstract updateRole(id: string, role: Role): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
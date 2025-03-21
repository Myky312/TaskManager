import { Task } from '../../tasks/entities/task.entity';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class User {
  id: string;
  email: string;
  password: string;
  role: Role;
  tasks?: Task[];
}

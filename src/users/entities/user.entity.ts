import { Task } from '../../tasks/entities/task.entity';

export class User {
  id: string;
  email: string;
  password: string;
  tasks?: Task[];
}

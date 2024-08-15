import { Admin } from './models/admin.model';
import { Project } from './models/project.model';
import { Task } from './models/task.model';
import { User } from './models/user.model';

export const modelProvider = [
  {
    provide: 'PROJECT',
    useValue: Project,
  },
  {
    provide: 'TASK',
    useValue: Task,
  },
  {
    provide: 'USER',
    useValue: User,
  },
  {
    provide: 'ADMIN',
    useValue: Admin,
  },
];

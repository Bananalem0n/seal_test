import { Inject, Injectable } from '@nestjs/common';
import { Task } from 'src/models/task.model';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK')
    private readonly taskModel: typeof Task,
  ) {}
}

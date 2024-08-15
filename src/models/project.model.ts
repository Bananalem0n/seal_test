import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Task } from './task.model';

export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
    defaultValue: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @HasMany(() => Task) // Define the one-to-many relationship
  tasks: Task[];
}

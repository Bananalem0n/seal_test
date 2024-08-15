import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/models/user.model';
import { Project } from 'src/models/project.model';

@Table({ tableName: 'Tasks' })
export class Task extends Model {
  @Column
  title: string;

  @Column
  description: string;

  @Column
  status: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Project)
  project: Project;
}

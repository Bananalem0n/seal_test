import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Admin extends Model<Admin> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;
}

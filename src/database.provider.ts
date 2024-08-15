// import { Dialect, Sequelize } from 'sequelize';

// const database = process.env.DB_NAME ?? 'test-db';
// const db_user = process.env.DB_USER ?? 'root';
// const db_pass = process.env.DB_PASS ?? '';

// const db_type: Dialect = (process.env.DB_TYPE as Dialect) ?? 'mariadb';

// const db_port: number = process.env.DB_PORT
//   ? parseInt(process.env.DB_PORT)
//   : 3306;

// export const sequelize = new Sequelize(database, db_user, db_pass, {
//   host: process.env.DB_URL ?? 'localhost',
//   dialect: db_type,
//   port: db_port,
// });

import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Task } from './models/task.model';
import { Project } from './models/project.model';
import { User } from './models/user.model';
import { Admin } from './models/admin.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: (process.env.DB_TYPE as Dialect) ?? 'mariadb',
        host: process.env.DB_URL ?? 'localhost',
        port: parseInt(process.env.DB_PORT) ?? 3306,
        username: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASS ?? 'password',
        database: process.env.DB_NAME ?? '',
      });
      sequelize.addModels([Task, Project, User, Admin]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

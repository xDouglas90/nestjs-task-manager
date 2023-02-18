import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-flow').config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../../**/**/*.entity.ts}', 'dist/**/**/*.entity.js'],
  migrations: [
    __dirname + './migrations/*.ts',
    'dist/core/database/migrations/*.js',
  ],
  synchronize: true,
});

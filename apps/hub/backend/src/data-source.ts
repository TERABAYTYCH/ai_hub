import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'mysql',
  host: process.env.HUB_DB_HOST || 'localhost',
  port: parseInt(process.env.HUB_DB_PORT || '3306', 10),
  username: process.env.HUB_DB_USER || 'root',
  password: process.env.HUB_DB_PASSWORD || 'root',
  database: process.env.HUB_DB_NAME || 'hub_db',
  entities: [__dirname + '/auth/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: false,
};

export const AppDataSource = new DataSource(options);

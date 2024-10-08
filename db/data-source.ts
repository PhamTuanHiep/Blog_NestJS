import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'blog-nestjs',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  // migrationsTableName: "custom_migration_table", // teen thay the migration mac dinh
  synchronize: false, //ngăn DB tự động update các table
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

import { AppDataSource } from './typeorm.config';

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = AppDataSource;
      return dataSource.initialize();
    },
  },
];

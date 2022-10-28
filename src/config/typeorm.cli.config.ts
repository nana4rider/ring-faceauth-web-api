import { DataSource } from 'typeorm';
import { NamingStrategy } from 'typeorm-util-ts';
import configuration from './yaml';

export default new DataSource(
  Object.assign({}, configuration()['typeorm'], {
    entities: ['src/entity/*.entity.ts'],
    namingStrategy: new NamingStrategy(),
    migrations: ['src/migration/*.ts'],
    cli: {
      migrationsDir: 'src/migration',
    },
  }),
);

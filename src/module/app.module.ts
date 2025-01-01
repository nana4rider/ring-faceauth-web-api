import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamingStrategy, NestjsLogger } from 'typeorm-util-ts';
import configuration from '../config/yaml';
import { AppController } from '../controller/app.controller';
import { PersonModule } from './person.module';
import { RingModule } from './ring.module';
import { HealthModule } from './health.module';

const typeormModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    return Object.assign({}, configService.get('typeorm'), {
      namingStrategy: new NamingStrategy(),
      autoLoadEntities: true,
      logger:
        configService.get<string>('NODE_ENV') !== 'production'
          ? new NestjsLogger()
          : null,
    });
  },
  inject: [ConfigService],
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    typeormModule,
    HealthModule,
    PersonModule,
    RingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

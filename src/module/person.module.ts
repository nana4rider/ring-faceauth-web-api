import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from '../controller/person.controller';
import { Person } from '../entity/person.entity';
import { RekognitionRepository } from '../repository/rekognition.repository';
import { PersonService } from '../service/person.service';
@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  providers: [PersonService, RekognitionRepository],
  controllers: [PersonController],
})
export class PersonModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer) {}
}

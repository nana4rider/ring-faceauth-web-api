import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../entity/person.entity';
import { DiscordRepository } from '../repository/discord.repository';
import { InternalApiRepository } from '../repository/internal.repository';
import { RekognitionRepository } from '../repository/rekognition.repository';
import { RingRepository } from '../repository/ring.repository';
import { PersonService } from '../service/person.service';
import { RingService } from '../service/ring.service';
@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  providers: [
    PersonService,
    RingService,
    RingRepository,
    RekognitionRepository,
    {
      provide: 'MessengerRepository',
      useClass: DiscordRepository,
    },
    {
      provide: 'AnnouncementRepository',
      useClass: InternalApiRepository,
    },
    {
      provide: 'SmartLockRepository',
      useExisting: 'AnnouncementRepository',
    },
  ],
  controllers: [],
})
export class RingModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer) {}
}

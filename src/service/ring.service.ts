import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import fs from 'fs/promises';
import { DateTime } from 'luxon';
import path from 'path';
import {
  PushNotificationAction,
  PushNotificationDing,
  RingCamera,
} from 'ring-client-api';
import { Person } from '../entity/person.entity';
import { RingRepository } from '../repository/ring.repository';
import { PersonService } from './person.service';

@Injectable()
export class RingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RingService.name);

  constructor(
    private readonly ringRepository: RingRepository,
    private readonly personService: PersonService,
    @Inject('MessengerRepository')
    private readonly messengerRepository: MessengerRepository,
    @Inject('SmartLockRepository')
    private readonly smartLockRepository: SmartLockRepository,
    @Inject('AnnouncementRepository')
    private readonly announcementRepository: AnnouncementRepository,
  ) {}

  onApplicationBootstrap() {
    this.ringRepository.addListener(
      PushNotificationAction.Ding,
      this.onDing.bind(this),
    );
  }

  async onDing(camera: RingCamera, notification: PushNotificationDing) {
    const now = DateTime.now();
    void this.announcementRepository.ding();

    const snapshot = await camera
      .getSnapshot({ uuid: notification.ding.image_uuid })
      .catch((reason) => {
        this.logger.warn('snapshot failed', reason);
        return null;
      });

    if (!snapshot) return;

    this.logger.log('snapshot finished');

    void this.saveSnapshot(now, snapshot);

    this.logger.log('get person');
    const person = await this.personService.findByFaceImage(snapshot);

    this.logger.log('post messenger');
    void this.postMessenger(now, snapshot, person);

    if (!person) return;

    if (
      person.unlockExpirationAt &&
      person.unlockExpirationAt.diffNow().milliseconds >= 0
    ) {
      void this.smartLockRepository.unlock();
    }

    this.logger.log('announce');
    void this.announcementRepository.announce(person);
  }

  private async saveSnapshot(
    datetime: DateTime,
    snapshot: Buffer,
  ): Promise<void> {
    const snapshotPath = path.join(
      'snapshot',
      datetime.toFormat('yyyyMMddHHmmss') + '.jpg',
    );

    await fs.writeFile(snapshotPath, snapshot);
  }

  private async postMessenger(
    datetime: DateTime,
    snapshot: Buffer,
    person: Person | null,
  ) {
    const message = `Date: ${datetime.toFormat('yyyy/MM/dd HH:mm:ss')}
Name: ${person ? person.name : '未登録'}`;

    await this.messengerRepository.post(message, [
      {
        content: snapshot,
        name: datetime.toFormat('yyyyMMddHHmmss') + '.jpg',
      },
    ]);
  }
}

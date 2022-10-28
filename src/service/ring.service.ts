import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Face } from 'aws-sdk/clients/rekognition';
import fs from 'fs/promises';
import { DateTime } from 'luxon';
import path from 'path';
import {
  PushNotification,
  PushNotificationAction,
  RingCamera,
} from 'ring-client-api';
import { Person } from '../entity/person.entity';
import { RekognitionRepository } from '../repository/rekognition.repository';
import { RingRepository } from '../repository/ring.repository';
import { PersonService } from './person.service';

@Injectable()
export class RingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RingService.name);

  constructor(
    private readonly ringRepository: RingRepository,
    private readonly personService: PersonService,
    private readonly rekognitionRepository: RekognitionRepository,
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

  async onDing(camera: RingCamera, notification: PushNotification) {
    void this.announcementRepository.ding();

    const snapshot = await camera
      .getSnapshot({
        uuid: notification.ding.image_uuid,
      })
      .catch((reason) => {
        this.logger.warn('snapshot failed', reason);
        return null;
      });

    if (!snapshot) return;

    this.logger.log('snapshot finished');

    void this.saveSnapshot(snapshot);

    const face = await this.rekognitionRepository.searchFace(snapshot);

    const person = face?.FaceId
      ? await this.personService.findByFaceId(face?.FaceId)
      : null;

    void this.postMessenger(snapshot, face, person);

    if (!person) return;

    if (
      person.unlockExpirationAt &&
      person.unlockExpirationAt.diffNow().milliseconds >= 0
    ) {
      void this.smartLockRepository.unlock();
    }

    void this.announcementRepository.announce(person);
  }

  private async saveSnapshot(snapshot: Buffer): Promise<void> {
    const snapshotPath = path.join(
      'snapshot',
      DateTime.local().toFormat('yyyyMMddHHmmss') + '.jpg',
    );

    await fs.writeFile(snapshotPath, snapshot);
  }

  private async postMessenger(
    snapshot: Buffer,
    face: Face | null,
    person: Person | null,
  ) {
    let message;
    if (!face) {
      message = '未検出';
    } else if (!person) {
      message = '未登録';
    } else {
      message = person.name;
    }

    await this.messengerRepository.post(message, [
      {
        content: snapshot,
        name: 'result.jpg',
      },
    ]);
  }
}

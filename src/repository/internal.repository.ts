import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axiosBase, { AxiosInstance } from 'axios';
import { Person } from '../entity/person.entity';

/**
 * 独自(゜-゜)
 */
@Injectable()
export class InternalApiRepository
  implements AnnouncementRepository, SmartLockRepository
{
  private readonly logger = new Logger(InternalApiRepository.name);

  private axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = axiosBase.create({
      baseURL: this.configService.getOrThrow('internalApi.url'),
    });
  }

  async ding(): Promise<void> {
    await this.axios.post('/ring/ding');
  }

  async announce(person: Person): Promise<void> {
    this.logger.log('announce start');
    await this.axios.post('/ring/announcement', {
      message: person.family
        ? `${person.nameSsml}さん、おかえりなさい`
        : `${person.nameSsml}さんがいらっしゃいました`,
    });
    this.logger.log('announce end');
  }

  async unlock(): Promise<void> {
    await this.axios.post('/ring/unlock');
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axiosBase, { AxiosInstance } from 'axios';
import { Person } from '../entity/person.entity';

/**
 * 独自(゜-゜)
 */
@Injectable()
export class NoderedRepository implements AnnouncementRepository {
  private axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = axiosBase.create({
      baseURL: this.configService.getOrThrow('nodered.url'),
    });
  }

  async ding(): Promise<void> {
    if (await this.isModeEnable('sleeping')) {
      // (˘ω˘)ｽﾔｧ
      return;
    }

    await this.axios.post('/doorbell');
  }

  async announce(person: Person): Promise<void> {
    if (await this.isModeEnable('sleeping')) {
      // (˘ω˘)ｽﾔｧ
      return;
    }

    await this.axios.post('/alexa/announcement', {
      device: 'all',
      text: person.family
        ? `${person.nameSsml}さん、おかえりなさい`
        : `${person.nameSsml}さんがいらっしゃいました`,
    });
  }

  async isModeEnable(mode: string) {
    const response = await this.axios.get<Record<string, 'ON' | 'OFF'>>(
      '/mode',
    );

    return response.data[mode] === 'ON';
  }
}

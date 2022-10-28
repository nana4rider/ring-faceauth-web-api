import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axiosBase, { AxiosInstance } from 'axios';

@Injectable()
export class JemaApiRepository implements SmartLockRepository {
  private axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = axiosBase.create({
      baseURL: this.configService.getOrThrow('jemaApi.url'),
    });
  }

  async unlock(): Promise<void> {
    await this.axios.put('/v1/devices/entrance/state', { active: false });
  }
}

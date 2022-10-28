import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs/promises';
import {
  PushNotification,
  PushNotificationAction,
  RingApi,
  RingCamera,
} from 'ring-client-api';
import { throwError } from '../util';

@Injectable()
export class RingRepository implements OnModuleInit {
  private readonly logger = new Logger(RingRepository.name);

  private camera: RingCamera;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const refreshTokenBuffer = await fs.readFile('.token');
    const refreshToken = refreshTokenBuffer.toString().trim();
    const ringApi = new RingApi({ refreshToken });

    ringApi.onRefreshTokenUpdated.subscribe(({ newRefreshToken }) => {
      this.logger.log('update token');
      void fs.writeFile('.token', newRefreshToken);
    });

    const cameras = await ringApi.getCameras();
    const cameraId = this.configService.getOrThrow<number>('ring.cameraId');

    this.camera =
      cameras.find((camera) => camera.id === cameraId) ??
      throwError('no camera');
  }

  addListener(
    action: PushNotificationAction,
    callback: (camera: RingCamera, notification: PushNotification) => void,
  ) {
    this.camera.onNewNotification.subscribe((notification) => {
      if (notification.action === action) {
        this.logger.log(`event ${action}`);
        callback(this.camera, notification);
      }
    });
  }
}

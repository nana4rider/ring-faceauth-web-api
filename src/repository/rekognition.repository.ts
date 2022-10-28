import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Rekognition, { Face, FaceId } from 'aws-sdk/clients/rekognition';
import { RingRepository } from './ring.repository';

@Injectable()
export class RekognitionRepository {
  private readonly logger = new Logger(RingRepository.name);

  private rekognition: Rekognition;

  private collectionId: string;

  constructor(private readonly configService: ConfigService) {
    const region = configService.getOrThrow('rekognition.region');
    this.rekognition = new Rekognition({ region });
    this.collectionId = configService.getOrThrow('rekognition.collectionId');
  }

  async addFace(image: Buffer): Promise<FaceId> {
    const result = await this.rekognition
      .indexFaces({
        CollectionId: this.collectionId,
        Image: { Bytes: image },
        MaxFaces: 1,
      })
      .promise();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result.FaceRecords![0].Face!.FaceId!;
  }

  async deleteFace(faceId: FaceId): Promise<void> {
    await this.rekognition
      .deleteFaces({
        CollectionId: this.collectionId,
        FaceIds: [faceId],
      })
      .promise();
  }

  async searchFace(image: Buffer): Promise<Face | null> {
    try {
      this.logger.log('faceauth start');

      const result = await this.rekognition
        .searchFacesByImage({
          Image: { Bytes: image },
          CollectionId: 'faceauth',
          MaxFaces: 1,
        })
        .promise();

      return result.FaceMatches?.shift()?.Face ?? null;
    } catch (err) {
      this.logger.log('faceauth error');
      return null;
    } finally {
      this.logger.log('faceauth end');
    }
  }
}

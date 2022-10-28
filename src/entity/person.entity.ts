import { FaceId } from 'aws-sdk/clients/rekognition';
import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DateTimeTransformer } from 'typeorm-util-ts';
import { PersonDto } from '../dto/person.dto';

@Entity()
@Unique(['faceId'])
export class Person {
  @PrimaryGeneratedColumn({ type: 'integer' })
  personId!: number;

  @Column({ type: 'char', length: 36 })
  faceId!: FaceId;

  @Column({ type: 'mediumblob' })
  faceImage!: Buffer;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 512 })
  nameSsml!: string;

  @Column({ type: 'boolean' })
  family!: boolean;

  @Column({
    type: 'datetime',
    transformer: DateTimeTransformer.instance,
    nullable: true,
  })
  unlockExpirationAt: DateTime | undefined;

  @CreateDateColumn({
    transformer: DateTimeTransformer.instance,
    select: false,
  })
  readonly createdAt!: DateTime;

  @UpdateDateColumn({
    transformer: DateTimeTransformer.instance,
    select: false,
  })
  readonly updatedAt?: DateTime;

  toDto(): PersonDto {
    const dto = new PersonDto();
    dto.personId = this.personId;
    dto.faceId = this.faceId;
    dto.faceImage = this.faceImage.toString('base64');
    dto.name = this.name;
    dto.nameSsml = this.nameSsml;
    dto.family = this.family;
    dto.unlockExpirationAt = this?.unlockExpirationAt?.toISO() ?? null;
    return dto;
  }
}

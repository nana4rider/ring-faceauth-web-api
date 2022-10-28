import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { PersonInsertDto, PersonUpdateDto } from '../dto/person.dto';
import { Person } from '../entity/person.entity';
import { RekognitionRepository } from '../repository/rekognition.repository';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly rekognitionRepository: RekognitionRepository,
  ) {}

  find(): Promise<Person[]> {
    return this.personRepository.find();
  }

  findOne(personId: number): Promise<Person | null> {
    return this.personRepository.findOne({ where: { personId } });
  }

  findByFaceId(faceId: string): Promise<Person | null> {
    return this.personRepository.findOne({ where: { faceId } });
  }

  async register(data: PersonInsertDto): Promise<Person> {
    const person = new Person();

    person.faceImage = Buffer.from(data.faceImage, 'base64');
    person.faceId = await this.rekognitionRepository.addFace(person.faceImage);
    person.name = data.name;
    person.nameSsml = data.nameSsml;
    person.family = data.family;
    person.unlockExpirationAt = person.unlockExpirationAt;

    await this.personRepository.save(person);

    return person;
  }

  async update(person: Person, data: PersonUpdateDto): Promise<Person> {
    if (data.faceImage) {
      person.faceImage = Buffer.from(data.faceImage, 'base64');
      [person.faceId] = await Promise.all([
        this.rekognitionRepository.addFace(person.faceImage),
        this.rekognitionRepository.deleteFace(person.faceId),
      ]);
    }
    if (data.name) {
      person.name = data.name;
    }
    if (data.nameSsml) {
      person.nameSsml = data.nameSsml;
    }
    if (data.family) {
      person.family = data.family;
    }
    if (data.unlockExpirationAt) {
      person.unlockExpirationAt = DateTime.fromISO(data.unlockExpirationAt);
    }

    await this.personRepository.save(person);

    return person;
  }

  async delete(person: Person): Promise<void> {
    await Promise.all([
      this.rekognitionRepository.deleteFace(person.faceId),
      this.personRepository.delete(person.personId),
    ]);
  }
}

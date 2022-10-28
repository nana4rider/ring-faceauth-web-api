import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Person } from '../entity/person.entity';
import { PersonService } from '../service/person.service';

@Injectable()
export class PersonPipe implements PipeTransform<number, Promise<Person>> {
  constructor(private readonly personService: PersonService) {}

  async transform(personId: number) {
    const person = await this.personService.findOne(personId);

    if (!person) {
      throw new NotFoundException();
    }

    return person;
  }
}

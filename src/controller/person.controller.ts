import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonDto, PersonInsertDto, PersonUpdateDto } from '../dto/person.dto';
import { Person } from '../entity/person.entity';
import { PersonPipe } from '../pipe/person.pipe';
import { PersonService } from '../service/person.service';

@Controller('persons')
@ApiTags('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: PersonDto,
    isArray: true,
  })
  @ApiOperation({ summary: '人物の一覧を取得' })
  @Get()
  async index(): Promise<PersonDto[]> {
    const persons = await this.personService.find();

    return persons.map((person) => person.toDto());
  }

  @ApiParam({
    name: 'personId',
    description: 'Person ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: PersonDto })
  @ApiOperation({ summary: '人物の詳細を取得' })
  @Get(':personId')
  async findOne(
    @Param('personId', ParseIntPipe, PersonPipe)
    person: Person,
  ): Promise<PersonDto> {
    return person.toDto();
  }

  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiOperation({ summary: '人物を登録' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: PersonInsertDto): Promise<PersonDto> {
    const person = await this.personService.register(data);

    return person.toDto();
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: '人物を更新' })
  @Put(':personId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('personId', ParseIntPipe, PersonPipe)
    person: Person,
    @Body() data: PersonUpdateDto,
  ): Promise<void> {
    await this.personService.update(person, data);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: '人物を削除' })
  @Delete(':personId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('personId', ParseIntPipe, PersonPipe)
    person: Person,
  ): Promise<void> {
    await this.personService.delete(person);
  }
}

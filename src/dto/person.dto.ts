import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PersonDto {
  @ApiProperty({ description: '人物ID' })
  personId: number;

  @ApiProperty({ description: '顔ID' })
  faceId: string;

  @ApiProperty({ description: '顔画像' })
  faceImage: string;

  @ApiProperty({ description: '人物名' })
  name: string;

  @ApiProperty({ description: '人物名(SSML)' })
  nameSsml: string;

  @ApiProperty({ description: '家族フラグ' })
  family: boolean;

  @ApiProperty({ description: '解錠有効期限' })
  unlockExpirationAt: string | null;
}

export class PersonInsertDto {
  @ApiProperty({ description: '顔画像' })
  @IsString()
  @IsBase64()
  @IsNotEmpty()
  readonly faceImage: string;

  @ApiProperty({ description: '人物名' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: '人物名(SSML)' })
  @IsString()
  @IsNotEmpty()
  readonly nameSsml: string;

  @ApiProperty({ description: '家族フラグ' })
  @IsBoolean()
  @IsNotEmpty()
  readonly family: boolean;

  @ApiProperty({ description: '解錠有効期限' })
  @IsISO8601()
  @IsOptional()
  readonly unlockExpirationAt: string | undefined;
}

export class PersonUpdateDto {
  @ApiProperty({ description: '顔画像' })
  @IsString()
  @IsBase64()
  @IsOptional()
  readonly faceImage: string | undefined;

  @ApiProperty({ description: '人物名' })
  @IsString()
  @IsOptional()
  readonly name: string | undefined;

  @ApiProperty({ description: '人物名(SSML)' })
  @IsString()
  @IsOptional()
  readonly nameSsml: string | undefined;

  @ApiProperty({ description: '家族フラグ' })
  @IsBoolean()
  @IsOptional()
  readonly family: boolean | undefined;

  @ApiProperty({ description: '解錠有効期限' })
  @IsISO8601()
  @IsOptional()
  readonly unlockExpirationAt: string | undefined;
}

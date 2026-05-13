import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
  IsMongoId,
  IsOptional,
  IsArray
} from 'class-validator';

import { Type } from 'class-transformer';

import { LinksDto } from './links.dto';
import { RequirementDto } from './requirement.dto';
import { Types } from 'mongoose';

class RequirementsGroupDto {
  @ValidateNested()
  @Type(() => RequirementDto)
  minimum!: RequirementDto;

  @ValidateNested()
  @Type(() => RequirementDto)
  maximum!: RequirementDto;
}

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  developer!: string;

  @IsDateString()
  published!: Date;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  genres?: Types.ObjectId[];

  
  @ValidateNested()
  @Type(() => LinksDto)
  links!: LinksDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RequirementsGroupDto)
  requirements!: RequirementsGroupDto;
}
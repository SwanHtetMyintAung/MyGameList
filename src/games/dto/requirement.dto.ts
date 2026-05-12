import { IsNotEmpty, IsString } from 'class-validator';

export class RequirementDto {
  @IsString()
  @IsNotEmpty()
  cpu!: string;

  @IsString()
  @IsNotEmpty()
  gpu!: string;

  @IsString()
  @IsNotEmpty()
  videoMemory!: string;

  @IsString()
  @IsNotEmpty()
  memory!: string;

  @IsString()
  @IsNotEmpty()
  diskSpace!: string;
}
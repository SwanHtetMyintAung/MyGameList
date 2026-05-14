import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsString()
  @IsString()
  @IsNotEmpty()
  name?: string = "";

  @IsOptional()
  @Type(() => Number) // Ensures the string from the URL is converted to a number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Safety cap to prevent DB overload
  limit?: number = 10;
}

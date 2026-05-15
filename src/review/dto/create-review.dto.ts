import { IsString, IsNumber, Min, Max, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly user: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  readonly rating: number;
}
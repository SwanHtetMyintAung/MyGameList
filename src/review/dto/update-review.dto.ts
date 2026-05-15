import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

// PartialType makes all fields from CreateReviewDto optional
export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
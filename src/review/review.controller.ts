import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('Reviews') // Group these endpoints under "Reviews" in Swagger UI
@Controller('games') // Changed base to 'games' to fit REST best practices
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // 1. CREATE REVIEW
  @Post(':gameId/reviews')
  @ApiOperation({ summary: 'Submit a new review for a specific game' })
  @ApiParam({ name: 'gameId', description: 'The MongoDB Hex ID of the game' })
  @ApiResponse({ status: 21, description: 'Review successfully submitted.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @ApiResponse({ status: 400, description: 'Bad request / Validation failure.' })
  create(
    @Param('gameId') gameId: string,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.create(gameId, createReviewDto);
  }

  // 2. GET REVIEWS FOR A GAME
  @Get(':gameId/reviews')
  @ApiOperation({ summary: 'Get all reviews for a game with pagination' })
  @ApiParam({ name: 'gameId', description: 'The MongoDB Hex ID of the game' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Paginated reviews returned successfully.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  findByGameId(
    @Param('gameId') gameId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    // Convert queries to numbers, falling back to defaults if undefined
    return this.reviewService.findByGameId(gameId, Number(page) || 1, Number(limit) || 10);
  }

  // 3. UPDATE OWN REVIEW
  @Patch('reviews/:reviewId')
  @ApiBearerAuth() // Indicates JWT token is needed in Swagger UI
  @ApiOperation({ summary: "Update an existing review (Author only)" })
  @ApiParam({ name: 'reviewId', description: 'The MongoDB Hex ID of the review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You do not own this review.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  update(
    @Param('reviewId') reviewId: string,
    // In a real app, extract userId from req.user populated by your AuthGuard
    @Body('userId') userId: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewService.update(reviewId, userId, updateReviewDto);
  }

  // 4. USER DELETE REVIEW
  @Delete('reviews/:reviewId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete an existing review (Author only)" })
  @ApiParam({ name: 'reviewId', description: 'The MongoDB Hex ID of the review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You do not own this review.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  remove(
    @Param('reviewId') reviewId: string,
    // In a real app, extract userId from req.user populated by your AuthGuard
    @Body('userId') userId: string
  ) {
    return this.reviewService.remove(reviewId, userId);
  }

  // 5. ADMIN FORCE DELETE / MODERATION
  @Delete('admin/reviews/:reviewId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force delete a review for moderation purposes (Admin Only)' })
  @ApiParam({ name: 'reviewId', description: 'The MongoDB Hex ID of the review to remove' })
  @ApiResponse({ status: 200, description: 'Review moderated and removed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin privileges required.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  adminRemove(@Param('reviewId') reviewId: string) {
    return this.reviewService.adminRemove(reviewId);
  }
}
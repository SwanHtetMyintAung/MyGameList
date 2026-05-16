import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Game, GameDocument } from '../games/schemas/games.schema';
import { Review, ReviewDocument} from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto'; // You'll need to create this DTO

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  // 1. CREATE REVIEW (Your original method, optimized)
  async create(id: string, createReviewDto: CreateReviewDto) {
    const game = await this.gameModel.findById(id);
    if (!game) {
      throw new NotFoundException("There is no game with such id.");
    }
    const newReview = new this.reviewModel(createReviewDto);
    const savedReview = await newReview.save();

    game.reviewCount = (game.reviewCount || 0) + 1;

    if (!game.reviews) {
      game.reviews = [];
    }
    game.reviews.push(savedReview._id as any);

    await game.save();
    return savedReview;
  }

  // 2. GET REVIEWS FOR A GAME (With Pagination)
  // Essential so you don't crash your app loading 10,000 reviews at once
  async findByGameId(gameId: string, page: number = 1, limit: number = 10) {
    const game = await this.gameModel.findById(gameId);
    if (!game) {
      throw new NotFoundException("Game not found.");
    }

    const skip = (page - 1) * limit;

    const reviews = await this.reviewModel.find({ gameId: new Types.ObjectId(gameId) })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.reviewModel.countDocuments({ gameId: new Types.ObjectId(gameId) });

    return {
      data: reviews,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      }
    };
  }

  // 3. UPDATE REVIEW (For Normal Users)
  // Users should only be able to edit their own reviews
  async update(reviewId: string, userId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException("Review not found.");
    }

    // Security check: Ensure the user editing is the author
    if (review.user.toString() !== userId) {
      throw new ForbiddenException("You can only edit your own reviews.");
    }

    Object.assign(review, updateReviewDto);
    return await review.save();
  }

  // 4. USER DELETE REVIEW (Syncs with Game Document)
  // When a user deletes a review, we must decrement the counter and remove the reference
  async remove(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException("Review not found.");
    }

    if (review.user.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own reviews.");
    }

    // Remove from the Game's sub-array and decrement count
    await this.gameModel.findByIdAndUpdate(review.game, {
      $pull: { reviews: review._id },
      $inc: { reviewCount: -1 }
    });

    await review.deleteOne();
    return { message: "Review successfully deleted." };
  }

  // 5. ADMIN FORCE DELETE / MODERATION
  // Admins bypass ownership checks to clean up spam/toxic reviews
  async adminRemove(reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException("Review not found.");
    }

    // Clean up game references
    await this.gameModel.findByIdAndUpdate(review.game, {
      $pull: { reviews: review._id },
      $inc: { reviewCount: -1 }
    });

    await review.deleteOne();
    return { message: "Review moderated and removed by Admin." };
  }
}
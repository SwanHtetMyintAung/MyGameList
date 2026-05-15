import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Game, GameDocument } from '../games/schemas/games.schema';
import { Review, ReviewDocument} from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}
  async create(id: string, createReviewDto: CreateReviewDto) {
    const game = await this.gameModel.findById(id);
    if (!game) {
      throw new NotFoundException("There is no game with such id.");
    }
    const newReview = new this.reviewModel(createReviewDto)
    const savedReview = await newReview.save();

    game.reviewCount = (game.reviewCount || 0) + 1;

    if (!game.reviews) {
      game.reviews = [];
    }
    game.reviews.push(savedReview._id as any);

    await game.save();

    return savedReview;
  }



}

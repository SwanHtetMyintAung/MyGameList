import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Game, GameDocument } from './schemas/games.schema';
import { UpdateGameDto } from './games.controller';
import { CreateGameDto } from './dto/create-game.dto';
import { PaginationDto } from './dto/pagination.dto';

const PAGINATION_LIMIT = 5;

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async create(data: CreateGameDto) {
    const game = new this.gameModel(data);

    return await game.save();
  }

  //we wont use "name" field for this end point
  async findAll(query: PaginationDto) {
    const { limit = PAGINATION_LIMIT, page = 1 } = query;
    const skip = (page - 1 ) * limit
    const results = await this.gameModel.find().limit(limit).skip(skip);
    return results;
  }

  async findOne(id: string) {
    const game = this.gameModel.findById(id);
    return game;
  }

  async findOneWithName(name: string) {
    return  await this.gameModel.findOne({ name });
  }

  async update(id: string, data: UpdateGameDto) {
    return this.gameModel.findByIdAndUpdate(id, data, { new: true });
  }

  async searchWithName(query: PaginationDto) {
    const { name = '', limit = PAGINATION_LIMIT, page = 1 } = query;
    const skip = (page - 1) * limit;

    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return this.gameModel
      .find({
        name: { $regex: escaped, $options: 'i' },
      }).limit(limit).skip(skip)
      .exec();
  }

  async remove(id: string) {
    return this.gameModel.findByIdAndDelete(id);
  }
}

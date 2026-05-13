import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Game, GameDocument } from './schemas/games.schema';
import { UpdateGameDto } from './games.controller';
import { CreateGameDto } from './dto/create-game.dto';

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

  async findAll() {
    const results = await this.gameModel.find()
    return results 
  }

  async findOne(id: string) {
    const game = this.gameModel.findById(id);
    return game
  }
  async findOneWithName(name:string){
    const game = await this.gameModel.findOne({name})
    return game
  }
  async update(id: string, data: UpdateGameDto) {
    return this.gameModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );
  }

async searchWithName(name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return this.gameModel.find({
    name: { $regex: escaped, $options: 'i' }
  }).exec();
}
  async remove(id: string) {
    return this.gameModel.findByIdAndDelete(id);
  }
}
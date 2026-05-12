import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Game, GameDocument } from './schemas/games.schema';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}
  
  async create(data: Partial<Game>) {
    const game = new this.gameModel(data);

    return game.save();
  }

  async findAll() {
    return this.gameModel.find();
  }

  async findOne(id: string) {
    return this.gameModel.findById(id);
  }
  async findOneWithName(name:string){
    const game =  this.gameModel.findOne({name}).exec()
    return game
  }
  async update(id: string, data: Partial<Game>) {
    return this.gameModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );
  }

  async remove(id: string) {
    return this.gameModel.findByIdAndDelete(id);
  }
}
import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesService } from './games.service';
import { Game, GameSchema } from './schemas/games.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Game.name,
        schema: GameSchema,
      },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GameModule {}

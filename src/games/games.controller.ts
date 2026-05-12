import { Body, Controller,Get,Param,Post,NotFoundException, ConflictException } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('games')
@Controller('game')
export class GamesController {
    constructor(private gamesService:GamesService){}
    //upload a new game |needs auth later|
    @Post()
    @ApiOperation({
        summary: 'Create a game',
    })
    @ApiBody({
        type: CreateGameDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Game created successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Couldn\'t create the game',
    })
    async create(@Body() dto:CreateGameDto){
       const existed = await this.gamesService.findOneWithName(dto.name)
       if(existed){
         throw new ConflictException("The game with the same name already existed.")
       }
       return this.gamesService.create(dto)

    }

    //get the list of every game |we need to add pagination|
    @Get()
    @ApiOperation({
        summary: 'get the list of all games',
    })
    @ApiResponse({
        status: 201,
        description: 'Games retrieved successfully',
        type : [CreateGameDto]
    })
    getAll(){
        return this.gamesService.findAll()
    }

    @Get(":id")
    @ApiOperation({
        summary: 'get a game with id',
    })
    @ApiResponse({
        status: 201,
        description: 'Game retrieved successfully',
        type : CreateGameDto
    })
    @ApiResponse({
        status: 404,
        description: 'there is no game with this id',
    })
    async getById(@Param("id") id: string){
        const game = await this.gamesService.findOne(id)
        if (!game) throw new NotFoundException();
        return game
    }

}

import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { PaginationDto } from './dto/pagination.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateGameDto extends PartialType(CreateGameDto) {}

@ApiTags('games')
@Controller('game')
export class GamesController {
  constructor(private gamesService: GamesService) {}

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
    description: "Couldn't create the game",
  })
  async create(@Body() dto: CreateGameDto) {
    const existed = await this.gamesService.findOneWithName(dto.name);
    if (existed) {
      throw new ConflictException(
        'The game with the same name already existed.',
      );
    }
    return this.gamesService.create(dto);
  }

  //get the list of every game |we need to add pagination|
  @Get()
  @ApiOperation({
    summary: 'get the list of all games',
  })

  @ApiQuery({ name: 'page', required: false, example: 1 }) //not implemented yet
  @ApiQuery({ name: 'limit', required: false, example: 10 }) //not implemented yet
  @ApiResponse({
    status: 201,
    description: 'Games retrieved successfully',
    type: [CreateGameDto],
  })
  getAll(@Query() query: Partial<PaginationDto>) {
    return this.gamesService.findAll(query);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search games with query',
  })
  @ApiResponse({
    status: 201,
    description: 'Information updated successfully',
    type: [CreateGameDto],
  })
  @ApiQuery({ name: 'name', required: true, example: 'cyber' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'page', required: false, example: 1 })

  @ApiResponse({
    status: 404,
    description: 'there is no game with this name',
  })
  async searchByName(@Query() query: PaginationDto) {
    const games = await this.gamesService.searchWithName(query);

    if (!games) {
      throw new InternalServerErrorException();
    }
    return games;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get a game with id',
  })
  @ApiResponse({
    status: 201,
    description: 'Game retrieved successfully',
    type: CreateGameDto,
  })
  @ApiResponse({
    status: 404,
    description: 'there is no game with this id',
  })
  async getById(@Param('id') id: string) {
    const game = await this.gamesService.findOne(id);
    if (!game) throw new NotFoundException();
    return game;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'replace the information of a game ',
  })
  @ApiBody({
    type: UpdateGameDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Information updated successfully',
    type: CreateGameDto,
  })
  @ApiResponse({
    status: 404,
    description: 'there is no game with this id',
  })
  async updateGame(
    @Param('id') id: string,
    @Body() dto: Partial<CreateGameDto>,
  ) {
    const existed = await this.gamesService.findOne(id);
    if (!existed) throw new NotFoundException();
    const result = await this.gamesService.update(id, dto);
    if (!result) {
      throw new InternalServerErrorException();
    }
    return `${result.name} has been updated.`;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete a game with id',
  })
  @ApiResponse({
    status: 201,
    description: 'Game deleted successfully',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'there is no game with this id',
  })
  async delete(@Param('id') id: string) {
    const result = await this.gamesService.remove(id);
    if (!result) {
      return 'Interal Server Error';
    }
    return `${result.name} has been deleted`;
  }
}

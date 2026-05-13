// genre.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name)
    private genreModel: Model<GenreDocument>,
  ) {}

  async create(dto: CreateGenreDto) {
    return this.genreModel.create(dto);
  }

  async findAll() {
    return this.genreModel.find().exec();
  }

  async findOne(id: string) {
    const genre = await this.genreModel.findById(id).exec();
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    const updated = await this.genreModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) throw new NotFoundException('Genre not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.genreModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Genre not found');
    return deleted;
  }
}
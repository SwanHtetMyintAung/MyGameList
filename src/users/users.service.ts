import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';

import type { Result } from '../utils/Result'; // Import the type separately
import { Err, Ok } from '../utils/Result';
import { ErrorCodes } from 'src/utils/Errors'; // Use import type here too

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
  ) {
  }


  async create(createUserDto: CreateUserDto): Promise<Result<UserDocument, ErrorCodes>> {
    try {
      const user = new this.UserModel(createUserDto);
      const savedUser = await user.save();
      return Ok(savedUser);
    } catch (error) {
      // Handle Mongoose duplicate key error (code 11000)
      if (error.code === 11000) {
        return Err(ErrorCodes.DbValueAlreadyExists);
      }
      return Err(ErrorCodes.UserErr);
    }
  }

  async findAll(): Promise<Result<UserDocument[], ErrorCodes>> {
    try {
      const users = await this.UserModel.find().exec();
      return Ok(users);
    } catch (e) {

      return Err(ErrorCodes.UserErr);
    }
  }

  async findOne(id: string): Promise<Result<UserDocument, ErrorCodes>> {
    try {
      const user = await this.UserModel.findById(id).exec();
      if (!user) {
        return Err(ErrorCodes.DbKeyNotFound);
      }
      return Ok(user);
    } catch (e) {
      return Err(ErrorCodes.UserErr);
    }
  }

  async findOneWithName(name: string): Promise<Result<UserDocument, ErrorCodes>> {
    try {
      const user = await this.UserModel.findOne({ name }).exec();
      return user ? Ok(user) : Err(ErrorCodes.DbValueNotFound);
    } catch (e) {
      return Err(ErrorCodes.UserErr);
    }
  }

  async findOneWithEmail(email: string): Promise<Result<UserDocument, ErrorCodes>> {
    try {
      const user = await this.UserModel.findOne({ email }).exec();
      return user ? Ok(user) : Err(ErrorCodes.DbValueNotFound);
    } catch (e) {
      return Err(ErrorCodes.UserErr);

    }
  }

  async remove(id: string): Promise<Result<boolean, ErrorCodes>> {
    try {
      const deleted = await this.UserModel.findByIdAndDelete(id).exec();
      return deleted ? Ok(true) : Err(ErrorCodes.DbKeyNotFound);
    } catch (e) {
      return Err(ErrorCodes.UserErr);
    }
  }
}

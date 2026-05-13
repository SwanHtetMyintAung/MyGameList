import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, Req, Res, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Ok, Err } from "../utils/Result";
import type { Result } from "../utils/Result"; // Import the type separately
import { ErrorCodes } from 'src/utils/Errors'; // Use import type here too


@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @ApiResponse({
    "status":201,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) : Promise<Result<string, ErrorCodes >>
    {
    const existingUser = await this.usersService.findOneWithEmail(createUserDto.email)
    if(existingUser){
      return Err(ErrorCodes.ValueConflict);

    }
    let user = this.usersService.create(createUserDto)
    if(!user){
      return Err(ErrorCodes.InternalServerErr);
    }
    
    return Ok("The user is successfully created")
  }


  @Get()
  async findAll() :Promise<Result<any, ErrorCodes>> {
    let users = await this.usersService.findAll();
    if(users.length === 0){
      return Err(ErrorCodes.DbValueNotFound, "There is no users")
    }
    return Ok(users)
  }


  @Get(':id')
  findOne(@Param('id') id: string) :Result<any, ErrorCodes> {
    const user = this.usersService.findOne(id)
    if(!user){
      return Err(ErrorCodes.DbValueNotFound, "User not found.")
    }
    return Ok(user)
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(id);
    if(!result){
      throw new InternalServerErrorException("Couldn't delete the user")
    }else{
      return "User deleted Successfully."
    }
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, Req, Res, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';


@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @ApiResponse({
    "status":201,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneWithEmail(createUserDto.email)
    if(existingUser){
      throw new ConflictException("This email already exist.")
    }
    let user = this.usersService.create(createUserDto)
    if(!user){
      throw new InternalServerErrorException()
    }
    return "User Created Successfully."
  }

  @Get()
  async findAll() {
    let users = await this.usersService.findAll();
    if(users.length === 0){
      return "There are no users."
    }
    return users
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id)
    if(!user){
      throw new NotFoundException("User not found.")
    }
    return user
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

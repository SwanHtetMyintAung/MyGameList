import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, Req, Res, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Ok, Err, match, andThen, isOk } from "../utils/Result";
import type { Result } from "../utils/Result"; // Import the type separately
import { ErrorCodes } from 'src/utils/Errors'; // Use import type here too


@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @ApiResponse({
    status: 201, description: 'Success'
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) : Promise<Result<string, ErrorCodes >>
    {
    const existingUser = await this.usersService.findOneWithEmail(createUserDto.email)
    if(isOk(existingUser)) {
      return Err(ErrorCodes.DbValueAlreadyExists);
    }
    
    // 2. Create the user (MUST await)
    const result = await this.usersService.create(createUserDto);
    
    // Use andThen to transform the User object into a success string
    return andThen(result, () => Ok("The user is successfully created"));
  }


  @Get()
  async findAll() :Promise<Result<any[], ErrorCodes>> {
    const result = await this.usersService.findAll();

    // Use andThen to handle the logic of "Empty array = Error"
    return andThen(result, (users) => 
      users.length > 0 
        ? Ok(users) 
        : Err(ErrorCodes.DbValueNotFound)
    );
  }


  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<Result<any, ErrorCodes>> {
    const result = await this.usersService.findOne(id);
    
    // Simplified: If findOne returns Ok(null) or Ok(user), handle it here
    return andThen(result, (user) => 
      user ? Ok(user) : Err(ErrorCodes.DbKeyNotFound)
    );
  }


  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Result<string, ErrorCodes>> {
    const result = await this.usersService.remove(id);
    
    // Return a success message if the deletion was successful
    return andThen(result, (didDelete) => 
      didDelete 
        ? Ok("User deleted Successfully.") 
        : Err(ErrorCodes.DbKeyNotFound)
    );
  }
}

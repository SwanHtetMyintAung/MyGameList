import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import {User,UserDocument} from './schemas/users.schema'
import {Model} from "mongoose"


@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(User.name)
    private readonly UserModel:Model<UserDocument>,
  ){}



  create(createUserDto: CreateUserDto) {
    const user = new this.UserModel(createUserDto)//this create new instance of the UserModel and we will save it to the "COllection"
    return user.save()
  }

  findAll() {
    const users =  this.UserModel.find();
    return users
  }

  findOne(id: string) {
    return this.UserModel.findById(id)
  }
  findOneWithName(name:string){
    return this.UserModel.findOne({name}).exec()
  }
  findOneWithEmail(email:string){
    return this.UserModel.findOne({email}).exec()
  }

  remove(id: string) {
    return this.UserModel.findByIdAndDelete(id)
  }
}

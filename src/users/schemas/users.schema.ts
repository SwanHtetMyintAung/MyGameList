import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>


@Schema()
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true, required: true, lowercase: true })
  email!: string;

  @Prop({ default: 'user' })
  role!: string; // e.g., 'admin', 'moderator'
}


export const UserSchema = SchemaFactory.createForClass(User);
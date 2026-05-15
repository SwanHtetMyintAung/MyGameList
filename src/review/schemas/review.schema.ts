import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/users.schema';



export type ReviewDocument = HydratedDocument<Review>;
@Schema({ timestamps: true })
export class Review {

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: false })
  isEdited?: boolean;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);
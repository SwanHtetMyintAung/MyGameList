import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Genre } from '../../genre/schemas/genre.schema';
import { Review } from '../../review/schemas/review.schema'


export type GameDocument = HydratedDocument<Game>;

@Schema({ _id: false })
export class Requirement {
  @Prop({ required: true })
  cpu!: string;

  @Prop({ required: true })
  gpu!: string;

  @Prop({ required: true })
  videoMemory!: string;

  @Prop({ required: true })
  memory!: string;

  @Prop({ required: true })
  diskSpace!: string;
}

export const RequirementSchema = SchemaFactory.createForClass(Requirement);

@Schema({ _id: false })
export class Links {
  @Prop({ required: true })
  main!: string;

  @Prop()
  steam?: string;

  @Prop()
  gog?: string;
}

export const LinksSchema = SchemaFactory.createForClass(Links);

@Schema()
export class Game {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  developer!: string;

  @Prop({ required: true })
  published!: Date;

  @Prop({ default: 0 })
  reviewCount?: number;
  @Prop({
    type: [{ type: Types.ObjectId, ref: Review.name }],
    default: [],
  })
  reviews?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Genre.name }],
    default: [],
  })
  genres!: Types.ObjectId[];
  @Prop({
    type: LinksSchema,
    required: true,
  })
  links!: Links;

  @Prop({
    type: {
      minimum: {
        type: RequirementSchema,
        required: true,
      },
      maximum: {
        type: RequirementSchema,
        required: true,
      },
    },
    required: true,
  })
  requirements!: {
    minimum: Requirement;
    maximum: Requirement;
  };
}


export const GameSchema = SchemaFactory.createForClass(Game);
//hooks
GameSchema.pre('find', function() {
  this.populate('genres');
});

GameSchema.pre('findOne', function() {
  this.populate('genres');
});
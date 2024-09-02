import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Extend the Document class to create a User model
export type UserDocument = User & Document;

// 2. Use the @Schema decorator to mark this class as a schema definition
@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  chatId: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, default: true })
  isSubscribed: boolean;

  @Prop({ required: true, default: false })
  isBlocked: boolean;
}

// 3. Generate the Mongoose schema object
export const UserSchema = SchemaFactory.createForClass(User);

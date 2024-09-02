import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Extend the Document class to create a Admin model
export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  profilePic: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

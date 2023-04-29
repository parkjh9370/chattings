import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Socket as SocketModel } from './sockets.model';

@Schema({
  collection: 'chattings',
  timestamps: true,
})
export class Chatting extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      id: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  @IsString()
  user: SocketModel;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);

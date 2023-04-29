import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  id: false,
  collection: 'sockets',
  timestamps: true,
})
export class Socket extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export const SocketSchema = SchemaFactory.createForClass(Socket);

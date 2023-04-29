import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatsGateway } from './chats.gateway';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { SocketSchema, Socket } from './models/sockets.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chatting.name,
        schema: ChattingSchema,
      },
      {
        name: Socket.name,
        schema: SocketSchema,
      },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}

import { Socket } from 'socket.io';
import { Model } from 'mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway implements OnGatewayDisconnect {
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name)
    private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {}

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.deleteOne();
    }

    this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user')
  async handleUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const isConnectedSameUserName = await this.socketModel.exists({ username });
    if (isConnectedSameUserName) {
      await this.socketModel.create({
        id: socket.id,
        username: `${username}_${Math.floor(Math.random() * 100)}`,
      });
    }

    await this.socketModel.create({
      id: socket.id,
      username,
    });

    socket.broadcast.emit('user_connected', username);

    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const connectedUser = await this.socketModel.findOne({ id: socket.id });

    await this.chattingModel.create({
      user: connectedUser,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: connectedUser.username,
    });
  }
}

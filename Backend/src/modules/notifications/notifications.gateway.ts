import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: ['http://localhost:5173'], credentials: true },
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  handleConnection(socket: Socket) {
    const userId = (socket.handshake.query.userId as string) ?? null;

    if (userId) {
      this.users.set(userId, socket.id);
    }
  }

  handleDisconnect(socket: Socket) {
    for (const [userId, sockId] of this.users.entries()) {
      if (sockId === socket.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  sendToUser(userId: string, notification: any) {
    const socketId = this.users.get(userId);

    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }
}

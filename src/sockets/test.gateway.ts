import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3000)
export class TestGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    this.server.sockets.emit('receive_message', 'Postgres boilerplate');
  }

  emitNotification(event: string, data: {}) {
    this.server.sockets.emit('custom_req', data);
  }
}

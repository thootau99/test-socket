import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  path: '/rds_combine_api/events',
  cors: true,
})
export class AppGateway implements NestGateway {
  @WebSocketServer()
  server: Server;

  clientTimer = {};
  @SubscribeMessage('test')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.emit('test', {
      status: 'success',
      message: `您剛剛發送的訊息是: ${data}，已成功透過後臺回傳`
    })
  }

  afterInit() {
    console.log('socket server inited');
  }
  handleConnection(socket: Socket) {
    const id = socket.id;
    this.clientTimer = { ...this.clientTimer, [id]: Array<NodeJS.Timer>() };
    console.log(id, 'joining');
  }
  handleDisconnect(socket: Socket) {
    const id = socket.id;
    console.log(id, 'exiting');
  }
}

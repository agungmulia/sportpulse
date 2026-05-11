import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/live',
})
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-match')
  handleJoinMatch(client: Socket, matchId: string) {
    client.join(`match:${matchId}`);
    return { event: 'joined', data: matchId };
  }

  @SubscribeMessage('leave-match')
  handleLeaveMatch(client: Socket, matchId: string) {
    client.leave(`match:${matchId}`);
  }

  emitMatchUpdate(matchId: string, data: unknown) {
    this.server.to(`match:${matchId}`).emit('match-update', data);
  }

  emitGoal(matchId: string, data: unknown) {
    this.server.to(`match:${matchId}`).emit('goal', data);
    this.server.emit('live-goal', { matchId, ...data as object });
  }

  emitMatchStatus(matchId: string, status: string) {
    this.server.to(`match:${matchId}`).emit('status-change', { matchId, status });
  }
}

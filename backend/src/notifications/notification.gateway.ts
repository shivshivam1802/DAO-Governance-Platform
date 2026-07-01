import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async sendNotification(userId: string, title: string, content: string, type: string) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        content,
        type,
      },
    });

    this.server.emit(`notification:${userId}`, notification);
  }

  broadcastProposalUpdate(daoId: string, eventName: string, proposalData: any) {
    this.server.emit(`dao:${daoId}:proposals`, { event: eventName, data: proposalData });
  }
}

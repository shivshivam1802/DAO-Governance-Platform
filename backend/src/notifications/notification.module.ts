import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [NotificationGateway, PrismaService],
  controllers: [NotificationController],
  exports: [NotificationGateway],
})
export class NotificationModule {}

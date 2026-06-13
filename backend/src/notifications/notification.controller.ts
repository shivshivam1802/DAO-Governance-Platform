import { Controller, Get, Post, Param, UseGuards, Req, Put } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getNotifications(@Req() req: any) {
    return this.prisma.notification.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}

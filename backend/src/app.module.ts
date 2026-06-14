import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DaosModule } from './daos/daos.module';
import { ProposalModule } from './proposals/proposal.module';
import { ReputationModule } from './reputation/reputation.module';
import { NotificationModule } from './notifications/notification.module';
import { AiModule } from './ai/ai.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DaosModule,
    ProposalModule,
    ReputationModule,
    NotificationModule,
    AiModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

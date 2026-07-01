import { Module } from '@nestjs/common';
import { DaosService } from './daos.service';
import { DaosController } from './daos.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DaosService, PrismaService],
  controllers: [DaosController],
})
export class DaosModule {}

import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reputation')
export class ReputationController {
  constructor(private reputationService: ReputationService) {}

  @Get('leaderboard')
  getLeaderboard() {
    return this.reputationService.getLeaderboard();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return this.reputationService.getUserReputation(req.user.sub);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.reputationService.getUserReputation(userId);
  }
}

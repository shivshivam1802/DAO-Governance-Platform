import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('proposals')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Post(':daoId')
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: any,
    @Param('daoId') daoId: string,
    @Body() body: any,
  ) {
    return this.proposalService.create(req.user.sub, daoId, body);
  }

  @Get('dao/:daoId')
  findAll(@Param('daoId') daoId: string) {
    return this.proposalService.findAll(daoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proposalService.findOne(id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  vote(
    @Req() req: any,
    @Param('id') id: string,
    @Body('choice') choice: string,
    @Body('signature') signature: string,
    @Body('weight') weight: number,
  ) {
    return this.proposalService.castOffChainVote(req.user.sub, id, choice, signature, weight);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Req() req: any,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.proposalService.addComment(req.user.sub, id, content);
  }
}

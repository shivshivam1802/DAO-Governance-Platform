import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  async getUserReputation(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        reputationHistory: { orderBy: { createdAt: 'desc' } },
        _count: { select: { votes: true, proposalsCreated: true } },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const voteCount = user._count.votes;
    const proposalCount = user._count.proposalsCreated;
    const participationRate = voteCount > 0 ? 100 : 0;

    return {
      score: user.reputationScore,
      votesCount: voteCount,
      proposalsCount: proposalCount,
      participationRate,
      history: user.reputationHistory,
    };
  }

  async rewardPoints(userId: string, points: number, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          reputationScore: { increment: points },
        },
      });

      await tx.reputationHistory.create({
        data: {
          userId,
          scoreDiff: points,
          reason,
        },
      });

      return user;
    });
  }

  async getLeaderboard() {
    return this.prisma.user.findMany({
      orderBy: { reputationScore: 'desc' },
      take: 10,
      select: {
        id: true,
        address: true,
        username: true,
        avatar: true,
        reputationScore: true,
      },
    });
  }
}

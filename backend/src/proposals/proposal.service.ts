import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { verifyTypedData } from 'viem';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ProposalService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, daoId: string, data: any) {
    const { title, description, type, votingType, choices, votingStart, votingEnd, executionDelay } = data;

    const dao = await this.prisma.dAO.findUnique({ where: { id: daoId } });
    if (!dao) throw new NotFoundException('DAO not found');

    const aiSummary = await this.aiService.generateSummary(title, description);
    const aiRiskAnalysis = await this.aiService.generateRiskAnalysis(description);

    return this.prisma.proposal.create({
      data: {
        daoId,
        creatorId: userId,
        title,
        description,
        type,
        status: 'DISCUSSION',
        votingType,
        choices: choices || ['For', 'Against', 'Abstain'],
        votingStart: new Date(votingStart),
        votingEnd: new Date(votingEnd),
        executionDelay: parseInt(executionDelay) || 0,
        aiSummary,
        aiRiskAnalysis,
      },
    });
  }

  async findAll(daoId: string) {
    return this.prisma.proposal.findMany({
      where: { daoId },
      include: {
        creator: { select: { address: true, username: true } },
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        dao: true,
        creator: { select: { address: true, username: true } },
        votes: { include: { user: true } },
        comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async castOffChainVote(userId: string, proposalId: string, choice: string, signature: string, weight: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { dao: true },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (proposal.votingType !== 'OFF_CHAIN') {
      throw new BadRequestException('This proposal only supports on-chain voting');
    }

    if (new Date() < proposal.votingStart || new Date() > proposal.votingEnd) {
      throw new BadRequestException('Voting period is not active');
    }

    const domain = {
      name: 'DAO Governance Platform',
      version: '1',
      chainId: 1,
      verifyingContract: (proposal.dao.governorAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    };

    const types = {
      Vote: [
        { name: 'voter', type: 'address' },
        { name: 'proposalId', type: 'string' },
        { name: 'choice', type: 'string' },
        { name: 'weight', type: 'uint256' },
      ],
    };

    const message = {
      voter: user.address as `0x${string}`,
      proposalId,
      choice,
      weight: BigInt(Math.floor(weight)),
    };

    try {
      const isValid = await verifyTypedData({
        address: user.address as `0x${string}`,
        domain,
        types,
        primaryType: 'Vote',
        message,
        signature: signature as `0x${string}`,
      });

      if (!isValid) {
        throw new BadRequestException('Invalid signature');
      }
    } catch (e) {
      throw new BadRequestException(`Signature verification failed: ${(e as Error).message}`);
    }

    return this.prisma.vote.upsert({
      where: {
        proposalId_userId: { proposalId, userId },
      },
      update: {
        choice,
        weight,
        signature,
      },
      create: {
        proposalId,
        userId,
        choice,
        weight,
        type: 'OFF_CHAIN',
        signature,
      },
    });
  }

  async addComment(userId: string, proposalId: string, content: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) throw new NotFoundException('Proposal not found');

    return this.prisma.comment.create({
      data: {
        proposalId,
        userId,
        content,
      },
      include: {
        user: { select: { address: true, username: true, avatar: true } },
      },
    });
  }

  async updateStatus(proposalId: string, status: string) {
    return this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
    });
  }
}

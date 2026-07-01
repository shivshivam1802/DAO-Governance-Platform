import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DaosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const {
      name,
      description,
      logo,
      banner,
      website,
      twitter,
      discord,
      telegram,
      github,
      tokenAddress,
      timelockAddress,
      governorAddress,
      treasuryAddress,
    } = data;

    return this.prisma.$transaction(async (tx) => {
      const dao = await tx.dAO.create({
        data: {
          name,
          description,
          logo,
          banner,
          website,
          twitter,
          discord,
          telegram,
          github,
          tokenAddress,
          timelockAddress,
          governorAddress,
          treasuryAddress,
        },
      });

      // Add creator as founder
      await tx.member.create({
        data: {
          daoId: dao.id,
          userId,
          role: 'FOUNDER',
        },
      });

      return dao;
    });
  }

  async findAll(search?: string) {
    return this.prisma.dAO.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        _count: {
          select: { members: true, proposals: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const dao = await this.prisma.dAO.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: true },
        },
        proposals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!dao) {
      throw new NotFoundException('DAO not found');
    }
    return dao;
  }

  async addMember(daoId: string, userId: string, role: string) {
    return this.prisma.member.create({
      data: {
        daoId,
        userId,
        role,
      },
    });
  }

  async removeMember(daoId: string, userId: string) {
    return this.prisma.member.delete({
      where: {
        daoId_userId: {
          daoId,
          userId,
        },
      },
    });
  }

  async updateRole(daoId: string, userId: string, role: string) {
    return this.prisma.member.update({
      where: {
        daoId_userId: {
          daoId,
          userId,
        },
      },
      data: { role },
    });
  }

  async pauseDAO(id: string, isPaused: boolean) {
    return this.prisma.dAO.update({
      where: { id },
      data: { isPaused },
    });
  }
}

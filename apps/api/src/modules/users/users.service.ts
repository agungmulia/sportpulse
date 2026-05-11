import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        isPremium: true,
        createdAt: true,
        favoriteTeams: { include: { team: { select: { id: true, name: true, slug: true, logo: true } } } },
        favoriteLeagues: { include: { league: { select: { id: true, name: true, slug: true, logo: true } } } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: { displayName?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, username: true, displayName: true, avatar: true },
    });
  }

  async addFavoriteTeam(userId: string, teamId: string) {
    return this.prisma.userFavoriteTeam.upsert({
      where: { userId_teamId: { userId, teamId } },
      create: { userId, teamId },
      update: {},
    });
  }

  async removeFavoriteTeam(userId: string, teamId: string) {
    return this.prisma.userFavoriteTeam.delete({
      where: { userId_teamId: { userId, teamId } },
    });
  }

  async addFavoriteLeague(userId: string, leagueId: string) {
    return this.prisma.userFavoriteLeague.upsert({
      where: { userId_leagueId: { userId, leagueId } },
      create: { userId, leagueId },
      update: {},
    });
  }

  async removeFavoriteLeague(userId: string, leagueId: string) {
    return this.prisma.userFavoriteLeague.delete({
      where: { userId_leagueId: { userId, leagueId } },
    });
  }

  async updateNotifPrefs(
    userId: string,
    prefs: {
      goalAlerts?: boolean;
      matchStart?: boolean;
      matchReminder?: boolean;
      aiPredictions?: boolean;
      breakingNews?: boolean;
      fcmToken?: string;
    },
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...prefs },
      update: prefs,
    });
  }
}

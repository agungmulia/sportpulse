import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) throw new ConflictException('Email or username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, passwordHash },
      select: { id: true, email: true, username: true, role: true },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens({ id: user.id, email: user.email, username: user.username, role: user.role });
  }

  async refresh(token: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken: token },
      include: { user: { select: { id: true, email: true, username: true, role: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.userSession.delete({ where: { id: session.id } });
    return this.generateTokens(session.user);
  }

  async logout(refreshToken: string) {
    await this.prisma.userSession.deleteMany({ where: { refreshToken } });
  }

  async googleLogin(user: { email: string; googleId: string; displayName: string; avatar?: string }) {
    let dbUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: user.email }, { googleId: user.googleId }] },
    });

    if (!dbUser) {
      const username = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
      dbUser = await this.prisma.user.create({
        data: {
          email: user.email,
          username,
          googleId: user.googleId,
          displayName: user.displayName,
          avatar: user.avatar,
          provider: 'GOOGLE',
        },
      });
    }

    return this.generateTokens({ id: dbUser.id, email: dbUser.email, username: dbUser.username, role: dbUser.role });
  }

  private async generateTokens(user: { id: string; email: string; username: string; role: string }) {
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken, user };
  }
}

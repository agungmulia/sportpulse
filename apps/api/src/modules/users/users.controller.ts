import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { displayName?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  @Post('me/favorite-teams/:teamId')
  @ApiOperation({ summary: 'Add favorite team' })
  addFavoriteTeam(
    @CurrentUser('id') userId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.usersService.addFavoriteTeam(userId, teamId);
  }

  @Delete('me/favorite-teams/:teamId')
  @ApiOperation({ summary: 'Remove favorite team' })
  removeFavoriteTeam(
    @CurrentUser('id') userId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.usersService.removeFavoriteTeam(userId, teamId);
  }

  @Post('me/favorite-leagues/:leagueId')
  @ApiOperation({ summary: 'Add favorite league' })
  addFavoriteLeague(
    @CurrentUser('id') userId: string,
    @Param('leagueId') leagueId: string,
  ) {
    return this.usersService.addFavoriteLeague(userId, leagueId);
  }

  @Delete('me/favorite-leagues/:leagueId')
  @ApiOperation({ summary: 'Remove favorite league' })
  removeFavoriteLeague(
    @CurrentUser('id') userId: string,
    @Param('leagueId') leagueId: string,
  ) {
    return this.usersService.removeFavoriteLeague(userId, leagueId);
  }

  @Patch('me/notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  updateNotifPrefs(
    @CurrentUser('id') userId: string,
    @Body() body: { goalAlerts?: boolean; matchStart?: boolean; fcmToken?: string },
  ) {
    return this.usersService.updateNotifPrefs(userId, body);
  }
}

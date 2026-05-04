import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserJwtPayload } from '@ject-hub/contracts/hub/auth';

/**
 * Computes the root domain for cookie Domain attribute.
 * Extracts domain from Host header (e.g., "api.hub.localhost:3000" -> ".localhost")
 */
function computeCookieDomain(host: string): string {
  const hostname = host.split(':')[0]; // Remove port

  // For localhost or IP - don't set Domain attribute
  if (hostname === 'localhost' || /^[0-9.]+$/.test(hostname)) {
    return '';
  }

  // For *.localhost domains
  if (hostname.endsWith('.localhost')) {
    return 'Domain=.localhost; ';
  }

  // For other domains - take last two parts
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return `Domain=.${parts.slice(-2).join('.')}; `;
  }

  return '';
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: Request) {
    const loginResponse = await this.authService.login(loginDto);
    const cookieDomain = computeCookieDomain(req.headers.host || '');
    const refreshTokenCookie = `ject_refresh_token=${loginResponse.refreshToken}; ${cookieDomain}Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
    res.setHeader('Set-Cookie', refreshTokenCookie);
    return res.json(loginResponse);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response, @Req() req: Request) {
    const loginResponse = await this.authService.register(registerDto);
    const cookieDomain = computeCookieDomain(req.headers.host || '');
    const refreshTokenCookie = `ject_refresh_token=${loginResponse.refreshToken}; ${cookieDomain}Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
    res.setHeader('Set-Cookie', refreshTokenCookie);
    return res.json(loginResponse);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.headers.cookie || '';
    const refreshTokenMatch = cookies.match(/ject_refresh_token=([^;]+)/);

    if (!refreshTokenMatch) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Refresh token not found' });
    }

    const refreshToken = refreshTokenMatch[1];
    const tokens = await this.authService.refreshToken(refreshToken);
    const cookieDomain = computeCookieDomain(req.headers.host || '');
    const refreshTokenCookie = `ject_refresh_token=${tokens.refreshToken}; ${cookieDomain}Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
    res.setHeader('Set-Cookie', refreshTokenCookie);
    return res.json(tokens);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response, @Req() req: Request) {
    const cookieDomain = computeCookieDomain(req.headers.host || '');
    res.setHeader('Set-Cookie', [
      `ject_access_token=; ${cookieDomain}Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `ject_refresh_token=; ${cookieDomain}Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);
    return res.json({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = req.user as UserJwtPayload;
    return this.authService.getCurrentUser(user.sub);
  }
}

import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, UserJwtPayload, IUser } from '@app/contracts/hub/auth';
import { User } from './entities/user.entity';
import { MICROSERVICES_ACCESS } from '../microservices/microservices.controller';

/**
 * Checks if two microservices access objects are equal.
 */
function isMicroservicesEqual(a?: Record<string, boolean>, b?: Record<string, boolean>): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const existingUser = await this.usersService.findByUsername(registerDto.username);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.create(registerDto);
    return this.generateTokens(user);
  }

  /**
   * Refreshes tokens using the HttpOnly refresh token from cookie.
   * If microservices access has changed since token was issued, returns new token with fresh data.
   * @param refreshToken - The refresh token from HttpOnly cookie
   */
  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = this.jwtService.verify<UserJwtPayload>(refreshToken, {
        secret: process.env.JWT_SECRET || 'default-secret-key',
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if microservices access has changed since token was issued
      const tokenMicroservices = payload.microservices;
      const needsRefresh = !isMicroservicesEqual(tokenMicroservices, MICROSERVICES_ACCESS);

      if (needsRefresh) {
        this.logger.log(
          `Microservices access changed since token issued, issuing new token. ` +
            `Token: ${JSON.stringify(tokenMicroservices)}, Current: ${JSON.stringify(MICROSERVICES_ACCESS)}`,
        );
      }

      // Always generate new tokens with current MICROSERVICES_ACCESS
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    return this.usersService.findById(userId);
  }

  private mapUserToIUser(user: User): IUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email ?? '',
      role: user.role,
      licenseId: user.licenseId ?? undefined,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Generates access and refresh tokens.
   * Refresh token is designed to be stored in HttpOnly cookie.
   * Always uses current MICROSERVICES_ACCESS for up-to-date permissions.
   */
  private generateTokens(user: User): LoginResponseDto {
    const payload: UserJwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      licenseId: user.licenseId ?? '',
      microservices: MICROSERVICES_ACCESS,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: this.mapUserToIUser(user),
    };
  }
}

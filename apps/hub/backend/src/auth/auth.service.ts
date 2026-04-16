import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, UserJwtPayload, IUser } from '@app/contracts/hub/auth';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
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

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = this.jwtService.verify<UserJwtPayload>(refreshToken, {
        secret: process.env.JWT_SECRET || 'default-secret-key',
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

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

  private generateTokens(user: User): LoginResponseDto {
    const payload: UserJwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      licenseId: user.licenseId ?? '',
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

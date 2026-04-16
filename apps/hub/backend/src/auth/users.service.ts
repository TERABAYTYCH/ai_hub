import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async validateUser(username: string, password: string): Promise<any> {
    // TODO: Implement user validation logic
    return;
  }

  async create(registerDto: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return { ...registerDto, password: hashedPassword };
  }
}

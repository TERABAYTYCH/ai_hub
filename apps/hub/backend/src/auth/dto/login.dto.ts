import { IsString, IsNotEmpty } from 'class-validator';
import { LoginRequestDto } from '@app/contracts/hub/auth';

export class LoginDto implements LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

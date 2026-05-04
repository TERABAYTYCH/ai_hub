import { IsString, MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { RegisterRequestDto } from '@ject-hub/contracts/hub/auth';

export class RegisterDto implements RegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

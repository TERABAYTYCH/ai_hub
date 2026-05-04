import { IsString, IsNotEmpty } from 'class-validator';
import { LoginRequestDto } from '@ject-hub/contracts/hub/auth';

export class LoginDto implements LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

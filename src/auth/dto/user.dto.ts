import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Your username' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Your password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Your username' })
  @IsString()
  username: string;
  
  @ApiProperty({ description: 'Your name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Your password' })
  @IsString()
  @MinLength(6)
  password: string;
}

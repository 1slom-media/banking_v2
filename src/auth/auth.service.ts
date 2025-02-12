import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { AuthEntity } from './entities/auth.entitiy';
import { Repository } from 'typeorm';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity, 'main')
    public authRepo: Repository<AuthEntity>,
    @InjectRepository(UserEntity, 'main')
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getAccessToken(): Promise<string> {
    const auth = await this.authRepo.findOneBy({ id: String(1) });
    if (!auth) {
      throw new Error('Authentication data not found');
    }
    return auth.access_token;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async register(userDto: RegisterDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10); // Hashlash
    const newUser = this.userRepo.create({ ...userDto, password: hashedPassword });
    return this.userRepo.save(newUser);
  }
  

  // @Cron('50 10 15 * * *')
  // @Cron('0 54 14 * * *')
  async refreshToken() {
    // find auth
    const auth = await this.authRepo.findOneBy({ id: String(1) });

    if (!auth) {
      console.log('No authentication data found');
      throw new NotFoundException('No authentication data found');
    }

    const apiUrl = `${process.env.DAVR_URL}/api/token`;
    console.log(apiUrl, 'api');
    try {
      const response = await axios.post(apiUrl, {
        grant_type: 'refresh_token',
        access_token: auth.access_token,
        refresh_token: auth.refresh_token,
      });
      const { access_token, refresh_token } = response.data;

      // update auth
      auth.access_token = access_token;
      auth.refresh_token = refresh_token;
      await this.authRepo.save(auth);
      return {
        message: 'Tokens updated successfully',
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Failed to refresh tokens:', error.message);
      throw new BadRequestException('Failed to refresh tokens');
    }
  }
}

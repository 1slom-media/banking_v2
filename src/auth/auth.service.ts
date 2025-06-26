import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entitiy';
import { Repository } from 'typeorm';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { decryptToken, encryptToken } from 'src/utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity, 'main')
    public authRepo: Repository<AuthEntity>,
    @InjectRepository(UserEntity, 'main')
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // type va providerga qarab token olinadi va decryp qilib return qilinadi
  async getAccessToken(type: string, provider: string): Promise<string> {
    const auth = await this.authRepo.findOneBy({ type, provider });
    if (!auth) {
      throw new Error('Authentication data not found');
    }
    const decryptedToken = decryptToken(auth.access_token);

    return decryptedToken;
  }

  // userni tekshirish
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
    const token = this.jwtService.sign(payload, { expiresIn: '12h' });

    return { access_token: token };
  }

  async register(userDto: RegisterDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10); // Hashlash
    const newUser = this.userRepo.create({
      ...userDto,
      password: hashedPassword,
    });
    return this.userRepo.save(newUser);
  }

  async loginAnor(login: LoginDto) {
    const auth = await this.authRepo.findOneBy({
      type: 'prod',
      provider: 'ANORBANK',
    });
    if (!auth) {
      console.log('No authentication data found');
      throw new NotFoundException('No authentication data found');
    }
    const apiUrl = `${process.env.ANOR_URL}/login`;
    try {
      const response = await axios.post(apiUrl, {
        username: login.username,
        password: login.password,
      });
      const { access_token, refresh_token, expires_in, refresh_expires_in } =
        response.data.result;
      auth.access_token = encryptToken(access_token);
      auth.refresh_token = encryptToken(refresh_token);
      auth.expires_in_anor = expires_in;
      auth.refresh_expires_in_anor = refresh_expires_in;
      await this.authRepo.save(auth);
      return {
        message: 'Tokens updated successfully',
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Failed to login tokens:', error.message);
      throw new BadRequestException('Failed to login');
    }
  }

  async refreshTokenDavr() {
    const auth = await this.authRepo.findOneBy({
      type: 'prod',
      provider: 'DAVRBANK',
    });

    if (!auth) {
      console.log('No authentication data found');
      throw new NotFoundException('No authentication data found');
    }

    const apiUrl = `${process.env.DAVR_URL}/api/token`;
    try {
      const response = await axios.post(apiUrl, {
        grant_type: 'refresh_token',
        access_token: decryptToken(auth.access_token),
        refresh_token: decryptToken(auth.refresh_token),
      });
      const { access_token, refresh_token } = response.data;
      console.log(response.data, 'dt login davr');
      // update auth
      auth.access_token = encryptToken(access_token);
      auth.refresh_token = encryptToken(refresh_token);
      auth.expires_in_anor = access_token;
      auth.refresh_expires_in_anor = refresh_token;
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

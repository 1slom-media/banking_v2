import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { AuthEntity } from './entities/auth.entitiy';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity, 'main')
    public authRepo: Repository<AuthEntity>,
  ) {}

  async getAccessToken(): Promise<string> {
    const auth = await this.authRepo.findOneBy({ id: String(1) });
    if (!auth) {
      throw new Error('Authentication data not found');
    }
    return auth.access_token;
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

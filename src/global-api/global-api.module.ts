import { Module, Global } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { getApiClient } from './axios';

@Global()
@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: 'API_CLIENT',
      useFactory: async (authService: AuthService) => await getApiClient(authService),
      inject: [AuthService],
    },
  ],
  exports: ['API_CLIENT'],
})
export class GlobalApiModule {}

// global-api.module.ts
import { Module, Global } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { getApiClient } from './axios';

@Global()
@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: 'DAVR_API_CLIENT',
      useFactory: async (authService: AuthService) =>
        getApiClient(authService, process.env.DAVR_URL, 'prod', 'DAVRBANK'),
      inject: [AuthService],
    },
    {
      provide: 'ANOR_API_CLIENT',
      useFactory: async (authService: AuthService) =>
        getApiClient(authService, process.env.ANOR_URL, 'prod', 'ANORBANK'),
      inject: [AuthService],
    },
  ],
  exports: ['DAVR_API_CLIENT', 'ANOR_API_CLIENT'],
})
export class GlobalApiModule {}

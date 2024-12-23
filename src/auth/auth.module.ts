import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entitiy';

@Module({
  imports:[
    TypeOrmModule.forFeature([AuthEntity],'main')
  ],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}

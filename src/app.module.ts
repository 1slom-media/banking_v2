import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './auth/entities/auth.entitiy';
import { AuthModule } from './auth/auth.module';
import { GlobalApiModule } from './global-api/global-api.module';
import { BalanceModule } from './balance/balance.module';
import { DavrBalanceEntity } from './balance/davrbank/entities/balance.entity';
import { ExtractModule } from './extract/extract.module';
import { DavrExtractEntity } from './extract/davrbank/entities/extract.entity';
import { PaymentsModule } from './payments/payments.module';
import { DavrPaymentsEntity } from './payments/davrbank/entities/payments.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    // Birinchi ma'lumotlar bazasi ulanishi
    TypeOrmModule.forRoot({
      name: 'main',
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [
        AuthEntity,
        DavrBalanceEntity,
        DavrExtractEntity,
        DavrPaymentsEntity,
      ],
      synchronize: true,
    }),
    // Ikkinchi ma'lumotlar bazasi ulanishi
    TypeOrmModule.forRoot({
      name: 'secondary',
      type: 'postgres',
      host: process.env.SECONDARY_PG_HOST,
      port: parseInt(process.env.SECONDARY_PG_PORT),
      username: process.env.SECONDARY_PG_USER,
      password: process.env.SECONDARY_PG_PASSWORD,
      database: process.env.SECONDARY_PG_DATABASE,
      entities: [],
      synchronize: true,
    }),
    // Modules
    AuthModule,
    GlobalApiModule,
    BalanceModule,
    ExtractModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AllgoodPropService } from './allgood-prop.service';
import { AllgoodPropController } from './allgood-prop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllgoodPropEntity } from './entities/allgood-prop';

@Module({
  imports: [TypeOrmModule.forFeature([AllgoodPropEntity], 'main')],
  providers: [AllgoodPropService],
  exports:[AllgoodPropService],
  controllers: [AllgoodPropController],
})
export class AllgoodPropModule {}
